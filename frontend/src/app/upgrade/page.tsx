'use client'

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
            Tu Trial de 15 Días Ha Expirado
          </h1>
          <p className="text-gray-300 text-lg">
            Continúa accediendo a los algoritmos cuantitativos más avanzados
          </p>
        </div>

        {/* Planes */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Plan Básico */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
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
                Algoritmos de Álgebra Inversa
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Análisis en tiempo real
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Soporte por email
              </li>
            </ul>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              Seleccionar Básico
            </button>
          </div>

          {/* Plan Pro */}
          <div className="bg-gray-800 rounded-lg border-2 border-green-500 p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Más Popular
              </span>
            </div>
            
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
                Algoritmos avanzados
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Análisis predictivo
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Soporte prioritario
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Reportes detallados
              </li>
            </ul>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              Seleccionar Pro
            </button>
          </div>

          {/* Plan Elite */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-yellow-300 mb-2">Elite</h3>
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
                Acceso completo
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                IA predictiva avanzada
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Soporte 24/7
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                API personalizada
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-400 mr-2">✓</span>
                Consultoría incluida
              </li>
            </ul>

            <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              Seleccionar Elite
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Todos los planes incluyen garantía de 30 días
          </p>
        </div>
      </div>
    </div>
  )
}
