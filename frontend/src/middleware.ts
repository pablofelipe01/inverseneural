import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('🔥 MIDDLEWARE EJECUTÁNDOSE EN SRC - Ruta:', req.nextUrl.pathname)
  
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

  // USAR getUser() en lugar de getSession() para mayor seguridad
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Si no hay usuario y está intentando acceder al dashboard
  if (!user && req.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Si hay usuario, verificar el estado del trial
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, trial_ends_at, plan_type')
      .eq('id', user.id)
      .single()

    // Verificar si el trial ha expirado
    if (profile && profile.subscription_status === 'trial') {
      const trialEnd = new Date(profile.trial_ends_at)
      const now = new Date()
      
      console.log('🔍 Verificando trial:', {
        userId: user.id,
        trialEnd: trialEnd.toISOString(),
        now: now.toISOString(),
        expired: trialEnd < now,
        pathname: req.nextUrl.pathname
      })
      
      if (trialEnd < now) {
        // Trial expirado - redirigir a pricing (excepto si ya está ahí)
        if (req.nextUrl.pathname !== '/pricing' && !req.nextUrl.pathname.startsWith('/auth')) {
          console.log('🚨 Trial expirado, redirigiendo a pricing desde:', req.nextUrl.pathname)
          return NextResponse.redirect(new URL('/pricing', req.url))
        }
      }
    }

    // Si está en páginas de auth con usuario válido, redirigir al dashboard  
    if (req.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard', '/auth/:path*', '/pricing']
}
