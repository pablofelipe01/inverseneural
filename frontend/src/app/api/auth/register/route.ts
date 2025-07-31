import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Validaciones básicas
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Registrar usuario
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    if (error) {
      console.error('❌ Registration error:', error)
      
      if (error.message.includes('User already registered')) {
        return NextResponse.json(
          { error: 'Este email ya está registrado' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.log('✅ User registration successful:', {
      userId: data.user?.id,
      email: data.user?.email,
      emailConfirmed: data.user?.email_confirmed_at,
      userMetadata: data.user?.user_metadata
    })

    if (!data.user) {
      console.error('❌ No user data returned from Supabase')
      return NextResponse.json(
        { error: 'Error al crear usuario' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: data.user.email_confirmed_at 
        ? 'Usuario registrado exitosamente' 
        : 'Registro exitoso. Verifica tu email para activar tu trial de 15 días.',
      user: data.user,
      needsEmailConfirmation: !data.user.email_confirmed_at
    })

  } catch (error) {
    console.error('Unexpected registration error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
