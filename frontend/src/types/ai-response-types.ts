export interface TitleBlock {
	type: 'title'
	content: string
}

export interface ParagraphBlock {
	type: 'paragraph'
	content: string
}

export interface ListBlock {
	type: 'list'
	content: string[]
}

export interface CodeBlock {
	type: 'code'
	content: {
		language: string
		code: string
	}
}

export interface SectionBlock {
	type: 'section'
	title: string
	content: ContentBlock[]
}

export type ContentBlock =
	| TitleBlock
	| ParagraphBlock
	| ListBlock
	| CodeBlock
	| SectionBlock

