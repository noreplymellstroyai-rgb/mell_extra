'use client'

import Link from 'next/link'
import { useState } from 'react'

import { UnauthorizedModal } from '@/components/auth/unauthorized-modal'
import { ChatInputForm } from '@/components/chat/chat-input-form'

import { GREETING_PHRASES } from '@/data/chat'

import { Skeleton } from '../ui/skeleton'

import { useClientRandomGreeting } from '@/hooks'

export function LandingPage() {
	const [prompt, setPrompt] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleGuestSend = () => {
		setIsModalOpen(true)
	}
	const greeting = useClientRandomGreeting(GREETING_PHRASES)

	return (
		<>
			<div className='relative h-full w-full px-14'>
				<header className='w-full pt-14'>
					<nav className='flex items-center justify-between gap-4'>
						<div className='bg-linear-to-r from-[#C74AD4] to-[#3E5EEA] bg-clip-text pb-1 text-[42px] font-bold text-transparent'>
							MELLSTROY.AI
						</div>
						<div className='flex items-center gap-2.5'>
							<Link
								href='/auth?mode=login'
								className='bg-foreground text-background rounded-md px-4 py-2'
							>
								Войти
							</Link>
							<Link
								href='/auth?mode=register'
								className='border-muted rounded-md border-2 px-4 py-2'
							>
								Зарегистрироваться бесплатно
							</Link>
						</div>
					</nav>
				</header>

				<main className='absolute top-1/2 left-1/2 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 text-center'>
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
						handleSendPrompt={handleGuestSend}
						isLoading={false}
					/>
				</main>
			</div>

			<UnauthorizedModal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</>
	)
}
