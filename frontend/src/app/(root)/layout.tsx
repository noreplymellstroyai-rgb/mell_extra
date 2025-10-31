import type { PropsWithChildren } from 'react'

import { AppSidebar } from '@/components/chat/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function ChatLayout({ children }: PropsWithChildren) {
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
					className='absolute inset-0 h-full w-full object-cover blur-xl dark:hidden'
				/>

				<video
					src='/videos/auth-bg-dark-video.mp4'
					poster='/images/auth-bg-dark-poster.png'
					autoPlay
					loop
					muted
					playsInline
					className='absolute inset-0 hidden h-full w-full object-cover blur-xl dark:block'
				/>

				<AppSidebar />

				<main className='bg-background/30 flex-1 backdrop-blur-md'>
					{children}
				</main>
			</div>
		</SidebarProvider>
	)
}
