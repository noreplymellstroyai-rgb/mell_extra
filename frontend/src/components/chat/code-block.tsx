'use client'

import { Check, ChevronDown, ChevronUp, Clipboard } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
	oneDark,
	oneLight
} from 'react-syntax-highlighter/dist/esm/styles/prism'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

interface CodeBlockProps {
	language: string
	code: string
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
	const { theme } = useTheme()
	const { isCopied, copy } = useCopyToClipboard()
	const [mounted, setMounted] = useState(false)
	const [isExpanded, setIsExpanded] = useState(true)

	useEffect(() => {
		setMounted(true)
	}, [])

	const formattedLanguage =
		language.charAt(0).toUpperCase() + language.slice(1)

	const baseStyle = theme === 'dark' ? oneDark : oneLight
	const codeStyle = { ...baseStyle }
	const preTagStyle = codeStyle['pre[class*="language-"]']
	if (preTagStyle && preTagStyle.background) {
		delete preTagStyle.background
	}

	if (!mounted) {
		return (
			<div className='bg-muted relative h-48 animate-pulse rounded-lg font-mono text-sm' />
		)
	}

	return (
		<div className='bg-background/90 dark:bg-background/30 relative rounded-lg font-mono text-sm backdrop-blur-2xl'>
			<div className='bg-muted/50 flex items-center justify-between rounded-t-lg px-4 py-2'>
				<span className='text-muted-foreground font-semibold'>
					{formattedLanguage}
				</span>
				<div className='flex items-center gap-1.5'>
					<button
						onClick={() => copy(code)}
						className='text-muted-foreground hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-1.5 rounded-md p-1.5 text-xs transition-colors'
						aria-label='Copy code'
					>
						{isCopied ? (
							<>
								<Check size={14} />
								Скопировано
							</>
						) : (
							<>
								<Clipboard size={14} />
							</>
						)}
					</button>
					<button
						onClick={() => setIsExpanded(!isExpanded)}
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
			</div>

			<div
				className={`grid transition-[grid-template-rows] duration-300 ease-out ${
					isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
				}`}
			>
				<div className='overflow-hidden'>
					<SyntaxHighlighter
						language={language}
						style={codeStyle}
						showLineNumbers={false}
						customStyle={{
							margin: 0,
							padding: '1rem',
							backgroundColor: 'transparent'
						}}
						codeTagProps={{
							style: {
								fontFamily: 'inherit'
							}
						}}
					>
						{String(code).replace(/\n$/, '')}
					</SyntaxHighlighter>
				</div>
			</div>
		</div>
	)
}
