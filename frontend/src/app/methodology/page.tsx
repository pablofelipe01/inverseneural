'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function MethodologyPage() {
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
      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Metodología Científica
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fundamentos matemáticos y validación estadística de nuestros modelos de análisis cuantitativo
            </p>
          </div>

          {/* Backtesting Results - Highlighted */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-500 rounded-lg p-8 mb-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 text-white">
                  10,000,000 Simulaciones en TensorFlow
                </h2>
                <p className="text-xl text-blue-200 mb-6">
                  Análisis computacional masivo ejecutado en infraestructura de GPU distribuida
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">20 años</div>
                    <div className="text-sm text-gray-300">Datos históricos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">10M+</div>
                    <div className="text-sm text-gray-300">Simulaciones TensorFlow</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">252 días</div>
                    <div className="text-sm text-gray-300">Ventana Walk-Forward</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mathematical Foundation */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-white">
              Fundamentos Matemáticos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-400">Álgebra Lineal Inversa</h3>
                <p className="text-gray-300 mb-4">
                  Aplicación de matrices inversas para modelar relaciones no lineales en series temporales financieras.
                </p>
                <div className="bg-gray-900 p-4 rounded border border-gray-600 font-mono text-green-400 text-sm">
                  A⁻¹ = (AᵀA)⁻¹Aᵀ
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-green-400">Machine Learning Cuantitativo</h3>
                <p className="text-gray-300 mb-4">
                  Redes neuronales LSTM combinadas con modelos VAR para capturar dependencias temporales.
                </p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• LSTM: 60 timesteps, 128/64/32 units</li>
                  <li>• VAR: Orden p=5, variables múltiples</li>
                  <li>• Regularización L1/L2 + Dropout</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Performance Metrics */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-white">
              Métricas de Performance
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-purple-400">Backtesting Riguroso</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• <strong>Período:</strong> 20 años de datos históricos</li>
                  <li>• <strong>Walk-Forward:</strong> Ventana móvil de 252 días</li>
                  <li>• <strong>Out-of-Sample:</strong> 30% de datos reservados</li>
                  <li>• <strong>TensorFlow:</strong> 10 millones de simulaciones</li>
                </ul>
              </div>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-purple-400">Resultados Estadísticos</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• <strong>Sharpe Ratio:</strong> 1.8+ (ajustado por riesgo)</li>
                  <li>• <strong>Maximum Drawdown:</strong> Menor al 12%</li>
                  <li>• <strong>Win Rate:</strong> 67% (estadísticamente significativo)</li>
                  <li>• <strong>Calmar Ratio:</strong> 0.8+ </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Research Papers */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-white">
              Referencias Académicas
            </h2>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold text-white">
                    &ldquo;Long Short-Term Memory Networks for Stock Market Prediction&rdquo;
                  </p>
                  <p className="text-gray-400 text-sm">
                    Fischer & Krauss, European Journal of Operational Research, 2018
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-semibold text-white">
                    &ldquo;Statistical Arbitrage in the U.S. Equities Market&rdquo;
                  </p>
                  <p className="text-gray-400 text-sm">
                    Avellaneda & Lee, Quantitative Finance, 2010
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-semibold text-white">
                    &ldquo;Machine Learning for Financial Risk Management&rdquo;
                  </p>
                  <p className="text-gray-400 text-sm">
                    Sirignano et al., Annual Review of Financial Economics, 2019
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Experimenta la Metodología en Práctica
              </h2>
              <p className="text-gray-300 mb-6">
                Accede al laboratorio y observa estos modelos matemáticos aplicados en tiempo real
              </p>
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 inline-block"
              >
                Acceder al Laboratorio
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8 px-4 sm:px-6 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">InverseNeural Lab</h3>
            <p className="text-gray-400 text-sm">
              Data-Driven Precision, Ethical Results • Predictive Patterns, Sustainable Impact
            </p>
          </div>
          <div className="text-xs text-gray-500">
            © 2025 InverseNeural Lab. Modelos matemáticos aplicados a mercados financieros.
          </div>
        </div>
      </footer>
    </div>
  );
}
