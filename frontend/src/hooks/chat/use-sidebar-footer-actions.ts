import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

import { useLogoutMutation } from '@/api/hooks'

export function useSidebarActions() {
	const router = useRouter()
	const { theme, setTheme } = useTheme()

	const { mutate: logout, isPending: isLogoutPending } = useLogoutMutation({
		onSuccess: () => {
			router.push('/auth')
		}
	})

	const handleThemeToggle = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	const handleLogout = () => {
		logout()
	}

	return {
		handleThemeToggle,
		handleLogout,
		isLogoutPending
	}
}
