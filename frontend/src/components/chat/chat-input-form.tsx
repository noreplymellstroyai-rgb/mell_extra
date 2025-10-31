'use client'

import { ArrowUp, Paperclip } from 'lucide-react'
import { ChangeEvent, ClipboardEventHandler, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { useChatAttachments } from '@/hooks/chat/use-chat-attachments'
import { useFileDragAndDrop } from '@/hooks/chat/use-file-drag-and-drop'

import { ChatAttachmentPreview } from './chat-attachment-preview'

interface ChatInputFormProps {
	prompt: string
	setPrompt: (value: string) => void
	handleSendPrompt: (prompt: string, files?: File[]) => void
	isLoading?: boolean
}

export function ChatInputForm({
	prompt,
	setPrompt,
	handleSendPrompt,
	isLoading = false
}: ChatInputFormProps) {
	const {
		files,
		previewUrls,
		fileError,
		handleFilesAdded,
		removeFile,
		removeAllFiles,
		isAttachmentAreaVisible
	} = useChatAttachments()

	const { isDragging, dragAndDropProps } = useFileDragAndDrop({
		onFilesDropped: handleFilesAdded
	})

	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		handleFilesAdded(event.target.files)
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const handlePaste: ClipboardEventHandler<HTMLTextAreaElement> = e => {
		if (e.clipboardData.files && e.clipboardData.files.length > 0) {
			e.preventDefault()
			handleFilesAdded(e.clipboardData.files)
		}
	}

	const onSend = () => {
		if (fileError || isLoading) return
		handleSendPrompt(prompt, files)
		setPrompt('')
		removeAllFiles()
	}

	return (
		<div
			className={`relative rounded-2xl border bg-transparent px-5 py-4 shadow-lg transition-all ${
				isDragging
					? 'border-primary border-dashed'
					: 'border-foreground/20'
			}`}
			{...dragAndDropProps}
		>
			{isDragging && (
				<div className='bg-background/70 pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl'>
					<p className='text-primary font-semibold'>
						Перетащите файлы сюда
					</p>
				</div>
			)}

			{isAttachmentAreaVisible && (
				<div className='mb-2 flex flex-wrap gap-2'>
					{previewUrls.map((url, index) => (
						<ChatAttachmentPreview
							key={url}
							url={url}
							onRemove={() => removeFile(index)}
						/>
					))}
				</div>
			)}

			<div>
				<Textarea
					placeholder='Отправьте сообщение или перенесите изображение'
					className='max-h-52 w-full resize-none border-none bg-transparent pr-2 focus:ring-0 focus-visible:ring-0'
					rows={1}
					value={prompt}
					onChange={e => setPrompt(e.target.value)}
					onKeyDown={e => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault()
							onSend()
						}
					}}
					onPaste={handlePaste}
					disabled={isLoading}
				/>
			</div>

			{fileError && (
				<p className='text-destructive mt-1 text-xs'>{fileError}</p>
			)}

			<div className='mt-2 flex items-center justify-between'>
				<input
					type='file'
					ref={fileInputRef}
					onChange={handleFileChange}
					className='hidden'
					accept='image/png, image/jpeg'
					multiple
				/>
				<Button
					variant='outline'
					className='border-foreground/20 gap-0 rounded-3xl'
					onClick={() => fileInputRef.current?.click()}
					disabled={isLoading || files.length >= 5}
				>
					<Paperclip className='mr-2 h-4 w-4' />
					Прикрепить
				</Button>
				<Button
					size='iconFull'
					onClick={onSend}
					disabled={
						(!prompt.trim() && files.length === 0) ||
						isLoading ||
						!!fileError
					}
				>
					<ArrowUp />
				</Button>
			</div>
		</div>
	)
}
