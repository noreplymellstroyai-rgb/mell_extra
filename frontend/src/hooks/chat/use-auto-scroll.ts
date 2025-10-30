import { useEffect, useRef } from 'react'

export const useAutoScroll = (dependency: any) => {
	const messagesEndRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const timer = setTimeout(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
		}, 100)

		return () => clearTimeout(timer)
	}, [dependency])

	return messagesEndRef
}
