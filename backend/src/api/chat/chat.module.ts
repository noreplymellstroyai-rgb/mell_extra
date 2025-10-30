import { BadRequestException, Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'

import { FileModule } from '../file/file.module'
import { GeminiService } from '../gemini/gemini.service'

import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'

@Module({
	imports: [
		FileModule,
		MulterModule.register({
			storage: memoryStorage(),
			fileFilter: (req, file, cb) => {
				const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg']
				if (allowedMimes.includes(file.mimetype)) {
					cb(null, true)
				} else {
					cb(
						new BadRequestException(
							'Поддерживаются только форматы JPEG и PNG'
						),
						false
					)
				}
			},
			limits: { fileSize: 1024 * 1024 * 10 }
		})
	],
	controllers: [ChatController],
	providers: [ChatService, GeminiService]
})
export class ChatModule {}
