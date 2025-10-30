export interface CreateMessageDto {
	prompt: string
	files?: File[]
}

export interface IChat {
	id: string
	title?: string
	createdAt: string
	updatedAt: string
}

export interface IMessage {
	id: string
	content: string
	role: 'user' | 'assistant'
	attachmentUrls?: string[]
	createdAt: string
}
