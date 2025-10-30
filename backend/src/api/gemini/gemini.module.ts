import { Module } from '@nestjs/common'

import { UserService } from '../user/user.service'

import { GeminiService } from './gemini.service'

@Module({
	providers: [GeminiService, UserService]
})
export class GeminiModule {}
