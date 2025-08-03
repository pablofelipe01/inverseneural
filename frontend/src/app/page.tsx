'use client';

import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';
import Image from 'next/image';
import Loading from '@/components/Loading';
import { useState } from 'react';

export default function HomePage() {
  const { user, profile, loading } = useUser();
  const [showVideoModal, setShowVideoModal] = useState(false);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
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
              <p className="text-gray-400 text-xs sm:text-sm">Powered by Math, Driven by Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium">
                    {profile?.full_name || user.email}
                  </div>
                  <div className="text-xs text-gray-400">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      profile?.subscription_status === 'trial' 
                        ? 'bg-yellow-600 text-yellow-100' 
                        : profile?.subscription_status === 'active'
                        ? 'bg-green-600 text-green-100'
                        : 'bg-gray-600 text-gray-100'
                    }`}>
                      {profile?.subscription_status === 'trial' 
                        ? 'Trial' 
                        : profile?.plan_type?.toUpperCase() || 'FREE'}
                    </span>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Acceder al Laboratorio
                </Link>
              </>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/auth/login"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Prueba Gratuita
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source src="/video1.mp4" type="video/mp4" />
          </video>
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Modelos Matemáticos
            </span>
            <br />
            <span className="text-white drop-shadow-lg">
              para Mercados Financieros
            </span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Análisis cuantitativo basado en álgebra lineal inversa y machine learning. Metodología científica aplicada a patrones de mercado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-2xl"
              >
                Acceder al Laboratorio
              </Link>
            ) : (
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-2xl"
              >
                Prueba Gratuita 15 Días
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Metodología Científica
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-700">
              <div className="text-4xl mb-4">∑</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-300">Álgebra Lineal Inversa</h3>
              <p className="text-gray-400">
                Análisis matemático de patrones mediante inversión de matrices y transformaciones lineales aplicadas a series temporales financieras.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-700">
              <div className="text-4xl mb-4">⊗</div>
              <h3 className="text-xl font-semibold mb-3 text-green-300">Machine Learning Predictivo</h3>
              <p className="text-gray-400">
                Modelos de aprendizaje supervisado entrenados con datos históricos para identificación de patrones estadísticamente significativos.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-700">
              <div className="text-4xl mb-4">∫</div>
              <h3 className="text-xl font-semibold mb-3 text-yellow-300">Análisis Cuantitativo</h3>
              <p className="text-gray-400">
                Evaluación continua de múltiples variables mediante cálculo diferencial y análisis estadístico en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Discovery Section */}
      {!user && (
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Explora Nuestro Enfoque Científico
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Descubre cómo aplicamos matemáticas avanzadas y machine learning para analizar patrones de mercado con rigor científico.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Video Demo Card */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 hover:border-blue-500 transition-colors">
                <div className="text-5xl mb-4">🎬</div>
                <h3 className="text-xl font-bold mb-4 text-white">
                  Demostración en Video
                </h3>
                <p className="text-gray-300 mb-6">
                  Observa en tiempo real cómo funcionan nuestros algoritmos matemáticos aplicados a datos de mercado.
                </p>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 w-full"
                >
                  Ver Demostración
                </button>
              </div>

              {/* Methodology Card */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 hover:border-green-500 transition-colors">
                <div className="text-5xl mb-4">⊗</div>
                <h3 className="text-xl font-bold mb-4 text-white">
                  Metodología Científica
                </h3>
                <p className="text-gray-300 mb-6">
                  Examina los fundamentos matemáticos, papers de referencia y validación estadística de nuestros modelos.
                </p>
                <Link
                  href="/methodology"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 inline-block w-full"
                >
                  Explorar Metodología
                </Link>
              </div>
            </div>

            {/* Trial CTA */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Acceso Completo de Investigación
              </h3>
              <p className="text-gray-300 mb-6">
                15 días de acceso sin restricciones. Sin compromisos financieros. Evalúa la robustez de nuestros modelos matemáticos.
              </p>
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 inline-block"
              >
                Iniciar Evaluación Científica
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">
                Demostración del Sistema InverseNeural Lab
              </h2>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-400 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {/* Video Container */}
              <div className="aspect-video bg-gray-900 rounded-lg mb-6 border border-gray-600 overflow-hidden">
                <video
                  controls
                  className="w-full h-full object-cover"
                  poster="/logo.png"
                >
                  <source src="/video1.mp4" type="video/mp4" />
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎬</div>
                      <p className="text-gray-300 mb-4 text-lg">
                        Tu navegador no soporta video HTML5
                      </p>
                    </div>
                  </div>
                </video>
              </div>
              
              {/* Video Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-blue-400">
                    Lo que verás en esta demostración:
                  </h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Análisis en tiempo real de correlaciones entre activos</li>
                    <li>• Aplicación de modelos LSTM entrenados con 20 años de datos</li>
                    <li>• Visualización de resultados de 10M+ simulaciones</li>
                    <li>• Ejecución de estrategias validadas estadísticamente</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3 text-green-400">
                    Tecnologías mostradas:
                  </h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• <span className="font-mono text-yellow-400">tensorflow</span> - 10M simulaciones GPU</li>
                    <li>• <span className="font-mono text-yellow-400">numpy</span> - Álgebra lineal de alto rendimiento</li>
                    <li>• <span className="font-mono text-yellow-400">scipy</span> - Optimización matemática avanzada</li>
                    <li>• <span className="font-mono text-yellow-400">pandas</span> - Análisis de 20 años de datos</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 inline-block"
                  onClick={() => setShowVideoModal(false)}
                >
                  Acceder al Sistema Completo
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">InverseNeural Lab</h3>
            <p className="text-gray-400 text-sm">
              Data-Driven Precision, Ethical Results • Predictive Patterns, Sustainable Impact
            </p>
          </div>
          
          {/* Links legales */}
          <div className="mb-4 flex justify-center gap-6 text-sm">
            <Link 
              href="/terms" 
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              Términos y Condiciones
            </Link>
            <span className="text-gray-600">•</span>
            <Link 
              href="/privacy" 
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              Política de Privacidad
            </Link>
            <span className="text-gray-600">•</span>
            <Link 
              href="/methodology" 
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              Metodología
            </Link>
          </div>
          
          <div className="text-xs text-gray-500">
            © 2025 InverseNeural Lab. Modelos matemáticos aplicados a mercados financieros.
          </div>
        </div>
      </footer>
    </div>
  );
}
