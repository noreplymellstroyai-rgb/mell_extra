import { useState } from 'react'

export function useRandomGreeting(phrases: string[]): string {
	const [greeting] = useState(() => {
		if (phrases.length === 0) {
			return ''
		}
		const randomIndex = Math.floor(Math.random() * phrases.length)
		return phrases[randomIndex]
	})

	return greeting
}
