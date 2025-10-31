'use client'

import { Check, ChevronUp, Clipboard, Download } from 'lucide-react'
import React, { memo, useCallback } from 'react'

import { useDownloadFile } from '@/hooks/chat/use-download-file'
import { useSyntaxHighlighting } from '@/hooks/chat/use-syntax-highlighting'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useToggle } from '@/hooks/use-toggle'

import { formatLanguageName, getLanguageFileExtension } from '@/lib/utils'

import { Skeleton } from '../ui/skeleton'

interface CodeBlockProps {
	language: string
	code: string
}

export const CodeBlock = memo<CodeBlockProps>(({ language, code }) => {
	const { isCopied, copy } = useCopyToClipboard()
	const [isExpanded, toggleExpanded] = useToggle(true)
	const { download } = useDownloadFile()
	const { highlightedCode, isLoading } = useSyntaxHighlighting({
		code,
		language
	})

	const formattedLanguage = formatLanguageName(language)

	const handleDownload = useCallback(() => {
		const extension = getLanguageFileExtension(language)
		const filename = `code-${Date.now()}${extension}`
		download({ content: code, filename })
	}, [code, language, download])

	if (isLoading) {
		return <Skeleton className='h-48 w-full rounded-lg' />
	}

	return (
		<div className='bg-background/90 dark:bg-background/30 relative rounded-lg font-mono text-sm backdrop-blur-2xl'>
			<header className='bg-muted/50 flex items-center justify-between rounded-t-lg px-4 py-2'>
				<span className='text-muted-foreground font-semibold'>
					{formattedLanguage}
				</span>
				<div className='flex items-center gap-1.5'>
					<button
						onClick={() => copy(code)}
						className='text-muted-foreground hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-1.5 rounded-md p-1.5 text-xs transition-colors'
						aria-label='Скопировать код'
					>
						{isCopied ? (
							<>
								<Check size={14} />
								Скопировано
							</>
						) : (
							<Clipboard size={14} />
						)}
					</button>
					<button
						onClick={handleDownload}
						className='text-muted-foreground hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-1.5 rounded-md p-1.5 text-xs transition-colors'
						aria-label='Скачать код'
					>
						<Download size={14} />
					</button>
					<button
						onClick={toggleExpanded}
						className='text-muted-foreground hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center rounded-md p-1.5 text-xs transition-colors'
						aria-label={
							isExpanded ? 'Свернуть код' : 'Развернуть код'
						}
					>
						<ChevronUp
							className={`transform transition-transform duration-500 ${
								isExpanded ? '' : 'rotate-180'
							}`}
							size={14}
						/>
					</button>
				</div>
			</header>

			<div
				className={`grid transition-[grid-template-rows] duration-300 ease-out ${
					isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
				}`}
			>
				<div className='overflow-hidden rounded-b-lg'>
					<div
						className='p-5'
						dangerouslySetInnerHTML={{ __html: highlightedCode }}
					/>
				</div>
			</div>
		</div>
	)
})

CodeBlock.displayName = 'CodeBlock'
