import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { type BundledLanguage, bundledThemes, getHighlighter } from 'shikiji'

import { normalizeShikijiLanguage } from '@/lib/utils'

interface UseSyntaxHighlightingProps {
	code: string
	language: string
}

const highlighterPromise = getHighlighter({
	themes: ['tokyo-night', 'vitesse-light'],
	langs: [
		'javascript',
		'typescript',
		'jsx',
		'tsx',
		'json',
		'bash',
		'css',
		'html',
		'markdown',
		'python'
	]
})

export const useSyntaxHighlighting = ({
	code,
	language
}: UseSyntaxHighlightingProps) => {
	const { resolvedTheme } = useTheme()
	const [highlightedCode, setHighlightedCode] = useState<string>('')
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		let isMounted = true
		setIsLoading(true)

		const highlight = async () => {
			try {
				const highlighter = await highlighterPromise
				const normalizedLanguage = normalizeShikijiLanguage(language)

				const isLanguageLoaded = highlighter
					.getLoadedLanguages()
					.includes(normalizedLanguage as BundledLanguage)

				let langToUse = normalizedLanguage

				if (!isLanguageLoaded) {
					try {
						await highlighter.loadLanguage(
							normalizedLanguage as BundledLanguage
						)
					} catch (error) {
						console.warn(
							`Shikiji язык "${normalizedLanguage}" не найден, используется "text".`
						)
						langToUse = 'text'
					}
				}

				const theme =
					resolvedTheme === 'dark' ? 'tokyo-night' : 'vitesse-light'

				const html = highlighter.codeToHtml(code, {
					lang: langToUse,
					theme
				})

				const finalHtml = html.replace(
					/style="background-color: #[0-9a-fA-F]{3,6}"/,
					''
				)

				if (isMounted) {
					setHighlightedCode(finalHtml)
				}
			} catch (error) {
				console.error('Ошибка при подсветке кода:', error)
				if (isMounted) {
					setHighlightedCode(
						`<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
					)
				}
			} finally {
				if (isMounted) {
					setIsLoading(false)
				}
			}
		}

		if (code && resolvedTheme) {
			highlight()
		}

		return () => {
			isMounted = false
		}
	}, [code, language, resolvedTheme])

	return { highlightedCode, isLoading }
}
