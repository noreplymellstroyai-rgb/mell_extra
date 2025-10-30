import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class GetAIMessageDTO {
	@IsNotEmpty({ message: 'Prompt не может быть пустым' })
	@IsString()
	prompt: string

	sessionId: string
}
