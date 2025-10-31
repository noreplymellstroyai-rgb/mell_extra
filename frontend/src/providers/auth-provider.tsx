// src/providers/auth-provider.tsx

'use client'

import { type PropsWithChildren, createContext, useContext } from 'react'

// Твой хук для проверки авторизации
import { Skeleton } from '@/components/ui/skeleton'

import { useCheckAuth } from '@/hooks'

// src/providers/auth-provider.tsx

// Типизация данных, которые будет хранить наш контекст
type AuthContextType = {
	isAuthorized: boolean
	isLoadingAuth: boolean
	// Можешь добавить сюда `user`, если он тебе нужен в других компонентах
}

// Создаем контекст с начальным значением
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Компонент-загрузчик
const FullPageLoader = () => (
	<div className='bg-background flex h-screen w-screen items-center justify-center'>
		<Skeleton className='h-12 w-12 rounded-full' />
	</div>
)

// Главный компонент-провайдер
export function AuthProvider({ children }: PropsWithChildren) {
	const { isAuthorized, isLoadingAuth } = useCheckAuth()

	// Пока идет проверка, показываем глобальный лоадер.
	// Весь остальной рендер ждет.
	if (isLoadingAuth) {
		return <FullPageLoader />
	}

	// Когда проверка завершена, передаем результат в контекст
	const value = { isAuthorized, isLoadingAuth }

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Простой хук для удобного доступа к данным из любого компонента
export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
