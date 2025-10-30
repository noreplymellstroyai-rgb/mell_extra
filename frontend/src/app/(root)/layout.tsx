import type { PropsWithChildren } from 'react'

import { AppSidebar } from '@/components/chat/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ThemeButton } from '@/components/ui/custom/theme-button'

export default function ChatLayout({ children }: PropsWithChildren) {
	return (
		<SidebarProvider>
			<div className='relative flex h-screen w-screen overflow-hidden'>
				<video
					src='/videos/auth-bg-light-video.mp4'
					autoPlay
					loop
					muted
					playsInline
					className='absolute inset-0 h-full w-full object-cover blur-xl dark:hidden'
				/>

				<video
					src='/videos/auth-bg-dark-video.mp4'
					autoPlay
					loop
					muted
					playsInline
					className='absolute inset-0 hidden h-full w-full object-cover blur-xl dark:block'
				/>

				<AppSidebar />

				<main className='bg-background/30 flex-1 backdrop-blur-md'>
					<ThemeButton className='absolute top-10 right-10' />
					{children}
				</main>
			</div>
		</SidebarProvider>
	)
}
