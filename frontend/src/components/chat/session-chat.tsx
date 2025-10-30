'use client'

import { useGetHistoryChatQuery, useSendPromptMutation } from '@/api/hooks'

import { AiResponseRenderer } from '@/components/chat/ai-response-renderer'

import { useAutoScroll } from '@/hooks/chat/use-auto-scroll'
import { usePrompt } from '@/hooks/chat/use-set-prompt'

import { parseAiContent } from '@/lib/utils'

import { ChatAttachment } from './chat-attachment'
import { ChatInputForm } from './chat-input-form'

export default function SessionChat({ sessionId }: { sessionId: string }) {
	const { data: messages } = useGetHistoryChatQuery(sessionId, {
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity
	})

	const { mutate: sendPromptMutation, isPending } = useSendPromptMutation()
	const { prompt, setPrompt, handleKeyPress } = usePrompt(() => {})

	const messagesEndRef = useAutoScroll(messages)

	const handleSend = (promptText: string, files?: File[]) => {
		sendPromptMutation({ sessionId, prompt: promptText, files })
	}

	return (
		<div className='text-foreground flex h-full w-full flex-col'>
			<div className='flex-1 overflow-y-auto p-6'>
				<div className='mx-auto flex min-h-full w-full max-w-5xl flex-col justify-end'>
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
									className={`rounded-lg py-2 ${
										message.role === 'user'
											? 'bg-foreground/5 px-4 max-w-xl'
											: 'bg-transparent px-1'
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

									{message.role === 'user' ? (
										<p className='whitespace-pre-wrap'>
											{message.content}
										</p>
									) : (
										<AiResponseRenderer
											content={parseAiContent(
												message.content
											)}
										/>
									)}
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
				</div>
			</div>

			<div className='bg-transparent p-4 pt-0'>
				<div className='mx-auto w-full max-w-5xl'>
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
