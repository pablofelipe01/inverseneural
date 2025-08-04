import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    // Obtener usuario autenticado
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    // Obtener perfil del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No se encontró información de pago' },
        { status: 404 }
      )
    }

    // Verificar que el usuario tenga problemas de pago
    if (profile.subscription_status !== 'payment_failed') {
      return NextResponse.json(
        { error: 'No hay problemas de pago pendientes' },
        { status: 400 }
      )
    }

    // Obtener la suscripción activa del customer
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'all',
      limit: 1,
    })

    if (!subscriptions.data.length) {
      return NextResponse.json(
        { error: 'No se encontró suscripción activa' },
        { status: 404 }
      )
    }

    const subscription = subscriptions.data[0]

    // Crear sesión de checkout para actualizar método de pago
    const session = await stripe.checkout.sessions.create({
      customer: profile.stripe_customer_id,
      payment_method_types: ['card'],
      mode: 'setup',
      setup_intent_data: {
        metadata: {
          customer_id: profile.stripe_customer_id,
          subscription_id: subscription.id,
        },
      },
      success_url: `${req.nextUrl.origin}/dashboard?payment_updated=true`,
      cancel_url: `${req.nextUrl.origin}/dashboard?payment_cancelled=true`,
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Error creating billing portal session:', error)
    
    // Log detallado del error para debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
