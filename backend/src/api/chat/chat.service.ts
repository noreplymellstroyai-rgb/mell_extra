import { Part } from '@google/generative-ai'
import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	Logger,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ChatSession } from '@prisma/client'
import { path as rootPath } from 'app-root-path'
import * as fs from 'fs'
import Redis from 'ioredis'
import * as path from 'path'
import { ms, StringValue } from 'src/common/utils'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { FileService } from '../file/file.service'
import { GeminiService } from '../gemini/gemini.service'

import { CreateMessageDto } from './dto/create-message.dto'
import { RenameChatDto } from './dto/rename-chat.dto'

@Injectable()
export class ChatService {
	private readonly CHAT_LIMIT_PER_MINUTE: number
	private readonly CHAT_WINDOW_MINUTE: StringValue
	private readonly CHAT_LIMIT_PER_HOUR: number
	private readonly CHAT_WINDOW_HOUR: StringValue
	private readonly CHAT_LIMIT_PER_DAY: number
	private readonly CHAT_WINDOW_DAY: StringValue
	private readonly logger = new Logger(ChatService.name)

	constructor(
		@Inject('REDIS_CLIENT') private readonly redis: Redis,
		private readonly prismaService: PrismaService,
		private readonly gemini: GeminiService,
		private readonly fileService: FileService,
		private readonly configService: ConfigService
	) {
		this.CHAT_LIMIT_PER_MINUTE = configService.getOrThrow<number>(
			'CHAT_LIMIT_PER_MINUTE'
		)
		this.CHAT_WINDOW_MINUTE =
			configService.getOrThrow<StringValue>('CHAT_WINDOW_MINUTE')

		this.CHAT_LIMIT_PER_HOUR = configService.getOrThrow<number>(
			'CHAT_LIMIT_PER_HOUR'
		)
		this.CHAT_WINDOW_HOUR =
			configService.getOrThrow<StringValue>('CHAT_WINDOW_HOUR')

		this.CHAT_LIMIT_PER_DAY =
			configService.getOrThrow<number>('CHAT_LIMIT_PER_DAY')
		this.CHAT_WINDOW_DAY =
			configService.getOrThrow<StringValue>('CHAT_WINDOW_DAY')
	}

	async createNewChat(userId: string) {
		return this.prismaService.chatSession.create({
			data: {
				userId,
				title: 'Новый чат'
			}
		})
	}

	async getAllChats(userId: string) {
		return this.prismaService.chatSession.findMany({
			where: { userId },
			orderBy: { updatedAt: 'desc' }
		})
	}

	async getMessagesBySessionId(userId: string, sessionId: string) {
		await this.validateSessionAccess(userId, sessionId)

		return this.prismaService.chatMessage.findMany({
			where: { chatSessionId: sessionId },
			orderBy: { createdAt: 'asc' }
		})
	}

	async sendPrompt(
		userId: string,
		sessionId: string,
		dto: CreateMessageDto,
		files?: Express.Multer.File[]
	) {
		const session = await this.validateSessionAccess(userId, sessionId)
		await this.checkChatRateLimit(userId)

		const { prompt } = dto

		if (!prompt && (!files || files.length === 0)) {
			throw new BadRequestException('Требуется файл или промпт')
		}

		const isFirstMessage = session.title === 'Новый чат'

		let savedFiles: { url: string; name: string }[] = []

		if (files && files.length > 0) {
			savedFiles = await Promise.all(
				files.map(file => this.fileService.saveImage(file, 'chats'))
			)
		}

		const historyFromDb = await this.prismaService.chatMessage.findMany({
			where: { chatSessionId: sessionId },
			orderBy: { createdAt: 'asc' },
			take: 20
		})

		const historyForGemini = historyFromDb.map(msg => ({
			role: msg.role === 'user' ? 'user' : 'model',
			parts: [{ text: msg.content || '' }]
		}))

		const messageParts: Part[] = []

		if (prompt) {
			messageParts.push({ text: prompt })
		}

		if (savedFiles.length > 0) {
			for (const savedFile of savedFiles) {
				const absolutePath = path.join(rootPath, savedFile.url)
				messageParts.push({
					inlineData: {
						mimeType: 'image/webp',
						data: fs.readFileSync(absolutePath).toString('base64')
					}
				})
			}
		}

		const aiResponseObject = await this.gemini.generateText(
			historyForGemini,
			messageParts
		)

		const [, modelMessage] = await this.prismaService.$transaction([
			this.prismaService.chatMessage.create({
				data: {
					chatSessionId: sessionId,
					content: prompt,
					attachmentUrls: savedFiles.map(f => f.url),
					role: 'user'
				}
			}),
			this.prismaService.chatMessage.create({
				data: {
					chatSessionId: sessionId,
					content: JSON.stringify(aiResponseObject),
					role: 'model'
				}
			}),
			this.prismaService.chatSession.update({
				where: { id: sessionId },
				data: { updatedAt: new Date() }
			})
		])

		if (isFirstMessage && prompt) {
			this.generateAndSaveChatTitle(sessionId, prompt).catch(err => {
				this.logger.error(
					`Ошибка генерации заголовка ${sessionId}: ${err.message}`
				)
			})
		}

		return {
			...modelMessage,
			content: aiResponseObject
		}
	}

