import { DragEventHandler, useCallback, useRef, useState } from 'react'

interface UseFileDragAndDropOptions {
	onFilesDropped: (files: FileList) => void
}

export function useFileDragAndDrop({
	onFilesDropped
}: UseFileDragAndDropOptions) {
	const [isDragging, setIsDragging] = useState(false)
	const dragCounter = useRef(0)

	const handleDragEnter: DragEventHandler<HTMLDivElement> = useCallback(e => {
		e.preventDefault()
		e.stopPropagation()
		dragCounter.current++
		if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
			if (dragCounter.current === 1) {
				setIsDragging(true)
			}
		}
	}, [])

	const handleDragLeave: DragEventHandler<HTMLDivElement> = useCallback(e => {
		e.preventDefault()
		e.stopPropagation()
		dragCounter.current--
		if (dragCounter.current === 0) {
			setIsDragging(false)
		}
	}, [])

	const handleDragOver: DragEventHandler<HTMLDivElement> = useCallback(e => {
		e.preventDefault()
		e.stopPropagation()
	}, [])

	const handleDrop: DragEventHandler<HTMLDivElement> = useCallback(
		e => {
			e.preventDefault()
			e.stopPropagation()
			setIsDragging(false)
			dragCounter.current = 0
			if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
				onFilesDropped(e.dataTransfer.files)
				e.dataTransfer.clearData()
			}
		},
		[onFilesDropped]
	)

	return {
		isDragging,
		dragAndDropProps: {
			onDragEnter: handleDragEnter,
			onDragLeave: handleDragLeave,
			onDragOver: handleDragOver,
			onDrop: handleDrop
		}
	}
}
