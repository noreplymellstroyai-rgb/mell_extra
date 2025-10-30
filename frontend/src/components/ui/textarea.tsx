import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
	return (
		<textarea
			data-slot='textarea'
			className={cn(
				'placeholder:text-foreground/60 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 mb-4 flex field-sizing-content min-h-10 w-full rounded-md bg-transparent text-xl transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base',
				className
			)}
			{...props}
		/>
	)
}

export { Textarea }