	async renameChat(userId: string, sessionId: string, dto: RenameChatDto) {
		await this.validateSessionAccess(userId, sessionId)
		await this.checkChatRateLimit(userId)

		return this.prismaService.chatSession.update({
			where: { id: sessionId },
			data: {
				title: dto.title
			}
		})
	}

	async deleteChat(userId: string, sessionId: string) {
		await this.validateSessionAccess(userId, sessionId)

		await this.prismaService.chatSession.delete({
			where: { id: sessionId }
		})

		return { message: 'Чат успешно удален' }
	}

	private async generateAndSaveChatTitle(
		sessionId: string,
		firstPrompt: string
	) {
		this.logger.log(`Генерация заголовка: ${sessionId}`)

		const titlePrompt = `Ты - стример меллстрой дерзкий и уверенный. Сгенерируй короткий заголовок (максимум 5 слов) для чата, который начинается с этого сообщения: "${firstPrompt}". В ответе верни только сам заголовок без кавычек и лишних слов.`

		const generatedTitle = await this.gemini.generateSimpleText(titlePrompt)

		if (generatedTitle && typeof generatedTitle === 'string') {
			const cleanedTitle = generatedTitle.trim().replace(/"/g, '')

			await this.prismaService.chatSession.update({
				where: { id: sessionId },
				data: { title: cleanedTitle }
			})
			this.logger.log(
				`Заголовок сгенерирован ${sessionId}: "${cleanedTitle}"`
			)
		} else {
			this.logger.warn(`Ошибка генерации заголовка ${sessionId}`)
		}
	}

	private async validateSessionAccess(
		userId: string,
		sessionId: string
	): Promise<ChatSession> {
		const session = await this.prismaService.chatSession.findUnique({
			where: { id: sessionId }
		})

		if (!session) {
			throw new NotFoundException('Сессия чата не найдена')
		}
		if (session.userId !== userId) {
			throw new ForbiddenException('Доступ запрещен')
		}
		return session
	}

	public async checkChatRateLimit(userId: string): Promise<void> {
		const limitConfigs = [
			{
				limit: this.CHAT_LIMIT_PER_MINUTE,
				window: this.CHAT_WINDOW_MINUTE,
				keySuffix: 'minute'
			},
			{
				limit: this.CHAT_LIMIT_PER_HOUR,
				window: this.CHAT_WINDOW_HOUR,
				keySuffix: 'hour'
			},
			{
				limit: this.CHAT_LIMIT_PER_DAY,
				window: this.CHAT_WINDOW_DAY,
				keySuffix: 'day'
			}
		]

		for (const config of limitConfigs) {
			const maxAttempts = config.limit
			const cooldownSeconds = ms(config.window) / 1000

			const key = `rate-limit:chat:${userId}:${config.keySuffix}`

			const currentCount = await this.redis.incr(key)

			if (currentCount === 1) {
				await this.redis.expire(key, cooldownSeconds)
			}

			if (currentCount > maxAttempts) {
				const ttl = await this.redis.ttl(key)
				const cooldown = ttl > 0 ? ttl : cooldownSeconds

				throw new BadRequestException({
					message: `Превышен лимит запросов (${config.keySuffix}). Повторите попытку позже.`,
					cooldown: cooldown
				})
			}
		}
	}
}
