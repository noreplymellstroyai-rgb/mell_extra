import { useCallback } from 'react'

interface DownloadFileOptions {
	content: string
	filename: string
	mimeType?: string
}

export const useDownloadFile = () => {
	const download = useCallback(
		({
			content,
			filename,
			mimeType = 'text/plain;charset=utf-8'
		}: DownloadFileOptions) => {
			const blob = new Blob([content], { type: mimeType })

			const url = URL.createObjectURL(blob)

			const link = document.createElement('a')
			link.href = url
			link.download = filename

			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			URL.revokeObjectURL(url)
		},
		[]
	)

	return { download }
}
