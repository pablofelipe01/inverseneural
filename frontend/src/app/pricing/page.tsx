'use client'

import { useUser } from '@/contexts/UserContext'
import { useState } from 'react'
import Link from 'next/link'

export default function PricingPage() {
  const { user } = useUser()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePlanSelection = async (planType: 'basic' | 'pro' | 'elite') => {
    if (loading) return
    
    setSelectedPlan(planType)
    setLoading(true)
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      })

      const { url, error } = await response.json()

      if (error) {
        alert(`Error: ${error}`)
        return
      }

      if (url) {
        // Redirigir a Stripe Checkout
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Error al procesar el pago. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      {/* Home Button - Fixed position */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full border border-gray-600 hover:border-gray-500 transition-all shadow-lg group"
        title="Volver al inicio"
      >
        <svg 
          className="w-6 h-6 group-hover:scale-110 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </Link>
      
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
            Tu Trial de 15 Días Ha Expirado
          </h1>
          <p className="text-gray-300 text-lg mb-2">
            Para continuar usando InverseNeural Lab, selecciona un plan
          </p>
          <p className="text-gray-400 text-sm">
            Usuario: {user?.email}
          </p>
        </div>

        {/* Planes */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Plan Básico */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-blue-500 transition-colors">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-blue-300 mb-2">Básico</h3>
              <div className="text-3xl font-bold text-white mb-1">$29</div>
              <div className="text-gray-400 text-sm">USD/mes</div>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                5 activos simultáneos
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Algoritmo de trading automatizado
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Monitoreo en tiempo real
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Dashboard avanzado
              </li>
            </ul>
            
            <button
              onClick={() => handlePlanSelection('basic')}
              disabled={loading || selectedPlan === 'basic'}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {loading && selectedPlan === 'basic' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : selectedPlan === 'basic' ? 'Seleccionado' : 'Seleccionar Básico'}
            </button>
          </div>

          {/* Plan Pro */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-green-500 transition-colors relative">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-green-300 mb-2">Pro</h3>
              <div className="text-3xl font-bold text-white mb-1">$49</div>
              <div className="text-gray-400 text-sm">USD/mes</div>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                7 activos simultáneos
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Algoritmo de trading automatizado
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Monitoreo en tiempo real
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Dashboard avanzado
              </li>
              
            </ul>
            
            <button
              onClick={() => handlePlanSelection('pro')}
              disabled={loading || selectedPlan === 'pro'}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {loading && selectedPlan === 'pro' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : selectedPlan === 'pro' ? 'Seleccionado' : 'Seleccionar Pro'}
            </button>
          </div>

          {/* Plan Elite */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-orange-500 transition-colors">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-orange-300 mb-2">Elite</h3>
              <div className="text-3xl font-bold text-white mb-1">$99</div>
              <div className="text-gray-400 text-sm">USD/mes</div>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                9 activos simultáneos
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Algoritmo de trading automatizado
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Monitoreo en tiempo real
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Dashboard avanzado
              </li>
             
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Lista prioritaria en nuevos algoritmos.
              </li>
            </ul>
            
            <button
              onClick={() => handlePlanSelection('elite')}
              disabled={loading || selectedPlan === 'elite'}
              className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {loading && selectedPlan === 'elite' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : selectedPlan === 'elite' ? 'Seleccionado' : 'Seleccionar Elite'}
            </button>
          </div>
        </div>

        {/* Mensaje de garantía */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">
            • Puedes cancelar tu suscripción en cualquier momento
          </p>
          <p className="text-gray-400 text-sm mb-4">
            • Todos los planes incluyen las funcionalidades completas del algoritmo
          </p>
          <p className="text-gray-400 text-sm">
            • La diferencia principal está en el número de activos que puedes operar simultáneamente
          </p>
        </div>
      </div>
    </div>
  )
}
