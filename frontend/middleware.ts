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

    // Páginas que no requieren validación de trial
    const publicPaths = ['/auth/login', '/auth/register', '/api/auth', '/upgrade']
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    // Si el usuario está autenticado y trata de acceder a páginas de auth, redirigir al dashboard
    if (session && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Si el usuario NO está autenticado y trata de acceder a páginas protegidas, redirigir al login
    if (!session && pathname === '/') {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Si está autenticado, validar trial
    if (session && !isPublicPath) {
      try {
        // Obtener perfil del usuario
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('subscription_status, trial_ends_at, plan_type')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error('Error getting profile:', profileError)
          return response
        }

        if (profile) {
          const now = new Date()
          const trialEndsAt = new Date(profile.trial_ends_at)

          // Si el trial expiró y no tiene subscripción activa
          if (profile.subscription_status === 'trial' && trialEndsAt < now) {
            // Redirigir a página de upgrade, excepto si ya está en ella
            if (!pathname.startsWith('/upgrade')) {
              return NextResponse.redirect(new URL('/upgrade', request.url))
            }
          }
        }
      } catch (error) {
        console.error('Trial validation error:', error)
        // En caso de error, permitir continuar
      }
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
