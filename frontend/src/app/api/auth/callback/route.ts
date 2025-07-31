import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (!code) {
    return NextResponse.redirect(new URL('/auth/login?error=No authorization code', request.url))
  }

  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Code exchange error:', error)
      return NextResponse.redirect(new URL('/auth/login?error=Invalid authorization code', request.url))
    }

    if (!data.user) {
      return NextResponse.redirect(new URL('/auth/login?error=No user found', request.url))
    }

    // Si el usuario no tiene perfil, crearlo
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', data.user.id)
      .single()

    if (!existingProfile) {
      const trialEndsAt = new Date()
      trialEndsAt.setDate(trialEndsAt.getDate() + 7)

      await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: data.user.user_metadata?.full_name || data.user.email!.split('@')[0],
          subscription_status: 'trial',
          trial_ends_at: trialEndsAt.toISOString(),
          plan_type: 'trial',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
    }

    // Redirigir al dashboard
    return NextResponse.redirect(new URL('/', request.url))

  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=Authentication failed', request.url))
  }
}
