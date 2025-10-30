import { useState, useCallback } from 'react'

export const useCopyToClipboard = (timeout = 2000) => {
	const [isCopied, setIsCopied] = useState(false)

	const copy = useCallback((text: string) => {
		if (!navigator?.clipboard) {
			console.warn('Clipboard not supported')
			return
		}

		navigator.clipboard.writeText(text).then(() => {
			setIsCopied(true)
			
			setTimeout(() => {
				setIsCopied(false)
			}, timeout)
		})
	}, [timeout])

	return { isCopied, copy }
}