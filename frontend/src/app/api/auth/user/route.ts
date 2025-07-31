import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    console.log('🔍 Usuario autenticado:', {
      userId: user?.id,
      email: user?.email,
      emailConfirmed: !!user?.email_confirmed_at
    })

    if (error) {
      console.log('❌ Error getting user:', error)
      return NextResponse.json(
        { user: null, profile: null, session: null },
        { status: 200 }
      )
    }

    if (!user) {
      console.log('❌ No user found')
      return NextResponse.json(
        { user: null, profile: null, session: null },
        { status: 200 }
      )
    }

    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    console.log('📋 Perfil:', {
      exists: !!profile,
      needsCreation: !profile && !!user.email_confirmed_at
    })

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError)
    }

    // Si no tiene perfil y el email está confirmado, crear perfil automáticamente
    if (!profile && user.email_confirmed_at) {
      console.log('✨ Creando perfil automáticamente para:', user.email)

      const trialEndsAt = new Date()
      trialEndsAt.setDate(trialEndsAt.getDate() + 15)

      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email!.split('@')[0],
          subscription_status: 'trial',
          trial_ends_at: trialEndsAt.toISOString(),
          plan_type: 'trial',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('❌ Auto profile creation error:', createError)
      } else {
        console.log('✅ Profile auto-created:', newProfile)
        // Usar el nuevo perfil creado
        const finalProfile = newProfile
        
        // Obtener sesión
        const { data: { session } } = await supabase.auth.getSession()

        return NextResponse.json({
          user,
          profile: finalProfile,
          session
        })
      }
    }

    // Obtener sesión
    const { data: { session } } = await supabase.auth.getSession()

    return NextResponse.json({
      user,
      profile: profile || null,
      session
    })

  } catch (error) {
    console.error('Unexpected user fetch error:', error)
    return NextResponse.json(
      { user: null, profile: null, session: null },
      { status: 200 }
    )
  }
}
