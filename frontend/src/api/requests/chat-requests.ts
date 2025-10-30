import { api } from '../instance'
import { CreateMessageDto, IChat, IMessage } from '../types'

export const createNewChat = async (data: {
	prompt: string
	files?: File[]
}): Promise<IChat> => {
	const formData = new FormData()
	formData.append('prompt', data.prompt)

	if (data.files && data.files.length > 0) {
		data.files.forEach(file => {
			formData.append('files', file)
		})
	}

	const res = await api.post<IChat>('/chat/new-chat', formData)
	return res.data
}

export const getAllChats = async (): Promise<IChat[]> => {
	const res = await api.get<IChat[]>('/chat/all-chats')
	return res.data
}

export const getHistoryChat = async (
	sessionId: string
): Promise<IMessage[]> => {
	const res = await api.get<IMessage[]>(`/chat/${sessionId}/history`)
	return res.data
}

export const sendPrompt = async ({
	sessionId,
	...data
}: { sessionId: string } & CreateMessageDto): Promise<any> => {
	const formData = new FormData()
	formData.append('prompt', data.prompt)

	if (data.files && data.files.length > 0) {
		data.files.forEach(file => {
			formData.append('files', file)
		})
	}

	const res = await api.post(`/chat/${sessionId}/prompt`, formData)

	if (res.status === 400) {
		throw new Error(res.data.message)
	}

	return res.data
}
