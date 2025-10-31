import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const authRoutes = ['/auth']

const REFRESH_TOKEN_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const refreshToken = request.cookies.get('refreshToken')?.value
	const accessToken = request.cookies.get('accessToken')?.value

	if (refreshToken) {
		if (authRoutes.includes(pathname)) {
			return NextResponse.redirect(new URL('/', request.url))
		}

		if (!accessToken) {
			try {
				const res = await fetch(REFRESH_TOKEN_API_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Cookie: `refreshToken=${refreshToken}`
					}
				})

				if (!res.ok) {
					console.error('[Middleware] Refresh failed, logging out.')
					const response = NextResponse.next()
					response.cookies.delete('accessToken')
					response.cookies.delete('refreshToken')
					return response
				}

				const response = NextResponse.next()

				const newCookies = (
					res.headers as any
				).getSetCookie() as string[]

				if (newCookies && newCookies.length > 0) {
					newCookies.forEach(cookie => {
						response.headers.append('Set-Cookie', cookie)
					})
				}

				return response
			} catch (error) {
				console.error(
					'[Middleware] Network error during refresh:',
					error
				)
				const response = NextResponse.next()
				response.cookies.delete('accessToken')
				response.cookies.delete('refreshToken')
				return response
			}
		}

		return NextResponse.next()
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
