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
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string }
        
        console.log('💰 Pago exitoso:', {
          subscriptionId: invoice.subscription,
          amount: invoice.amount_paid,
        })

        // Mantener activa la suscripción y limpiar período de gracia
        if (invoice.subscription && typeof invoice.subscription === 'string') {
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'active',
              grace_period_end: null,
              payment_failure_count: 0,
              last_payment_failure: null,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', invoice.subscription)

          if (error) {
            console.error('Error updating profile after payment:', error)
          } else {
            console.log('✅ Suscripción reactivada y período de gracia limpiado')
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string }
        
        console.log('❌ Pago fallido:', {
          subscriptionId: invoice.subscription,
          attemptCount: invoice.attempt_count,
          dueDate: invoice.due_date,
        })

        // Sistema de gracia: dar 7 días antes de suspender
        if (invoice.subscription) {
          const gracePeriodEnd = new Date()
          gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7) // 7 días de gracia

          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'payment_failed', // Nuevo estado
              payment_failure_count: invoice.attempt_count || 1,
              grace_period_end: gracePeriodEnd.toISOString(),
              last_payment_failure: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', invoice.subscription)

          if (error) {
            console.error('Error updating profile after failed payment:', error)
          } else {
            console.log('✅ Usuario marcado con pago fallido, período de gracia hasta:', gracePeriodEnd)
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        console.log('🔄 Suscripción actualizada:', {
          subscriptionId: subscription.id,
          status: subscription.status,
        })

        // Manejar diferentes estados de suscripción
        let newStatus: string
        switch (subscription.status) {
          case 'past_due':
            newStatus = 'payment_failed'
            break
          case 'unpaid':
            newStatus = 'payment_failed'
            break
          case 'active':
            newStatus = 'active'
            break
          case 'canceled':
            newStatus = 'trial'
            break
          default:
            newStatus = subscription.status
        }

        const updateData: {
          subscription_status: string
          updated_at: string
          payment_failure_count?: number | null
          grace_period_end?: string | null
          last_payment_failure?: string | null
        } = {
          subscription_status: newStatus,
          updated_at: new Date().toISOString(),
        }

        // Si vuelve a estar activa, limpiar datos de fallo de pago
        if (subscription.status === 'active') {
          updateData.payment_failure_count = 0
          updateData.grace_period_end = null
          updateData.last_payment_failure = null
        }

        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Error updating profile after subscription status change:', error)
        } else {
          console.log('✅ Estado de suscripción actualizado a:', newStatus)
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

      case 'setup_intent.succeeded': {
        const setupIntent = event.data.object as Stripe.SetupIntent
        
        console.log('💳 Método de pago actualizado exitosamente:', {
          customerId: setupIntent.customer,
          paymentMethodId: setupIntent.payment_method,
        })

        // Si hay metadata de suscripción, intentar reactivar la suscripción
        if (setupIntent.metadata?.subscription_id && setupIntent.payment_method) {
          try {
            // Actualizar la suscripción con el nuevo método de pago
            await stripe.subscriptions.update(setupIntent.metadata.subscription_id, {
              default_payment_method: setupIntent.payment_method as string,
            })

            // Limpiar estado de pago fallido en la base de datos
            const { error } = await supabase
              .from('profiles')
              .update({
                subscription_status: 'active',
                grace_period_end: null,
                payment_failure_count: 0,
                last_payment_failure: null,
                updated_at: new Date().toISOString(),
              })
              .eq('stripe_customer_id', setupIntent.customer as string)

            if (error) {
              console.error('Error updating profile after payment method update:', error)
            } else {
              console.log('✅ Suscripción reactivada con nuevo método de pago')
            }
          } catch (err) {
            console.error('Error updating subscription with new payment method:', err)
          }
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
