'use client'

import { Check, Clipboard } from 'lucide-react'
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
		<div className='bg-background/50 relative rounded-lg font-mono text-sm'>
			<div className='bg-muted/30 flex items-center justify-between rounded-t-lg px-4 py-2'>
				<span className='text-muted-foreground font-semibold'>
					{formattedLanguage}
				</span>
				<button
					onClick={() => copy(code)}
					className='text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-1.5 rounded-md p-1.5 text-xs transition-colors'
					aria-label='Copy code'
				>
					{isCopied ? (
						<>
							<Check size={14} />
							Скопировано!
						</>
					) : (
						<>
							<Clipboard size={14} />
						</>
					)}
				</button>
			</div>

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
	)
}
