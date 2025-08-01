'use client';

import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';
import Loading from '@/components/Loading';

export default function HomePage() {
  const { user, profile, loading } = useUser();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              InverseNeural Lab
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">Algoritmos de Álgebra Lineal Inversa</p>
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
                  Ir al Dashboard
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
                  Comenzar Trial Gratis
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Trading Algorítmico
            </span>
            <br />
            <span className="text-white">
              con Álgebra Lineal Inversa
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Revoluciona tu trading con algoritmos cuantitativos avanzados basados en análisis estadístico e inversión de matrices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
              >
                🚀 Acceder al Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
                >
                  🎯 Comenzar Trial de 15 Días
                </Link>
                <Link
                  href="/pricing"
                  className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all"
                >
                  Ver Planes
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            ¿Por qué InverseNeural Lab?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-700">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-300">Algoritmos Avanzados</h3>
              <p className="text-gray-400">
                Matemáticas de álgebra lineal inversa aplicadas al trading cuantitativo para maximizar probabilidades.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-700">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3 text-green-300">Análisis en Tiempo Real</h3>
              <p className="text-gray-400">
                Monitoreo continuo de múltiples activos con análisis estadístico instantáneo y toma de decisiones automática.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-900 rounded-lg border border-gray-700">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-3 text-yellow-300">Totalmente Seguro</h3>
              <p className="text-gray-400">
                Tus credenciales y datos están protegidos. Sin acceso a tu cuenta, solo conexión para ejecutar operaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Comienza tu Trial de 15 Días
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Sin compromisos. Sin pagos por adelantado. Cancela cuando quieras.
            </p>
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 inline-block"
            >
              Crear Cuenta Gratis
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">InverseNeural Lab</h3>
            <p className="text-gray-400 text-sm">
              Trading algorítmico profesional • Álgebra lineal inversa • Análisis cuantitativo
            </p>
          </div>
          <div className="text-xs text-gray-500">
            © 2025 InverseNeural Lab. Tecnología de trading avanzada.
          </div>
        </div>
      </footer>
    </div>
  );
}
