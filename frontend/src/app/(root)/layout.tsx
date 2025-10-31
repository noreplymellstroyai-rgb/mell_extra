import type { PropsWithChildren } from 'react'

import { AppContent } from './app-content'
import { AuthProvider } from '@/providers/auth-provider'

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<AuthProvider>
			<AppContent>{children}</AppContent>
		</AuthProvider>
	)
}
