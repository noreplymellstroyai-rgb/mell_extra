import { useEffect, useState } from 'react'

export function useRandomGreeting(phrases: string[]): string {
	const initialGreeting = phrases.length > 0 ? phrases[0] : ''
	const [greeting, setGreeting] = useState(initialGreeting)

	useEffect(() => {
		if (phrases.length > 0) {
			const randomIndex = Math.floor(Math.random() * phrases.length)
			setGreeting(phrases[randomIndex])
		}
	}, [phrases])

	return greeting
}
