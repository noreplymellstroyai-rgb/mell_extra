'use client'

import { useSendNewChatPromptMutation } from '@/api/hooks'

import { usePrompt } from '@/hooks/chat/use-set-prompt'

import { ChatInputForm } from './chat-input-form'

export default function NewChatPage() {
	const { mutate: sendNewChatPrompt, isPending } =
		useSendNewChatPromptMutation()

	const handleSend = (promptText: string, files?: File[]) => {
		sendNewChatPrompt({ prompt: promptText, files })
	}

	const { prompt, setPrompt, handleKeyPress } = usePrompt(() => {})

	return (
		<div className='text-foreground flex h-screen w-full flex-col items-center justify-center'>
			<div className='w-full max-w-4xl'>
				<h1 className='relative z-10 mb-8 text-center text-2xl font-semibold'>
					Что сегодня в повестке дня?
				</h1>
				<ChatInputForm
					prompt={prompt}
					setPrompt={setPrompt}
					handleSendPrompt={handleSend}
					handleKeyPress={handleKeyPress}
					isLoading={isPending}
				/>
			</div>
		</div>
	)
}
