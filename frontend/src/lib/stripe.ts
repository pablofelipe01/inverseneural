import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
})

// Configuración de precios (IDs reales de Stripe)
export const STRIPE_PRICES = {
  basic: {
    monthly: process.env.STRIPE_BASIC_PRICE_ID || 'price_1RqF5cREG9vMPANZT7wxV9V1',
    price: 29,
    name: 'Básico',
    assets: 5,
  },
  pro: {
    monthly: process.env.STRIPE_PRO_PRICE_ID || 'price_1RqF7OREG9vMPANZw7fq97n1',
    price: 49,
    name: 'Pro', 
    assets: 7,
  },
  elite: {
    monthly: process.env.STRIPE_ELITE_PRICE_ID || 'price_1RqF85REG9vMPANZpYmobAqP',
    price: 99,
    name: 'Elite',
    assets: 9,
  },
} as const

export type PlanType = keyof typeof STRIPE_PRICES
