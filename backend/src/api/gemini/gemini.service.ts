import {
	Content,
	GenerationConfig,
	GenerativeModel,
	GoogleGenerativeAI,
	Part
} from '@google/generative-ai'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ContentBlock } from './interfaces/content.interface'

@Injectable()
export class GeminiService {
	private readonly MODEL: GenerativeModel

	private readonly GEMINI_API_KEY: string
	private readonly GEMINI_MODEL: string
	private readonly SYSTEM_PROMPT: string

	private readonly logger = new Logger(GeminiService.name)

	constructor(configService: ConfigService) {
		this.GEMINI_API_KEY = configService.getOrThrow<string>('GEMINI_API_KEY')
		this.GEMINI_MODEL = configService.getOrThrow<string>('GEMINI_MODEL')
		this.SYSTEM_PROMPT = configService.getOrThrow<string>('SYSTEM_PROMPT')

		const GOOGLE_AI = new GoogleGenerativeAI(this.GEMINI_API_KEY)

		const generationConfig: GenerationConfig = {
			responseMimeType: 'application/json'
		}

		this.MODEL = GOOGLE_AI.getGenerativeModel({
			model: this.GEMINI_MODEL,
			systemInstruction: this.SYSTEM_PROMPT,
			generationConfig: generationConfig
		})
	}

	async generateText(
		history: Content[],
		parts: Part[]
	): Promise<ContentBlock[]> {
		try {
			const chat = this.MODEL.startChat({ history })
			const result = await chat.sendMessage(parts)
			const responseText = result.response.text()

			const parsedResponse = JSON.parse(responseText)

			return parsedResponse
		} catch (error) {
			if (error instanceof SyntaxError) {
				this.logger.error('Ошибка парсинга JSON от Gemini!', error)
			}
			this.logger.error('Ошибка при генерации ответа от Gemini >>', error)
			throw new Error(
				'Ошибка при генерации или парсинге ответа от Gemini'
			)
		}
	}
}
