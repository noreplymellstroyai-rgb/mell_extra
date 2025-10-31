import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { IMessage } from '@/api/types'

import { ContentBlock } from '@/types/ai-response-types'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function errorCatch(error: any) {
	const message = error.response.data.message

	return message
		? typeof error.response.data.message === 'object'
			? message[0]
			: message
		: error.message
}

export function formatDate(dateString: string) {
	return new Date(dateString).toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	})
}

export const createUserMessage = (content: string): IMessage => {
	const timestamp = new Date().toISOString()
	return {
		id: timestamp,
		role: 'user',
		content,
		createdAt: timestamp
	}
}

export const chatKeys = {
	all: ['chats'] as const,
	lists: () => [...chatKeys.all, 'list'] as const,

	history: (sessionId: string) => ['getHistoryChat', sessionId] as const
}

export const parseAiContent = (content: string | any): ContentBlock[] => {
	if (typeof content !== 'string') {
		if (Array.isArray(content)) {
			return content
		}
		return []
	}

	try {
		if (content.trim().startsWith('[')) {
			const parsed = JSON.parse(content)
			return Array.isArray(parsed)
				? parsed
				: [{ type: 'paragraph', content: content }]
		}
		return [{ type: 'paragraph', content: content }]
	} catch (error) {
		return [{ type: 'paragraph', content: content }]
	}
}

export function normalizeShikijiLanguage(language: string): string {
	const lang = language.toLowerCase()
	const languageMap: Record<string, string> = {
		js: 'javascript',
		ts: 'typescript',
		py: 'python',
		sh: 'bash',
		md: 'markdown',
		cpp: 'c++',
		csharp: 'c#'
	}
	return languageMap[lang] || lang
}

export function formatLanguageName(language: string): string {
	if (!language) return ''
	return language.charAt(0).toUpperCase() + language.slice(1)
}

export function getLanguageFileExtension(language: string): string {
	const lang = language.toLowerCase()
	const extensionMap: Record<string, string> = {
		javascript: '.js',
		typescript: '.ts',
		python: '.py',
		bash: '.sh',
		shell: '.sh',
		markdown: '.md',
		json: '.json',
		html: '.html',
		css: '.css',
		'c++': '.cpp',
		cpp: '.cpp',
		'c#': '.cs',
		csharp: '.cs',
		java: '.java',
		go: '.go',
		rust: '.rs',
		sql: '.sql',
		yaml: '.yml'
	}
	return extensionMap[lang] || '.txt'
}
