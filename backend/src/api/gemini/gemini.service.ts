import {
	Content,
	GenerationConfig,
	GenerativeModel,
	GoogleGenerativeAI,
	Part
} from '@google/generative-ai'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ContentBlock } from './interfaces/content.interface'

@Injectable()
export class GeminiService {
	private readonly JSON_MODEL: GenerativeModel
	private readonly TEXT_ONLY_MODEL: GenerativeModel

	private readonly GEMINI_API_KEY: string
	private readonly GEMINI_MODEL: string
	private readonly SYSTEM_PROMPT: string

	private readonly logger = new Logger(GeminiService.name)

	constructor(configService: ConfigService) {
		this.GEMINI_API_KEY = configService.getOrThrow<string>('GEMINI_API_KEY')
		this.GEMINI_MODEL = configService.getOrThrow<string>('GEMINI_MODEL')
		this.SYSTEM_PROMPT = configService.getOrThrow<string>('SYSTEM_PROMPT')

		const GOOGLE_AI = new GoogleGenerativeAI(this.GEMINI_API_KEY)

		const jsonGenerationConfig: GenerationConfig = {
			responseMimeType: 'application/json'
		}

		this.JSON_MODEL = GOOGLE_AI.getGenerativeModel({
			model: this.GEMINI_MODEL,
			systemInstruction: this.SYSTEM_PROMPT,
			generationConfig: jsonGenerationConfig
		})

		this.TEXT_ONLY_MODEL = GOOGLE_AI.getGenerativeModel({
			model: this.GEMINI_MODEL
		})
	}

	async generateText(
		history: Content[],
		parts: Part[]
	): Promise<ContentBlock[]> {
		try {
			const chat = this.JSON_MODEL.startChat({ history })
			const result = await chat.sendMessage(parts)
			const responseText = result.response.text()
			const parsedResponse = JSON.parse(responseText)
			return parsedResponse
		} catch (error) {
			this.logger.error('Ошибка при генерации JSON от Gemini >>', error)
			throw new Error(
				'Ошибка при генерации или парсинге JSON ответа от Gemini'
			)
		}
	}

	async generateSimpleText(prompt: string): Promise<string> {
		try {
			const result = await this.TEXT_ONLY_MODEL.generateContent(prompt)
			return result.response.text()
		} catch (error) {
			this.logger.error(
				'Ошибка при генерации простого текста от Gemini >>',
				error
			)
			throw new Error('Ошибка при генерации ответа от Gemini')
		}
	}
}
