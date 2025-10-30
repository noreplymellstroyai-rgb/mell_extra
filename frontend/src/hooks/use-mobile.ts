'use client'

import { useMediaQuery } from './use-media-query'

export function useIsMobile(query: string = '(max-width: 768px)'): boolean {
	const isMobile = useMediaQuery(query)
	return isMobile
}
