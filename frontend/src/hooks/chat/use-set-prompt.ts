import { useState } from 'react'

type SendPromptCallback = (prompt: string) => void

export const usePrompt = (onSend: SendPromptCallback) => {
	const [prompt, setPrompt] = useState('')

	const handleSendPrompt = () => {
		if (!prompt.trim()) return

		onSend(prompt)

		setPrompt('')
	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSendPrompt()
		}
	}

	return {
		prompt,
		setPrompt,
		handleSendPrompt,
		handleKeyPress
	}
}
