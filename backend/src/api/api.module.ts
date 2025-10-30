import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { ChatModule } from './chat/chat.module'
import { EmailModule } from './email/email.module'
import { GeminiModule } from './gemini/gemini.module'
import { UserModule } from './user/user.module'
import { FileModule } from './file/file.module';

@Module({
	imports: [AuthModule, UserModule, EmailModule, ChatModule, GeminiModule, FileModule]
})
export class ApiModule {}
