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
          response.cookies.set({ name, value, ...(options as Record<string, unknown>) })
        },
        remove(name: string, options: unknown) {
          response.cookies.set({ name, value: '', ...(options as Record<string, unknown>) })
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
    // Forzar consulta fresca sin cache
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, trial_ends_at, plan_type, stripe_customer_id, stripe_subscription_id, grace_period_end')
      .eq('id', user.id)
      .single()

    console.log('🔍 Verificando trial:', {
      userId: user.id,
      subscriptionStatus: profile?.subscription_status,
      planType: profile?.plan_type,
      stripeCustomerId: profile?.stripe_customer_id,
      trialEnd: profile?.trial_ends_at ? new Date(profile.trial_ends_at).toISOString() : null,
      now: new Date().toISOString(),
      expired: profile?.trial_ends_at ? new Date(profile.trial_ends_at) < new Date() : false,
      pathname: req.nextUrl.pathname
    })

    // Verificar si es suscripción activa PRIMERO
    if (profile && profile.subscription_status === 'active') {
      console.log('✅ Usuario con suscripción activa, permitiendo acceso')
      // Si está en páginas de auth con suscripción activa, redirigir al dashboard  
      if (req.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      // Permitir acceso normal
      return response
    }

    // Verificar si el trial ha expirado (solo si no tiene suscripción activa)
    if (profile && profile.subscription_status === 'trial') {
      const trialEnd = new Date(profile.trial_ends_at)
      const now = new Date()
      
      if (trialEnd < now) {
        // Trial expirado - verificar si tiene período de gracia
        const gracePeriodEnd = profile.grace_period_end ? new Date(profile.grace_period_end) : null
        
        if (!gracePeriodEnd) {
          // No tiene período de gracia configurado, crear uno de 3 días
          const graceEnd = new Date(trialEnd)
          graceEnd.setDate(graceEnd.getDate() + 3)
          
          // Actualizar la base de datos con el período de gracia
          await supabase
            .from('profiles')
            .update({ grace_period_end: graceEnd.toISOString() })
            .eq('id', user.id)
          
          console.log('⏰ Trial expirado, configurando 3 días de gracia hasta:', graceEnd.toISOString())
          // Permitir acceso durante gracia
          return response
        } else if (now > gracePeriodEnd) {
          // Período de gracia también expirado
          if (req.nextUrl.pathname !== '/pricing' && !req.nextUrl.pathname.startsWith('/auth')) {
            console.log('🚨 Trial y gracia expirados, redirigiendo a pricing desde:', req.nextUrl.pathname)
            return NextResponse.redirect(new URL('/pricing', req.url))
          }
        } else {
          // Aún en período de gracia
          const daysLeft = Math.ceil((gracePeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          console.log('⚠️ Trial expirado pero en gracia, días restantes:', daysLeft)
          // Permitir acceso con advertencia (el dashboard mostrará el banner)
          return response
        }
      }
    }

    // Verificar si hay problemas de pago
    if (profile && profile.subscription_status === 'payment_failed') {
      const now = new Date()
      const gracePeriodEnd = profile.grace_period_end ? new Date(profile.grace_period_end) : null
      
      if (!gracePeriodEnd) {
        // Primer fallo de pago, crear período de gracia de 3 días
        const graceEnd = new Date()
        graceEnd.setDate(graceEnd.getDate() + 3)
        
        await supabase
          .from('profiles')
          .update({ grace_period_end: graceEnd.toISOString() })
          .eq('id', user.id)
        
        console.log('💳 Pago fallido, configurando 3 días de gracia hasta:', graceEnd.toISOString())
        // Permitir acceso durante gracia
        return response
      } else if (now > gracePeriodEnd) {
        // Período de gracia de pago expirado
        if (req.nextUrl.pathname !== '/pricing' && !req.nextUrl.pathname.startsWith('/auth')) {
          console.log('🚨 Pago fallido y gracia expirada, redirigiendo a pricing desde:', req.nextUrl.pathname)
          return NextResponse.redirect(new URL('/pricing', req.url))
        }
      } else {
        // Aún en período de gracia de pago
        const daysLeft = Math.ceil((gracePeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        console.log('⚠️ Pago fallido pero en gracia, días restantes:', daysLeft)
        // Permitir acceso con advertencia (el dashboard mostrará el banner)
        return response
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