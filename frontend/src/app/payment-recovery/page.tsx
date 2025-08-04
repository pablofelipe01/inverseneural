'use client'

import { useUser } from '@/contexts/UserContext'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { UserProfile } from '@/types'

export default function PaymentRecoveryPage() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [daysLeft, setDaysLeft] = useState(0)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      const data = await response.json()
      setProfile(data)

      // Calcular días restantes del período de gracia
      if (data.grace_period_end) {
        const gracePeriodEnd = new Date(data.grace_period_end)
        const now = new Date()
        const diffTime = gracePeriodEnd.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        setDaysLeft(Math.max(0, diffDays))
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleUpdatePayment = async () => {
    if (loading) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/stripe/update-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const { url, error } = await response.json()

      if (error) {
        alert(`Error: ${error}`)
        return
      }

      if (url) {
        // Redirigir al portal de facturación de Stripe
        window.location.href = url
      }
    } catch (error) {
      console.error('Error updating payment method:', error)
      alert('Error al abrir el portal de pagos. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleRetryPayment = async () => {
    if (loading) return
    
    setLoading(true)
    
    try {
      // En una implementación real, aquí podrías intentar reactivar la suscripción
      // o reintentar el pago pendiente a través de la API de Stripe
      alert('Reintentando pago... Esta funcionalidad se implementará completamente.')
      
    } catch (error) {
      console.error('Error retrying payment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="InverseNeural Lab" 
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                InverseNeural Lab
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-medium">
                Powered by Math, Driven by Intelligence
              </p>
            </div>
          </Link>
          
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Volver al Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Alert Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
              Problema con tu Método de Pago
            </h1>
            <p className="text-gray-300 text-lg mb-2">
              No pudimos procesar tu último pago de suscripción
            </p>
            <p className="text-gray-400 text-sm">
              Usuario: {user?.email}
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-red-300 font-semibold mb-2">Estado Actual</h3>
                <p className="text-red-200 mb-4">
                  Tu suscripción está en período de gracia debido a un fallo en el pago.
                </p>
                
                {daysLeft > 0 ? (
                  <div className="bg-yellow-900/30 border border-yellow-600 rounded p-3">
                    <p className="text-yellow-200 text-sm">
                      <strong>Tienes {daysLeft} día{daysLeft !== 1 ? 's' : ''} restante{daysLeft !== 1 ? 's' : ''}</strong> para actualizar tu método de pago.
                      Después de este período, tu acceso será suspendido.
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-900/30 border border-red-600 rounded p-3">
                    <p className="text-red-200 text-sm">
                      <strong>El período de gracia ha expirado.</strong> Actualiza tu método de pago para reactivar tu suscripción.
                    </p>
                  </div>
                )}

                {profile?.payment_failure_count && (
                  <p className="text-gray-400 text-sm mt-2">
                    Intentos de pago fallidos: {profile.payment_failure_count}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <button
              onClick={handleUpdatePayment}
              disabled={loading}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Abriendo portal de pagos...
                </span>
              ) : (
                <>
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Actualizar Método de Pago
                </>
              )}
            </button>

            <button
              onClick={handleRetryPayment}
              disabled={loading}
              className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reintentar Pago Ahora
            </button>
          </div>

          {/* Information Section */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">¿Qué puedes hacer?</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">1.</span>
                <div>
                  <strong className="text-white">Actualizar método de pago:</strong>
                  <p className="text-sm">Añade una nueva tarjeta o actualiza la información de tu tarjeta actual.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">2.</span>
                <div>
                  <strong className="text-white">Verificar información bancaria:</strong>
                  <p className="text-sm">Asegúrate de que tu tarjeta tenga fondos suficientes y no esté bloqueada.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">3.</span>
                <div>
                  <strong className="text-white">Contactar a tu banco:</strong>
                  <p className="text-sm">Algunos bancos bloquean pagos automáticos. Verifica con ellos.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Contact */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-4">
              ¿Necesitas ayuda? Contacta a nuestro equipo de soporte
            </p>
            <Link
              href="mailto:support@inverseneur[...]Lab.com"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              support@inverseneuralab.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
