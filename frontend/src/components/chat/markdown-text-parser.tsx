'use client'

import React from 'react'

interface MarkdownTextParserProps {
	text: string
}

export const MarkdownTextParser: React.FC<MarkdownTextParserProps> = ({
	text
}) => {
	if (!text) return null

	const elements: React.ReactNode[] = []
	const formattingRegex = /\*\*([^*]+?)\*\*|``([^`]+?)``|`([^`]+?)`/g

	let lastIndex = 0
	let match

	while ((match = formattingRegex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			elements.push(text.slice(lastIndex, match.index))
		}

		const boldContent = match[1]
		const doubleBacktickContent = match[2]
		const singleBacktickContent = match[3]

		if (boldContent) {
			elements.push(<strong key={match.index}>{boldContent}</strong>)
		} else {
			const codeContent = doubleBacktickContent || singleBacktickContent
			elements.push(
				<code
					key={match.index}
					className='bg-background text-foreground rounded px-1.5 py-0.5 font-mono text-sm'
				>
					{codeContent}
				</code>
			)
		}

		lastIndex = formattingRegex.lastIndex
	}

	if (lastIndex < text.length) {
		elements.push(text.slice(lastIndex))
	}

	return (
		<>
			{elements.map((el, i) => (
				<React.Fragment key={i}>{el}</React.Fragment>
			))}
		</>
	)
}
