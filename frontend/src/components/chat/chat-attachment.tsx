'use client'

import Image from 'next/image'

interface ChatAttachmentProps {
	url: string
}

export function ChatAttachment({ url }: ChatAttachmentProps) {
	const isOptimistic = url.startsWith('blob:')

	const handleOptimisticLoad = () => {
		URL.revokeObjectURL(url)
	}

	if (isOptimistic) {
		return (
			<img
				src={url}
				alt='Прикрепленное изображение'
				className='h-full w-full rounded-md object-cover'
				onLoad={handleOptimisticLoad}
			/>
		)
	}

	return (
		<Image
			src={`${process.env.NEXT_PUBLIC_API_URL}${url}`}
			alt='Прикрепленное изображение'
			fill
			className='rounded-md object-cover'
		/>
	)
}
