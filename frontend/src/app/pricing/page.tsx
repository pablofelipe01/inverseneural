'use client'

import { useUser } from '@/contexts/UserContext'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Volver al Inicio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <div className="flex items-center justify-center gap-3 mb-6">
            <Image 
              src="/logo.png" 
              alt="InverseNeural Lab" 
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              InverseNeural Lab
            </h2>
          </div> */}
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
                4 pares de stocks + 3 cryptomonedas
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
                <span className="text-blue-400 mr-2">🪙</span>
                Algoritmos especializados en crypto
              </li>
               <li className="flex items-center text-gray-300">
                <span className="text-yellow-400 mr-2">⚡</span>
                Position sizing optimizado
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
                7 pares de stocks + 5 cryptomonedas
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
                <span className="text-blue-400 mr-2">🪙</span>
                Algoritmos especializados en crypto
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-yellow-400 mr-2">⚡</span>
                Position sizing optimizado
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
                Todos los activos: 9 stocks + 8 crypto
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
                <span className="text-blue-400 mr-2">🪙</span>
                Algoritmos especializados en crypto
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-yellow-400 mr-2">⚡</span>
                Position sizing optimizado
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-orange-400 mr-2">🎯</span>
                Lista prioritaria en nuevos algoritmos
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
          <p className="text-gray-400 text-sm mb-4">
            • La diferencia principal está en el número de activos que puedes operar simultáneamente
          </p>
          <p className="text-gray-400 text-sm mb-4">
            • Renovación automática mensual con 7 días de gracia en caso de problemas de pago
          </p>
          <Link
            href="/billing-info"
            className="text-blue-400 hover:text-blue-300 underline text-sm"
          >
            Ver información completa sobre facturación →
          </Link>
        </div>

        {/* Preguntas Frecuentes */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-400">
              Respuestas a las consultas más comunes sobre InverseNeural Lab
            </p>
          </div>

          <div className="space-y-4">
            {/* Pregunta 1 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-750 transition-colors">
                  <h3 className="text-lg font-semibold text-white">
                    ¿Puedo cancelar mi cuenta en cualquier momento?
                  </h3>
                  <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-300">
                  Sí, absolutamente. Puedes cancelar tu suscripción en cualquier momento sin penalizaciones ni compromisos a largo plazo. Nuestro modelo de suscripción es completamente flexible y transparente.
                </div>
              </details>
            </div>

            {/* Pregunta 2 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-750 transition-colors">
                  <h3 className="text-lg font-semibold text-white">
                    ¿InverseNeural Lab tiene alguna relación con mi broker?
                  </h3>
                  <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-300">
                  No, InverseNeural Lab no tiene ningún tipo de relación comercial, financiera o de ninguna clase con su broker. Somos completamente independientes. Nuestro algoritmo simplemente se conecta a su cuenta a través de APIs para ejecutar operaciones basadas en nuestros modelos matemáticos.
                </div>
              </details>
            </div>

            {/* Pregunta 3 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-750 transition-colors">
                  <h3 className="text-lg font-semibold text-white">
                    ¿InverseNeural Lab son traders profesionales?
                  </h3>
                  <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-300">
                  <p className="mb-4">
                    No, no somos traders ni profesionales ni no profesionales. Somos matemáticos y estadísticos especializados en modelos predictivos. Hemos encontrado patrones fundamentalmente matemáticos aplicando:
                  </p>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h4 className="text-blue-300 font-semibold mb-3">Fundamentos Matemáticos:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Álgebra Lineal Inversa:</strong> Aplicación de matrices inversas para modelar relaciones no lineales en series temporales financieras → A⁻¹ = (AᵀA)⁻¹Aᵀ</li>
                      <li>• <strong>Machine Learning Cuantitativo:</strong> Redes neuronales LSTM combinadas con modelos VAR para capturar dependencias temporales</li>
                      <li>• <strong>Backtesting Riguroso:</strong> 20 años de datos históricos con validación estadística</li>
                    </ul>
                  </div>
                </div>
              </details>
            </div>

            {/* Pregunta 4 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-750 transition-colors">
                  <h3 className="text-lg font-semibold text-white">
                    ¿Cuál es el origen de InverseNeural Lab?
                  </h3>
                  <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-300">
                  <p className="mb-4">
                    Nuestra empresa se especializa originalmente en crear modelos predictivos para la agroindustria responsable y la remoción/captura de carbono utilizando redes neuronales, TensorFlow e inteligencia artificial. Al aplicar estos mismos modelos matemáticos al trading de opciones, descubrimos patrones estadísticos consistentes que nos llevaron a desarrollar nuestro producto SaaS.
                  </p>
                  <div className="bg-yellow-900/20 border border-yellow-600 rounded p-3">
                    <p className="text-yellow-200 text-sm">
                      <strong>Importante:</strong> Nuestra investigación es con fines netamente académicos, aunque bajo tu responsabilidad puedes conectar una cuenta real para implementar los modelos.
                    </p>
                  </div>
                </div>
              </details>
            </div>

            {/* Pregunta 5 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-750 transition-colors">
                  <h3 className="text-lg font-semibold text-white">
                    ¿Qué garantías de rendimiento ofrecen?
                  </h3>
                  <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-300">
                  <p className="mb-4">No, no ofrecemos ni podríamos ofrecer garantías de rendimiento futuro. Somos una compañía de investigación académica, ¿cómo podríamos ofrecer algo así? Lo que sí podemos hacer es mostrarte estadísticas transparentes, metodología rigurosa y resultados históricos medibles:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-900 rounded-lg p-4">
                      <ul className="space-y-2 text-sm">
                        <li>• <strong className="text-green-400">ROI General:</strong> +30.46% / mes</li>
                        <li>• <strong className="text-blue-400">Tasa de Éxito Global:</strong> 68.4%</li>
                        <li>• <strong className="text-purple-400">Sharpe Ratio:</strong> 1.8+ (ajustado por riesgo)</li>
                      </ul>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <ul className="space-y-2 text-sm">
                        <li>• <strong className="text-red-400">Maximum Drawdown:</strong> Menor al 12%</li>
                        <li>• <strong className="text-yellow-400">Período de backtesting:</strong> 20 años</li>
                        <li>• <strong className="text-cyan-400">Simulaciones:</strong> 10 millones con TensorFlow</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </details>
            </div>

            {/* Pregunta 6 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-750 transition-colors">
                  <h3 className="text-lg font-semibold text-white">
                    ¿Cómo funciona su tecnología?
                  </h3>
                  <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-300">
                  <p className="mb-4">Nuestro sistema utiliza pura matemática y machine learning:</p>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>LSTM:</strong> 60 timesteps, arquitectura 128/64/32 units</li>
                      <li>• <strong>VAR:</strong> Modelos autorregresivos vectoriales de orden p=5</li>
                      <li>• <strong>Regularización:</strong> L1/L2 + Dropout para prevenir overfitting</li>
                      <li>• <strong>Walk-Forward:</strong> Ventana móvil de 252 días de trading</li>
                      <li>• <strong>Out-of-Sample:</strong> 30% de datos reservados para validación</li>
                    </ul>
                  </div>
                </div>
              </details>
            </div>

            {/* Pregunta 7 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-750 transition-colors">
                  <h3 className="text-lg font-semibold text-white">
                    ¿Leen gráficos o usan análisis técnico tradicional?
                  </h3>
                  <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-300">
                  No. No leemos gráficos ni aplicamos análisis técnico ni fundamental tradicional. Nuestro enfoque es puramente estadístico y algorítmico, basado en patrones matemáticos identificados a través de machine learning y modelos cuantitativos avanzados.
                </div>
              </details>
            </div>

            {/* Pregunta 8 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-750 transition-colors">
                  <h3 className="text-lg font-semibold text-white">
                    ¿Tienen información privilegiada del mercado?
                  </h3>
                  <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-300">
                  Absolutamente no. No tenemos acceso a información privilegiada de ningún tipo. Nuestros modelos funcionan exclusivamente con datos públicos del mercado, procesados a través de algoritmos matemáticos y redes neuronales entrenadas con rigor estadístico.
                </div>
              </details>
            </div>

            {/* Pregunta 9 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-750 transition-colors">
                  <h3 className="text-lg font-semibold text-white">
                    ¿Qué nivel de automatización ofrece el sistema?
                  </h3>
                  <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-300">
                  <p className="mb-4">
                    El algoritmo opera de manera completamente autónoma una vez conectado a su cuenta de broker a través de APIs seguras. No requiere intervención manual ni toma de decisiones por parte del usuario. Todo se basa en los patrones identificados por nuestros modelos matemáticos.
                  </p>
                  <div className="bg-yellow-900/20 border border-yellow-600 rounded p-3">
                    <p className="text-yellow-200 text-sm">
                      <strong>Nota importante:</strong> Nuestra investigación es con fines netamente académicos, aunque bajo tu responsabilidad puedes conectar una cuenta real para la implementación práctica de los modelos.
                    </p>
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Contacto adicional */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-900/20 to-green-900/20 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                ¿Necesitas más información?
              </h3>
              <p className="text-gray-300 mb-4">
                Para más información técnica sobre nuestros modelos y metodología, consulte nuestra 
                <Link href="/methodology" className="text-blue-400 hover:text-blue-300 underline mx-1">
                  documentación científica
                </Link>
                o contacte a nuestro equipo de soporte técnico.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
