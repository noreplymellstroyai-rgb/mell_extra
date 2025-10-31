import { useEffect, useState } from 'react'

export function useClientRandomGreeting(phrases: string[]): string | null {
	const [greeting, setGreeting] = useState<string | null>(null)

	useEffect(() => {
		if (phrases.length > 0) {
			const randomIndex = Math.floor(Math.random() * phrases.length)
			setGreeting(phrases[randomIndex])
		} else {
			setGreeting('')
		}
	}, [])

	return greeting
}
