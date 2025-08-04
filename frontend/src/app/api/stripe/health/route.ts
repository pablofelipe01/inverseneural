import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET() {
  try {
    // Verificar configuración de Stripe
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY
    const secretKeyPreview = process.env.STRIPE_SECRET_KEY 
      ? process.env.STRIPE_SECRET_KEY.substring(0, 10) + '...' 
      : 'NOT_SET'

    // Test básico de conexión con Stripe
    const account = await stripe.accounts.retrieve()

    return NextResponse.json({
      status: 'healthy',
      stripe: {
        hasSecretKey,
        secretKeyPreview,
        accountId: account.id,
        accountCountry: account.country,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Stripe health check failed:', error)
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stripe: {
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        secretKeyPreview: process.env.STRIPE_SECRET_KEY 
          ? process.env.STRIPE_SECRET_KEY.substring(0, 10) + '...' 
          : 'NOT_SET'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
