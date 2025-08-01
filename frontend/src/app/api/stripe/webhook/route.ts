import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Crear cliente Supabase con Service Role Key para el webhook
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // El cliente Supabase ya está configurado arriba con Service Role Key
  console.log('🎣 Webhook recibido:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log('💳 Checkout completado:', {
          sessionId: session.id,
          userId: session.metadata?.userId,
          planType: session.metadata?.planType,
          customer: session.customer,
          subscription: session.subscription,
          metadata: session.metadata,
        })

        if (session.metadata?.userId && session.metadata?.planType) {
          console.log('🔄 Actualizando perfil del usuario...')
          
          // Actualizar el perfil del usuario
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'active',
              plan_type: session.metadata.planType,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              updated_at: new Date().toISOString(),
            })
            .eq('id', session.metadata.userId)

          if (error) {
            console.error('❌ Error updating profile after checkout:', error)
          } else {
            console.log('✅ Usuario actualizado a plan activo:', {
              userId: session.metadata.userId,
              planType: session.metadata.planType,
              subscriptionStatus: 'active'
            })
          }
        } else {
          console.error('❌ Metadata faltante:', {
            userId: session.metadata?.userId,
            planType: session.metadata?.planType,
            allMetadata: session.metadata
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        console.log('💰 Pago exitoso:', {
          subscriptionId: invoice.subscription,
          amount: invoice.amount_paid,
        })

        // Mantener activa la suscripción
        if (invoice.subscription) {
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', invoice.subscription as string)

          if (error) {
            console.error('Error updating profile after payment:', error)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        console.log('❌ Pago fallido:', {
          subscriptionId: invoice.subscription,
          attemptCount: invoice.attempt_count,
        })

        // Marcar como trial si el pago falló
        if (invoice.subscription) {
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'trial',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', invoice.subscription as string)

          if (error) {
            console.error('Error updating profile after failed payment:', error)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        console.log('🚫 Suscripción cancelada:', {
          subscriptionId: subscription.id,
        })

        // Marcar como trial cuando se cancela la suscripción
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'trial',
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Error updating profile after subscription cancellation:', error)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    )
  }
}
