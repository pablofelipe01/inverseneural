'use client'

import { useUser } from '@/contexts/UserContext'
import { useState } from 'react'

export default function PricingPage() {
  const { user } = useUser()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handlePlanSelection = async (planType: 'basic' | 'pro' | 'elite') => {
    setSelectedPlan(planType)
    
    // TODO: Integrar con Stripe
    console.log(`Plan seleccionado: ${planType}`)
    
    // Por ahora, simular selección exitosa
    alert(`Has seleccionado el plan ${planType.toUpperCase()}. Integración con Stripe próximamente.`)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
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
              disabled={selectedPlan === 'basic'}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {selectedPlan === 'basic' ? 'Seleccionado' : 'Seleccionar Básico'}
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
              disabled={selectedPlan === 'pro'}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {selectedPlan === 'pro' ? 'Seleccionado' : 'Seleccionar Pro'}
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
              disabled={selectedPlan === 'elite'}
              className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {selectedPlan === 'elite' ? 'Seleccionado' : 'Seleccionar Elite'}
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
