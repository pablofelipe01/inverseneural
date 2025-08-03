'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPage() {
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
                Política de Privacidad
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Compromiso total con la protección de su privacidad y datos personales
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Última actualización: 1 de agosto de 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-blue max-w-none">

            {/* Compromiso Principal */}
            <section className="mb-12">
              <div className="bg-green-900/20 border border-green-500 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-green-300 mb-4 flex items-center">
                  🛡️ Nuestro Compromiso de Privacidad
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p className="text-lg font-medium text-green-200">
                    En InverseNeural Lab, <strong>su privacidad es sagrada</strong>. Nos comprometemos a proteger sus datos con los más altos estándares de seguridad y transparencia.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="font-bold text-white mb-2">✅ Lo que SÍ hacemos</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Proteger sus datos con encriptación</li>
                        <li>• Usar información solo para funcionalidad</li>
                        <li>• Respetar sus decisiones de privacidad</li>
                        <li>• Ser transparentes sobre nuestras prácticas</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="font-bold text-white mb-2">❌ Lo que NO hacemos</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Vender datos a terceros</li>
                        <li>• Enviar correos publicitarios</li>
                        <li>• Usar datos para fines comerciales</li>
                        <li>• Compartir información personal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Información que Recopilamos */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">📋 Información que Recopilamos</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-blue-300 mb-4">1. Información de Cuenta</h3>
                  <div className="text-gray-300 space-y-2">
                    <p><strong>Recopilamos:</strong></p>
                    <ul className="space-y-1">
                      <li>• Dirección de correo electrónico (requerida)</li>
                      <li>• Nombre completo (opcional)</li>
                      <li>• Contraseña (encriptada, nunca almacenada en texto plano)</li>
                    </ul>
                    <p className="mt-4"><strong>Propósito:</strong> Autenticación, comunicaciones esenciales del servicio, soporte técnico.</p>
                  </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-blue-300 mb-4">2. Datos de Uso Educativo</h3>
                  <div className="text-gray-300 space-y-2">
                    <p><strong>Recopilamos:</strong></p>
                    <ul className="space-y-1">
                      <li>• Configuraciones de algoritmos (para funcionalidad)</li>
                      <li>• Resultados de simulaciones (estadísticas anónimas)</li>
                      <li>• Tiempo de sesión y páginas visitadas</li>
                      <li>• Preferencias de interfaz</li>
                    </ul>
                    <p className="mt-4"><strong>Propósito:</strong> Mejorar la experiencia educativa, optimizar algoritmos de demostración.</p>
                  </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-blue-300 mb-4">3. Información de Pago (Opcional)</h3>
                  <div className="text-gray-300 space-y-2">
                    <p><strong>Procesada por Stripe (no almacenada por nosotros):</strong></p>
                    <ul className="space-y-1">
                      <li>• Información de tarjeta de crédito/débito</li>
                      <li>• Dirección de facturación</li>
                      <li>• Identificador de cliente Stripe</li>
                    </ul>
                    <p className="mt-4"><strong>Propósito:</strong> Procesar suscripciones educativas premium.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Información que NO Recopilamos */}
            <section className="mb-12">
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-red-300 mb-4">❌ Información que NO Recopilamos</h2>
                <div className="text-gray-300">
                  <p className="text-lg font-medium text-red-200 mb-4">
                    <strong>Compromiso Firme:</strong> Nunca recopilamos estos tipos de datos:
                  </p>
                  <ul className="space-y-2">
                    <li>• <strong>Datos financieros reales</strong> (saldos, transacciones, inversiones)</li>
                    <li>• <strong>Información biométrica</strong> (huellas, reconocimiento facial)</li>
                    <li>• <strong>Datos de navegación externa</strong> (sitios web que visita fuera de nuestra plataforma)</li>
                    <li>• <strong>Información personal sensible</strong> (documentos de identidad, números de seguridad social)</li>
                    <li>• <strong>Datos de geolocalización</strong> (ubicación física específica)</li>
                    <li>• <strong>Comunicaciones privadas</strong> (mensajes, llamadas, emails externos)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Uso de la Información */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">🎯 Cómo Usamos su Información</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-900/20 border border-green-500 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-300 mb-4">✅ Usos Legítimos</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• <strong>Funcionalidad:</strong> Proporcionar acceso a simulaciones</li>
                    <li>• <strong>Soporte:</strong> Ayuda técnica y educativa</li>
                    <li>• <strong>Seguridad:</strong> Proteger contra uso indebido</li>
                    <li>• <strong>Mejoras:</strong> Optimizar experiencia de aprendizaje</li>
                    <li>• <strong>Comunicación:</strong> Notificaciones importantes del servicio</li>
                  </ul>
                </div>
                
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-red-300 mb-4">❌ Usos Prohibidos</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• <strong>Venta:</strong> Nunca vendemos datos a terceros</li>
                    <li>• <strong>Marketing:</strong> No enviamos publicidad no solicitada</li>
                    <li>• <strong>Perfilado:</strong> No creamos perfiles para publicidad</li>
                    <li>• <strong>Comercialización:</strong> No monetizamos datos personales</li>
                    <li>• <strong>Seguimiento:</strong> No rastreamos fuera de la plataforma</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Compartir Información */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">🔗 Compartir Información</h2>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="text-gray-300 space-y-4">
                  <p className="text-lg font-medium text-white">
                    <strong>Política Estricta:</strong> No compartimos información personal, excepto en estos casos limitados:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-900/20 border border-blue-500 rounded p-4">
                      <h3 className="font-bold text-blue-300 mb-2">🔧 Proveedores de Servicios Esenciales</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Stripe:</strong> Procesamiento de pagos (con su consentimiento)</li>
                        <li>• <strong>Supabase:</strong> Hosting de base de datos (datos encriptados)</li>
                        <li>• <strong>Vercel:</strong> Hosting de aplicación (sin acceso a datos personales)</li>
                      </ul>
                      <p className="text-xs text-blue-200 mt-2">
                        Todos los proveedores están obligados contractualmente a proteger sus datos.
                      </p>
                    </div>

                    <div className="bg-yellow-900/20 border border-yellow-500 rounded p-4">
                      <h3 className="font-bold text-yellow-300 mb-2">⚖️ Requerimientos Legales</h3>
                      <p className="text-sm">
                        Solo compartiremos información si es requerido por ley, orden judicial, o proceso legal válido.
                        En tales casos, limitaremos la divulgación al mínimo necesario y le notificaremos cuando sea legalmente posible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Seguridad */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">🔒 Medidas de Seguridad</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-purple-300 mb-4">🛡️ Encriptación</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• HTTPS/TLS para todas las comunicaciones</li>
                    <li>• Encriptación de contraseñas con bcrypt</li>
                    <li>• Base de datos encriptada en reposo</li>
                    <li>• Certificados SSL/TLS actualizados</li>
                  </ul>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-300 mb-4">🔐 Control de Acceso</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Autenticación de dos factores (disponible)</li>
                    <li>• Tokens de sesión seguros</li>
                    <li>• Acceso limitado al personal</li>
                    <li>• Logs de auditoría de acceso</li>
                  </ul>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-blue-300 mb-4">🏗️ Infraestructura</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Servidores seguros y actualizados</li>
                    <li>• Respaldos encriptados regulares</li>
                    <li>• Monitoreo de seguridad 24/7</li>
                    <li>• Cumplimiento de mejores prácticas</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Sus Derechos */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">👤 Sus Derechos de Privacidad</h2>
              
              <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6">
                <div className="text-gray-300 space-y-4">
                  <p className="text-lg font-medium text-blue-200">
                    <strong>Usted tiene control total sobre sus datos:</strong>
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-white mb-3">🔍 Derecho de Acceso</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Ver qué datos tenemos sobre usted</li>
                        <li>• Solicitar copias de su información</li>
                        <li>• Conocer cómo procesamos sus datos</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-white mb-3">✏️ Derecho de Rectificación</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Corregir información inexacta</li>
                        <li>• Actualizar datos desactualizados</li>
                        <li>• Completar información incompleta</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-white mb-3">🗑️ Derecho de Eliminación</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Eliminar su cuenta completamente</li>
                        <li>• Borrar datos específicos</li>
                        <li>• Derecho al olvido</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-white mb-3">📤 Portabilidad de Datos</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Exportar sus datos</li>
                        <li>• Transferir a otro servicio</li>
                        <li>• Formato legible por máquina</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4 mt-6">
                    <p className="text-sm">
                      <strong>Para ejercer estos derechos:</strong> Contáctenos a través de los canales oficiales. 
                      Responderemos dentro de 30 días y verificaremos su identidad para proteger su privacidad.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Retención de Datos */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">⏰ Retención de Datos</h2>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="text-gray-300 space-y-4">
                  <p>
                    <strong className="text-white">Conservamos sus datos solo el tiempo necesario:</strong>
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">ACTIVO</div>
                      <div>
                        <p><strong>Cuenta activa:</strong> Mientras mantenga su cuenta abierta</p>
                        <p className="text-sm text-gray-400">Para proporcionar el servicio educativo</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-600 text-white px-3 py-1 rounded text-sm font-bold">30 DÍAS</div>
                      <div>
                        <p><strong>Después del cierre:</strong> 30 días para recuperación de cuenta</p>
                        <p className="text-sm text-gray-400">En caso de que desee reactivar su cuenta</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">BORRADO</div>
                      <div>
                        <p><strong>Eliminación permanente:</strong> Después de 30 días</p>
                        <p className="text-sm text-gray-400">Datos personales eliminados irreversiblemente</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-500 rounded p-4 mt-6">
                    <p className="text-blue-200 text-sm">
                      <strong>Excepción:</strong> Datos estadísticos anonimizados pueden conservarse indefinidamente para investigación y mejora del servicio, sin posibilidad de identificar usuarios individuales.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">🍪 Cookies y Tecnologías Similares</h2>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="text-gray-300 space-y-4">
                  <p>
                    <strong className="text-white">Usamos cookies mínimas y esenciales:</strong>
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-green-900/20 border border-green-500 rounded p-4">
                      <h3 className="font-bold text-green-300 mb-2">✅ Cookies Esenciales (Necesarias)</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Autenticación:</strong> Mantener su sesión activa</li>
                        <li>• <strong>Seguridad:</strong> Protección CSRF y validación</li>
                        <li>• <strong>Funcionalidad:</strong> Preferencias de interfaz</li>
                      </ul>
                      <p className="text-xs text-green-200 mt-2">
                        Estas cookies son necesarias para el funcionamiento básico y no requieren consentimiento.
                      </p>
                    </div>
                    
                    <div className="bg-red-900/20 border border-red-500 rounded p-4">
                      <h3 className="font-bold text-red-300 mb-2">❌ NO Usamos</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Cookies de publicidad o marketing</li>
                        <li>• Rastreadores de terceros</li>
                        <li>• Análisis detallado de comportamiento</li>
                        <li>• Cookies de redes sociales</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contacto */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">📞 Contacto de Privacidad</h2>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="text-gray-300 space-y-4">
                  <p>
                    <strong className="text-white">Para consultas sobre privacidad, contacte:</strong>
                  </p>
                  
                  <div className="bg-blue-900/20 border border-blue-500 rounded p-4">
                    <p className="text-blue-200">
                      <strong>Oficial de Privacidad de InverseNeural Lab</strong><br />
                      Email: privacy@inverseneural.com<br />
                      Respuesta garantizada en 48 horas
                    </p>
                  </div>
                  
                  <p className="text-sm">
                    También puede contactarnos a través de los canales oficiales de soporte para cualquier 
                    pregunta relacionada con el manejo de sus datos personales.
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* Footer Actions */}
          <div className="text-center mt-16 space-y-4">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                Su privacidad es nuestra responsabilidad. Lea nuestros términos para un uso seguro y educativo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/terms"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Ver Términos y Condiciones
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                  Comenzar de Forma Segura
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
