import { X } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

interface ChatAttachmentPreviewProps {
	url: string
	onRemove: () => void
}

export function ChatAttachmentPreview({
	url,
	onRemove
}: ChatAttachmentPreviewProps) {
	return (
		<div className='relative h-20 w-20'>
			<Image
				src={url}
				alt='Preview'
				fill
				className='rounded-md object-cover'
				onLoad={() => URL.revokeObjectURL(url)}
			/>
			<Button
				variant='ghost'
				size='icon'
				className='bg-background text-foreground absolute -top-2 -right-2 h-6 w-6 rounded-full'
				onClick={onRemove}
			>
				<X className='h-4 w-4' />
			</Button>
		</div>
	)
}
