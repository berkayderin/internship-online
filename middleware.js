// middleware.js
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

// Giriş yapmadan erişilebilecek sayfalar
const publicRoutes = ['/', '/login', '/register']

export default async function middleware(request) {
	const session = await auth()
	const { pathname } = request.nextUrl

	// Public route kontrolü
	const isPublicRoute = publicRoutes.includes(pathname)

	// Auth durumu kontrolü
	const isAuthenticated = !!session?.user

	// 1. Public route kontrolü
	if (isPublicRoute) {
		// Eğer kullanıcı giriş yapmışsa ve auth sayfalarına gitmeye çalışıyorsa
		if (
			isAuthenticated &&
			['/login', '/register'].includes(pathname)
		) {
			return NextResponse.redirect(new URL('/panel', request.url))
		}
		return NextResponse.next()
	}

	// 2. Protected route kontrolü
	if (!isAuthenticated) {
		const redirectUrl = new URL('/login', request.url)
		return NextResponse.redirect(redirectUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
