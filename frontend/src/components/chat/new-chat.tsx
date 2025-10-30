'use client'

import { useSendNewChatPromptMutation } from '@/api/hooks'

import { GREETING_PHRASES } from '@/data/chat/new-chat-greetings'

import { useRandomGreeting } from '@/hooks/chat/use-random-greeting'
import { usePrompt } from '@/hooks/chat/use-set-prompt'

import { ChatInputForm } from './chat-input-form'

export default function NewChatPage() {
	const { mutate: sendNewChatPrompt, isPending } =
		useSendNewChatPromptMutation()

	const greeting = useRandomGreeting(GREETING_PHRASES)

	const handleSend = (promptText: string, files?: File[]) => {
		sendNewChatPrompt({ prompt: promptText, files })
	}

	const { prompt, setPrompt } = usePrompt(() => {})

	return (
		<div className='text-foreground flex h-screen w-full flex-col items-center justify-center'>
			<div className='w-full max-w-4xl'>
				<h1 className='relative z-10 mb-8 text-center text-2xl font-semibold'>
					{greeting}
				</h1>
				<ChatInputForm
					prompt={prompt}
					setPrompt={setPrompt}
					handleSendPrompt={handleSend}
					isLoading={isPending}
				/>
			</div>
		</div>
	)
}
