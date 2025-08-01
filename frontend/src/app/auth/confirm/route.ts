import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  console.log('🔍 AUTH CONFIRM EJECUTÁNDOSE:', {
    url: request.url,
    searchParams: Object.fromEntries(searchParams),
    timestamp: new Date().toISOString()
  })

  // Extraer parámetros
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  
  if (!token_hash || type !== 'signup') {
    console.log('❌ Missing token_hash or invalid type')
    return NextResponse.redirect(new URL('/auth/login?error=Invalid confirmation link', request.url))
  }

  try {
    const supabase = await createServerSupabaseClient()

    // Verificar el token
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: 'signup'
    })

    if (error) {
      console.error('❌ OTP verification error:', error)
      return NextResponse.redirect(new URL('/auth/login?error=Invalid or expired link', request.url))
    }

    if (!data.user) {
      console.log('❌ No user found after verification')
      return NextResponse.redirect(new URL('/auth/login?error=User not found', request.url))
    }

    console.log('✅ User verified successfully:', {
      userId: data.user.id,
      email: data.user.email
    })

    // Crear perfil si no existe
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .single()

    if (!existingProfile) {
      console.log('🔍 Usuario sin perfil, creando perfil para:', {
        userId: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name
      })

      const trialEndsAt = new Date()
      trialEndsAt.setDate(trialEndsAt.getDate() + 15)

      const { data: newProfile, error: profileCreateError } = await supabase
        .from('profiles')
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
        .select()

      if (profileCreateError) {
        console.error('❌ Profile creation error:', profileCreateError)
      } else {
        console.log('✅ Profile created successfully:', newProfile)
      }
    } else {
      console.log('✅ Usuario ya tiene perfil existente:', existingProfile.id)
    }

    // Redirigir al dashboard con mensaje de éxito
    return NextResponse.redirect(new URL('/dashboard?confirmed=true', request.url))

  } catch (error) {
    console.error('❌ Confirmation error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=Confirmation failed', request.url))
  }
}
