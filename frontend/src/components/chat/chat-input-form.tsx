'use client'

import { ArrowUp, Paperclip, X } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent, KeyboardEventHandler, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ChatInputFormProps {
	prompt: string
	setPrompt: (value: string) => void
	handleSendPrompt: (prompt: string, files?: File[]) => void
	handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement>
	isLoading?: boolean
}

export function ChatInputForm({
	prompt,
	setPrompt,
	handleSendPrompt,
	handleKeyPress,
	isLoading = false
}: ChatInputFormProps) {
	const [files, setFiles] = useState<File[]>([])
	const [previewUrls, setPreviewUrls] = useState<string[]>([])
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [fileError, setFileError] = useState<string | null>(null)

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		setFileError(null)
		const selectedFiles = event.target.files
		if (!selectedFiles) return

		const newFiles = Array.from(selectedFiles)

		if (files.length + newFiles.length > 5) {
			setFileError('Можно прикрепить не более 5 файлов')
			if (fileInputRef.current) fileInputRef.current.value = ''
			return
		}

		const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
		for (const file of newFiles) {
			if (!allowedTypes.includes(file.type)) {
				setFileError('Поддерживаются только форматы JPEG, JPG и PNG')
				if (fileInputRef.current) fileInputRef.current.value = ''
				return
			}
		}

		setFiles(prev => [...prev, ...newFiles])
		const newUrls = newFiles.map(file => URL.createObjectURL(file))
		setPreviewUrls(prev => [...prev, ...newUrls])

		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const handleRemoveFile = (indexToRemove: number) => {
		URL.revokeObjectURL(previewUrls[indexToRemove])
		setFiles(prev => prev.filter((_, index) => index !== indexToRemove))
		setPreviewUrls(prev =>
			prev.filter((_, index) => index !== indexToRemove)
		)
		if (files.length - 1 < 5) setFileError(null)
	}

	const handleRemoveAllFiles = () => {
		previewUrls.forEach(url => URL.revokeObjectURL(url))
		setFiles([])
		setPreviewUrls([])
		setFileError(null)
	}

	const onSend = () => {
		if (fileError) return
		handleSendPrompt(prompt, files)
		setPrompt('')
		handleRemoveAllFiles()
	}

	return (
		<div className='border-foreground/20 bg-background/20 relative rounded-2xl border px-5 py-4 shadow-lg backdrop-blur-xl'>
			{previewUrls.length > 0 && (
				<div className='mb-2 flex flex-wrap gap-2'>
					{previewUrls.map((url, index) => (
						<div key={url} className='relative h-20 w-20'>
							<Image
								src={url}
								alt={`Preview ${index}`}
								fill
								className='rounded-md object-cover'
							/>
							<Button
								variant='ghost'
								size='icon'
								className='bg-background text-foreground absolute -top-2 -right-2 h-6 w-6 rounded-full'
								onClick={() => handleRemoveFile(index)}
							>
								<X className='h-4 w-4' />
							</Button>
						</div>
					))}
				</div>
			)}
			<div>
				<Textarea
					placeholder='Спросите что-нибудь...'
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
					className='border-foreground/20 rounded-3xl'
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
