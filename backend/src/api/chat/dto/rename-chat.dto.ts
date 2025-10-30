import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class RenameChatDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	title: string
}
