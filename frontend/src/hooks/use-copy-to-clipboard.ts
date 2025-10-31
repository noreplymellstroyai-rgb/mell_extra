import { useCallback, useState } from 'react'

export const useCopyToClipboard = (timeout = 5000) => {
	const [isCopied, setIsCopied] = useState(false)

	const copy = useCallback(
		(text: string) => {
			if (!navigator?.clipboard) {
				console.warn('Копирование не поддерживается')
				return
			}

			navigator.clipboard.writeText(text).then(() => {
				setIsCopied(true)

				setTimeout(() => {
					setIsCopied(false)
				}, timeout)
			})
		},
		[timeout]
	)

	return { isCopied, copy }
}
