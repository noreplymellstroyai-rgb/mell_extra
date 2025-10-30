import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UploadedFiles,
	UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Authorized, Protected } from 'src/common/decorators'

import { ChatService } from './chat.service'
import { CreateMessageDto } from './dto/create-message.dto'
import { RenameChatDto } from './dto/rename-chat.dto'

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Protected()
	@Post('new-chat')
	createNewChat(@Authorized('id') userId: string) {
		return this.chatService.createNewChat(userId)
	}

	@Protected()
	@Get('all-chats')
	getAllChats(@Authorized('id') userId: string) {
		return this.chatService.getAllChats(userId)
	}

	@Protected()
	@Get(':sessionId/history')
	getHistoryChat(
		@Authorized('id') userId: string,
		@Param('sessionId') sessionId: string
	) {
		return this.chatService.getMessagesBySessionId(userId, sessionId)
	}

	@Protected()
	@Post(':sessionId/prompt')
	@UseInterceptors(FilesInterceptor('files', 5))
	sendPrompt(
		@Authorized('id') userId: string,
		@Param('sessionId') sessionId: string,
		@Body() dto: CreateMessageDto,
		@UploadedFiles() files: Express.Multer.File[]
	) {
		return this.chatService.sendPrompt(userId, sessionId, dto, files)
	}

	@Protected()
	@Patch(':sessionId/rename')
	renameChat(
		@Authorized('id') userId: string,
		@Param('sessionId') sessionId: string,
		@Body() dto: RenameChatDto
	) {
		return this.chatService.renameChat(userId, sessionId, dto)
	}

	@Protected()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':sessionId')
	deleteChat(
		@Authorized('id') userId: string,
		@Param('sessionId') sessionId: string
	) {
		return this.chatService.deleteChat(userId, sessionId)
	}
}
