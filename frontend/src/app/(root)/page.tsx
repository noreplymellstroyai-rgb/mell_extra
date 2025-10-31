'use client'

import { LandingPage } from '@/components/chat/unauthorized-page'
import NewChat from '@/components/chat/new-chat'

import { useAuth } from '@/providers/auth-provider'

export default function RootPage() {
	const { isAuthorized } = useAuth()

	return isAuthorized ? <NewChat /> : <LandingPage />
}
