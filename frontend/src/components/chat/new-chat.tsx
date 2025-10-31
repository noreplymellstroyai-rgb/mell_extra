'use client'

import { useState } from 'react'

import { useSendNewChatPromptMutation } from '@/api/hooks'

import { WARNING_TEXT } from '@/data/chat'
import { GREETING_PHRASES } from '@/data/chat/new-chat-greetings'

import { usePrompt } from '@/hooks/chat/use-set-prompt'

import { UnauthorizedModal } from '../auth/unauthorized-modal'
import { Skeleton } from '../ui/skeleton'

import { ChatInputForm } from './chat-input-form'
import { useCheckAuth, useClientRandomGreeting } from '@/hooks'

export default function NewChatPage() {
	const { isAuthorized } = useCheckAuth()
	const [isModalOpen, setIsModalOpen] = useState(false)

	const { mutate: sendNewChatPrompt, isPending } =
		useSendNewChatPromptMutation()

	const greeting = useClientRandomGreeting(GREETING_PHRASES)

	const handleSend = (promptText: string, files?: File[]) => {
		if (!isAuthorized) {
			setIsModalOpen(true)
			return
		}

		sendNewChatPrompt({ prompt: promptText, files })
	}

	const { prompt, setPrompt } = usePrompt(() => {})

	return (
		<div className='text-foreground flex h-screen w-full flex-col items-center justify-center'>
			<div className='w-full max-w-4xl'>
				<h1 className='relative z-10 mb-8 text-center text-2xl font-semibold'>
					{greeting !== null ? (
						greeting
					) : (
						<Skeleton className='mx-auto h-8 w-80 max-w-sm' />
					)}
				</h1>
				<ChatInputForm
					prompt={prompt}
					setPrompt={setPrompt}
					handleSendPrompt={handleSend}
					isLoading={isPending}
				/>
				<p className='text-muted-foreground pt-4 text-center text-xs'>
					{WARNING_TEXT}
				</p>
			</div>

			<UnauthorizedModal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div>
	)
}
