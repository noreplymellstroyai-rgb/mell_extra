'use client'

import { useEffect, useRef } from 'react'

import { useGetHistoryChatQuery, useSendPromptMutation } from '@/api/hooks'

import { usePrompt } from '@/hooks/chat/use-set-prompt'

import { ChatAttachment } from './chat-attachment'
import { ChatInputForm } from './chat-input-form'

export default function SessionChat({ sessionId }: { sessionId: string }) {
	const { data: messages } = useGetHistoryChatQuery(sessionId, {
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity
	})

	const { mutate: sendPromptMutation, isPending } = useSendPromptMutation()
	const messagesEndRef = useRef<null | HTMLDivElement>(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		setTimeout(() => scrollToBottom(), 100)
	}, [messages])

	const handleSend = (promptText: string, files?: File[]) => {
		sendPromptMutation({ sessionId, prompt: promptText, files })
	}

	const { prompt, setPrompt, handleKeyPress } = usePrompt(() => {})

	return (
		<div className='text-foreground flex h-full w-full flex-col'>
			<div className='flex-1 overflow-y-auto p-6'>
				{/* ИСПРАВЛЕНИЕ ЗДЕСЬ: Добавлен класс "min-h-full" */}
				<div className='mx-auto flex min-h-full w-full max-w-4xl flex-col justify-end'>
					<div className='flex flex-col gap-4'>
						{messages?.map(message => (
							<div
								key={message.id}
								className={`flex ${
									message.role === 'user'
										? 'justify-end'
										: 'justify-start'
								}`}
							>
								<div
									className={`max-w-2xl rounded-lg px-4 py-2 ${
										message.role === 'user'
											? 'bg-foreground/5'
											: 'bg-transparent'
									}`}
								>
									{message.attachmentUrls &&
										message.attachmentUrls.length > 0 && (
											<div className='mb-2 flex flex-wrap gap-2'>
												{message.attachmentUrls.map(
													url => (
														<div
															key={url}
															className='relative h-40 w-40'
														>
															<ChatAttachment
																url={url}
															/>
														</div>
													)
												)}
											</div>
										)}
									{message.content}
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
				</div>
			</div>

			<div className='bg-transparent p-4 pt-0'>
				<div className='mx-auto w-full max-w-4xl'>
					<ChatInputForm
						prompt={prompt}
						setPrompt={setPrompt}
						handleSendPrompt={handleSend}
						handleKeyPress={handleKeyPress}
						isLoading={isPending}
					/>
				</div>
			</div>
		</div>
	)
}
