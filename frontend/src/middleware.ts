import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const response = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: unknown) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: unknown) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si no hay sesión y está intentando acceder al dashboard
  if (!session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Si hay sesión, verificar el estado del trial
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, trial_ends_at, plan_type')
      .eq('id', session.user.id)
      .single()

    // Verificar si el trial ha expirado
    if (profile && profile.subscription_status === 'trial') {
      const trialEnd = new Date(profile.trial_ends_at)
      const now = new Date()
      
      if (trialEnd < now) {
        // Trial expirado - redirigir a pricing (excepto si ya está ahí)
        if (req.nextUrl.pathname !== '/pricing' && !req.nextUrl.pathname.startsWith('/auth')) {
          return NextResponse.redirect(new URL('/pricing', req.url))
        }
      }
    }

    // Si está en páginas de auth con sesión válida, redirigir al dashboard  
    if (req.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/', '/auth/:path*', '/pricing']
}