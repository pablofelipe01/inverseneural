import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return NextResponse.json(
        { user: null, profile: null, session: null },
        { status: 200 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { user: null, profile: null, session: null },
        { status: 200 }
      )
    }

    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError)
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
