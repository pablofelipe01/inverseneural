'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
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
                Términos y Condiciones
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Uso educativo y responsable de la plataforma InverseNeural Lab
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Última actualización: 1 de agosto de 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-blue max-w-none">
            
            {/* Propósito Educativo */}
            <section className="mb-12">
              <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
                  📚 Propósito Exclusivamente Educativo
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p className="text-lg font-medium">
                    InverseNeural Lab es una plataforma <strong className="text-white">100% educativa</strong> diseñada para el aprendizaje de conceptos matemáticos y algoritmos cuantitativos aplicados a mercados financieros.
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>• <strong>Objetivo:</strong> Demostrar metodologías científicas de análisis cuantitativo</li>
                    <li>• <strong>Enfoque:</strong> Educación en álgebra lineal inversa y machine learning</li>
                    <li>• <strong>Simulaciones:</strong> Todas las operaciones son simuladas con fines didácticos</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Disclaimer de Inversión */}
            <section className="mb-12">
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-red-300 mb-4 flex items-center">
                  ⚠️ NO ES CONSEJO DE INVERSIÓN
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p className="text-lg font-medium text-red-200">
                    <strong>IMPORTANTE:</strong> InverseNeural Lab NO proporciona consejos de inversión, recomendaciones financieras ni orientación sobre trading real.
                  </p>
                  <ul className="space-y-2">
                    <li>• <strong>Simulaciones:</strong> Todos los resultados mostrados son simulaciones históricas</li>
                    <li>• <strong>Rendimientos pasados:</strong> No garantizan rendimientos futuros</li>
                    <li>• <strong>Decisiones financieras:</strong> Son responsabilidad exclusiva del usuario</li>
                    <li>• <strong>Consulta profesional:</strong> Recomendamos consultar asesores financieros certificados</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Conexión Opcional de Cuentas */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">🔗 Conexión Opcional de Cuentas de Trading</h2>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <p className="text-gray-300 mb-4">
                  Los usuarios pueden <strong className="text-white">opcionalmente</strong> conectar sus cuentas de trading reales para:
                </p>
                <ul className="space-y-2 text-gray-300 mb-6">
                  <li>• <strong>Observar:</strong> Cómo los algoritmos analizan datos reales</li>
                  <li>• <strong>Comparar:</strong> Resultados de simulación vs. mercado real</li>
                  <li>• <strong>Aprender:</strong> Comportamiento de algoritmos en tiempo real</li>
                </ul>
                <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
                  <p className="text-yellow-200 font-medium">
                    ⚠️ <strong>Advertencia:</strong> Cualquier operación real está bajo la total responsabilidad del usuario. InverseNeural Lab no ejecuta, recomienda ni supervisa operaciones con dinero real.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitación de Responsabilidad */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">📋 Limitación de Responsabilidad</h2>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="text-gray-300 space-y-4">
                  <p>
                    <strong className="text-white">InverseNeural Lab, sus desarrolladores y operadores NO asumen responsabilidad alguna por:</strong>
                  </p>
                  <ul className="space-y-2">
                    <li>• Pérdidas financieras derivadas del uso de la plataforma</li>
                    <li>• Decisiones de inversión basadas en información de la plataforma</li>
                    <li>• Operaciones realizadas en cuentas de trading conectadas</li>
                    <li>• Exactitud de simulaciones o predicciones algorítmicas</li>
                    <li>• Interrupciones del servicio o errores técnicos</li>
                  </ul>
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mt-6">
                    <p className="text-red-200 font-medium">
                      <strong>RIESGO FINANCIERO:</strong> El trading de instrumentos financieros implica riesgo significativo de pérdidas. Nunca invierta dinero que no pueda permitirse perder.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacidad y Datos */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">🔒 Privacidad y Protección de Datos</h2>
              <div className="bg-green-900/20 border border-green-500 rounded-lg p-6">
                <div className="text-gray-300 space-y-4">
                  <p className="text-lg font-medium text-green-200">
                    <strong>Compromiso de Privacidad:</strong> Su privacidad es nuestra prioridad.
                  </p>
                  <ul className="space-y-2">
                    <li>• <strong>No almacenamos:</strong> Datos financieros personales permanentemente</li>
                    <li>• <strong>No compartimos:</strong> Información con terceros para fines comerciales</li>
                    <li>• <strong>No enviamos:</strong> Correos publicitarios o promocionales no solicitados</li>
                    <li>• <strong>Encriptación:</strong> Todas las comunicaciones están encriptadas</li>
                    <li>• <strong>Acceso limitado:</strong> Solo personal autorizado puede acceder a datos de sistema</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Uso Aceptable */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">✅ Uso Aceptable</h2>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="text-gray-300 space-y-4">
                  <p><strong className="text-white">Usos permitidos:</strong></p>
                  <ul className="space-y-2">
                    <li>• Aprendizaje de conceptos matemáticos y algoritmos</li>
                    <li>• Investigación académica y educativa</li>
                    <li>• Análisis de metodologías cuantitativas</li>
                    <li>• Comprensión de machine learning aplicado a finanzas</li>
                  </ul>
                  
                  <p className="mt-6"><strong className="text-white">Usos prohibidos:</strong></p>
                  <ul className="space-y-2">
                    <li>• Uso comercial sin autorización explícita</li>
                    <li>• Reventa o redistribución de contenido</li>
                    <li>• Ingeniería inversa de algoritmos propietarios</li>
                    <li>• Actividades que violen leyes locales o internacionales</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Jurisdicción */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">⚖️ Jurisdicción y Ley Aplicable</h2>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="text-gray-300 space-y-4">
                  <p>
                    Estos términos se rigen por las leyes aplicables en la jurisdicción donde opera InverseNeural Lab. 
                    Cualquier disputa será resuelta mediante arbitraje o en los tribunales competentes de dicha jurisdicción.
                  </p>
                </div>
              </div>
            </section>

            {/* Modificaciones */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">📝 Modificaciones</h2>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="text-gray-300 space-y-4">
                  <p>
                    Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                    Los cambios significativos serán notificados a los usuarios registrados con al menos 30 días de anticipación.
                  </p>
                  <p>
                    El uso continuado de la plataforma después de la notificación constituye aceptación de los nuevos términos.
                  </p>
                </div>
              </div>
            </section>

            {/* Contacto */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">📞 Contacto</h2>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="text-gray-300">
                  <p>
                    Para preguntas sobre estos términos o la plataforma, contáctanos a través de los canales oficiales de InverseNeural Lab.
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* Footer Actions */}
          <div className="text-center mt-16 space-y-4">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                Al usar InverseNeural Lab, usted acepta estos términos y condiciones en su totalidad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/privacy"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Ver Política de Privacidad
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                  Comenzar Aprendizaje
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
