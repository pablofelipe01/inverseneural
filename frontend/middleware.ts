import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareSupabaseClient } from '@/lib/supabase-server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createMiddlewareSupabaseClient(request, response)

    // Refresh session if expired - required for Server Components
    const { data: { session } } = await supabase.auth.getSession()

    const { pathname } = request.nextUrl

    // Si el usuario está autenticado y trata de acceder a páginas de auth, redirigir al dashboard
    if (session && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Si el usuario NO está autenticado y trata de acceder a páginas protegidas, redirigir al login
    if (!session && pathname === '/') {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    return response

  } catch (error) {
    console.error('Middleware error:', error)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
