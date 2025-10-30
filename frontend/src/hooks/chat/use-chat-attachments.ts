import { useCallback, useState } from 'react'

const MAX_FILES = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg']

export function useChatAttachments() {
	const [files, setFiles] = useState<File[]>([])
	const [previewUrls, setPreviewUrls] = useState<string[]>([])
	const [fileError, setFileError] = useState<string | null>(null)

	const handleFilesAdded = useCallback(
		(incomingFiles: FileList | null) => {
			if (!incomingFiles || incomingFiles.length === 0) return

			setFileError(null)
			const newFiles = Array.from(incomingFiles)

			if (files.length + newFiles.length > MAX_FILES) {
				setFileError(`Можно прикрепить не более ${MAX_FILES} файлов`)
				return
			}

			for (const file of newFiles) {
				if (!ALLOWED_TYPES.includes(file.type)) {
					setFileError(
						'Поддерживаются только форматы JPEG, JPG и PNG'
					)
					return
				}
			}

			setFiles(prev => [...prev, ...newFiles])
			const newUrls = newFiles.map(file => URL.createObjectURL(file))
			setPreviewUrls(prev => [...prev, ...newUrls])
		},
		[files]
	)

	const removeFile = useCallback(
		(indexToRemove: number) => {
			URL.revokeObjectURL(previewUrls[indexToRemove])
			setFiles(prev => prev.filter((_, index) => index !== indexToRemove))
			setPreviewUrls(prev =>
				prev.filter((_, index) => index !== indexToRemove)
			)
			if (files.length - 1 < MAX_FILES) {
				setFileError(null)
			}
		},
		[previewUrls, files.length]
	)

	const removeAllFiles = useCallback(() => {
		previewUrls.forEach(url => URL.revokeObjectURL(url))
		setFiles([])
		setPreviewUrls([])
		setFileError(null)
	}, [previewUrls])

	return {
		files,
		previewUrls,
		fileError,
		handleFilesAdded,
		removeFile,
		removeAllFiles,
		isAttachmentAreaVisible: previewUrls.length > 0
	}
}
