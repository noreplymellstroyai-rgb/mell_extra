// src/app/(root)/app-content.tsx

'use client'

// Этот компонент будет клиентским
import type { PropsWithChildren } from 'react'

// Наш хук для доступа к контексту
import { AppSidebar } from '@/components/chat/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

import { useAuth } from '@/providers/auth-provider'

// src/app/(root)/app-content.tsx

// src/app/(root)/app-content.tsx

export function AppContent({ children }: PropsWithChildren) {
	const { isAuthorized } = useAuth()

	return (
		<SidebarProvider>
			<div className='relative flex h-screen w-screen overflow-hidden'>
				<video
					src='/videos/auth-bg-light-video.mp4'
					poster='/images/auth-bg-light-poster.png'
					autoPlay
					loop
					muted
					playsInline
					className='absolute inset-0 -z-10 h-full w-full object-cover blur-xl dark:hidden'
				/>
				<video
					src='/videos/auth-bg-dark-video.mp4'
					poster='/images/auth-bg-dark-poster.png'
					autoPlay
					loop
					muted
					playsInline
					className='absolute inset-0 -z-10 hidden h-full w-full object-cover blur-xl dark:block'
				/>

				{isAuthorized && <AppSidebar />}

				<main className='bg-background/30 flex-1 backdrop-blur-md'>
					{children}
				</main>
			</div>
		</SidebarProvider>
	)
}
