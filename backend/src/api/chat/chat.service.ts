import { Part } from '@google/generative-ai'
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException
} from '@nestjs/common'
import { ChatSession } from '@prisma/client'
import { path as rootPath } from 'app-root-path'
import * as fs from 'fs'
import * as path from 'path'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { FileService } from '../file/file.service'
import { GeminiService } from '../gemini/gemini.service'

import { CreateMessageDto } from './dto/create-message.dto'
import { RenameChatDto } from './dto/rename-chat.dto'

@Injectable()
export class ChatService {
	private readonly logger = new Logger(ChatService.name)

	constructor(
		private readonly prismaService: PrismaService,
		private readonly gemini: GeminiService,
		private readonly fileService: FileService
	) {}

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
					`Failed to generate title for session ${sessionId}: ${err.message}`
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
		this.logger.log(`Generating title for chat session: ${sessionId}`)

		const titlePrompt = `Сгенерируй короткий заголовок (максимум 5 слов) для чата, который начинается с этого сообщения: "${firstPrompt}". В ответе верни только сам заголовок без кавычек и лишних слов.`

		const generatedTitle = await this.gemini.generateSimpleText(titlePrompt)

		if (generatedTitle && typeof generatedTitle === 'string') {
			const cleanedTitle = generatedTitle.trim().replace(/"/g, '')

			await this.prismaService.chatSession.update({
				where: { id: sessionId },
				data: { title: cleanedTitle }
			})
			this.logger.log(
				`Successfully generated and saved title for chat ${sessionId}: "${cleanedTitle}"`
			)
		} else {
			this.logger.warn(
				`Could not generate a valid title for ${sessionId}`
			)
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
}
