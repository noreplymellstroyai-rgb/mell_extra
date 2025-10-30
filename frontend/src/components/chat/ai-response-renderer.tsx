'use client'

import React from 'react'

import { ContentBlock } from '@/types/ai-response-types'

import { CodeBlock } from './code-block'
import { MarkdownTextParser } from './markdown-text-parser'

interface AiResponseRendererProps {
	content: ContentBlock[]
}

const blockSpacing: { [key in ContentBlock['type']]?: string } = {
	title: 'mb-6',
	paragraph: 'mb-4',
	list: 'mb-6',
	code: 'mb-6',
	section: 'mb-8'
}

export const AiResponseRenderer: React.FC<AiResponseRendererProps> = ({
	content
}) => {
	if (!content || content.length === 0) {
		return null
	}

	const isSimpleResponse = content.length <= 3

	return (
		<div>
			{content.map((block, index) => {
				const marginClass = blockSpacing[block.type] || 'mb-0'

				return (
					<div key={index} className={`${marginClass} last:mb-0`}>
						{(() => {
							switch (block.type) {
								case 'title':
									if (index === 0 && isSimpleResponse) {
										return (
											<p className='text-justify leading-relaxed hyphens-auto'>
												<MarkdownTextParser
													text={block.content}
												/>
											</p>
										)
									}
									return (
										<h1 className='text-justify text-2xl font-bold'>
											{block.content}
										</h1>
									)

								case 'paragraph':
									return (
										<p className='text-justify leading-relaxed hyphens-auto'>
											<MarkdownTextParser
												text={block.content}
											/>
										</p>
									)

								case 'list':
									return (
										<ul className='list-inside list-disc space-y-2 pl-4'>
											{block.content.map(
												(item, itemIndex) => (
													<li key={itemIndex}>
														<MarkdownTextParser
															text={item}
														/>
													</li>
												)
											)}
										</ul>
									)

								case 'code':
									return (
										<CodeBlock
											language={block.content.language}
											code={block.content.code}
										/>
									)

								case 'section':
									return (
										<section>
											<h2 className='mb-4 text-xl font-semibold'>
												{block.title}
											</h2>
											<AiResponseRenderer
												content={block.content}
											/>
										</section>
									)

								default:
									return null
							}
						})()}
					</div>
				)
			})}
		</div>
	)
}
