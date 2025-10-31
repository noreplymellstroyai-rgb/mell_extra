import {
	UseMutationOptions,
	type UseQueryOptions,
	useMutation,
	useQuery,
	useQueryClient
} from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { chatKeys, createUserMessage } from '@/lib/utils'

import {
	createNewChat,
	deleteChatRequest,
	getAllChats,
	getHistoryChat,
	renameChatRequest,
	sendPrompt
} from '../requests'
import { CreateMessageDto, IChat, IMessage, RenameChatPayload } from '../types'

type SendPromptVariables = { sessionId: string } & CreateMessageDto
type CreateNewChatVariables = { prompt: string; files?: File[] }
type RenameChatVariables = { sessionId: string; payload: RenameChatPayload }

export function useGetAllChatsQuery(
	options?: Omit<UseQueryOptions<IChat[], Error>, 'queryKey' | 'queryFn'>
) {
	return useQuery({
		queryKey: chatKeys.all,
		queryFn: () => getAllChats(),
		...options
	})
}

export function useGetHistoryChatQuery(
	sessionId: string,
	options?: Omit<UseQueryOptions<IMessage[], Error>, 'queryKey' | 'queryFn'>
) {
	return useQuery({
		queryKey: ['getHistoryChat', sessionId],
		queryFn: () => getHistoryChat(sessionId),
		...options
	})
}

export function useSendPromptMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (variables: SendPromptVariables) => sendPrompt(variables),

		onMutate: async (variables: SendPromptVariables) => {
			const { sessionId, prompt, files } = variables
			const queryKey = chatKeys.history(sessionId)

			await queryClient.cancelQueries({ queryKey })

			const previousMessages =
				queryClient.getQueryData<IMessage[]>(queryKey)

			const userMessage = createUserMessage(prompt)
			if (files && files.length > 0) {
				userMessage.attachmentUrls = files.map(file =>
					URL.createObjectURL(file)
				)
			}

			const thinkingMessage: IMessage = {
				id: 'thinking-placeholder',
				role: 'assistant',
				content: '[[THINKING]]',
				createdAt: new Date().toISOString()
			}

			queryClient.setQueryData<IMessage[]>(queryKey, oldData => [
				...(oldData || []),
				userMessage,
				thinkingMessage
			])

			return { previousMessages }
		},

		onError: (err, variables, context) => {
			const queryKey = chatKeys.history(variables.sessionId)
			if (context?.previousMessages) {
				queryClient.setQueryData(queryKey, context.previousMessages)
			}
			console.error('Ошибка при отправке промпта:', err)
		},

		onSettled: (data, error, variables) => {
			queryClient.invalidateQueries({
				queryKey: chatKeys.history(variables.sessionId)
			})
		}
	})
}

export function useSendNewChatPromptMutation(
	options?: UseMutationOptions<IChat, Error, CreateNewChatVariables>
) {
	const queryClient = useQueryClient()
	const router = useRouter()

	return useMutation({
		mutationFn: (variables: CreateNewChatVariables) =>
			createNewChat(variables),

		onSuccess: async (newChat, variables) => {
			await queryClient.invalidateQueries({ queryKey: chatKeys.all })

			const userMessage = createUserMessage(variables.prompt)
			if (variables.files && variables.files.length > 0) {
				userMessage.attachmentUrls = variables.files.map(file =>
					URL.createObjectURL(file)
				)
			}

			const thinkingMessage: IMessage = {
				id: 'thinking-placeholder',
				role: 'assistant',
				content: '[[THINKING]]',
				createdAt: new Date().toISOString()
			}

			const newChatHistoryKey = chatKeys.history(newChat.id)
			queryClient.setQueryData(newChatHistoryKey, [
				userMessage,
				thinkingMessage
			])

			router.push(`/chat/${newChat.id}`)

			try {
				await sendPrompt({
					sessionId: newChat.id,
					prompt: variables.prompt,
					files: variables.files
				})

				await queryClient.invalidateQueries({
					queryKey: newChatHistoryKey
				})
			} catch (error) {
				console.error(
					'Чат создан, но не удалось отправить первое сообщение для генерации ответа:',
					error
				)
			}
			setTimeout(() => {
				console.log(
					'Отложенная инвалидация списка чатов для получения AI-заголовка...'
				)
				queryClient.invalidateQueries({ queryKey: chatKeys.all })
			}, 8000)
		},

		onError: error => {
			console.error('Ошибка при создании нового чата:', error)
		},
		...options
	})
}

export const useRenameChatMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (variables: RenameChatVariables) =>
			renameChatRequest(variables),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.all })
		},

		onError: error => {
			console.error('Ошибка при переименовании чата:', error)
		}
	})
}

export function useDeleteChatMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (sessionId: string) => deleteChatRequest(sessionId),

		onSuccess: (data, deletedSessionId) => {
			console.log('Чат удален. Инвалидируем кэш...')

			queryClient.invalidateQueries({ queryKey: chatKeys.all })

			queryClient.removeQueries({
				queryKey: chatKeys.history(deletedSessionId)
			})
		},

		onError: error => {
			console.error('Ошибка при удалении чата:', error)
		}
	})
}
