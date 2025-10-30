import { IsOptional, IsString } from 'class-validator'

export class CreateMessageDto {
	@IsString()
	@IsOptional()
	prompt?: string
}
