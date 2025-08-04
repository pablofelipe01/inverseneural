'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function BillingInfoPage() {
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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
            Información de Facturación
          </h1>
          <p className="text-gray-300 text-lg">
            Todo lo que necesitas saber sobre los pagos y renovaciones
          </p>
        </div>

        {/* Billing Schedule */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Ciclo de Facturación</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Suscripción Inicial</h3>
              <p className="text-gray-300 text-sm">
                Tu primera facturación ocurre cuando te suscribes al plan
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Renovación Automática</h3>
              <p className="text-gray-300 text-sm">
                Cada mes, en la misma fecha, se renueva automáticamente
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Acceso Continuo</h3>
              <p className="text-gray-300 text-sm">
                Mantén tu acceso ininterrumpido a todos los algoritmos
              </p>
            </div>
          </div>
        </div>

        {/* Payment Failure Handling */}
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-red-300 mb-6">¿Qué pasa si falla un pago?</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-300 mb-2">Período de Gracia (7 días)</h3>
                <p className="text-gray-300 text-sm">
                  Si tu pago falla, tienes 7 días completos para actualizar tu método de pago. 
                  Durante este tiempo, tu suscripción sigue activa y puedes usar todos los servicios normalmente.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-orange-300 mb-2">Notificaciones</h3>
                <p className="text-gray-300 text-sm">
                  Te enviamos notificaciones por email y mostramos avisos en el dashboard 
                  para que estés al tanto del problema de pago.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-red-300 mb-2">Suspensión (después de 7 días)</h3>
                <p className="text-gray-300 text-sm">
                  Si no actualizas tu método de pago en 7 días, tu acceso se suspende temporalmente. 
                  Puedes reactivarlo en cualquier momento actualizando tu información de pago.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Problemas Comunes y Soluciones</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-300 mb-3">🏦 Tarjeta Declinada</h3>
              <ul className="text-gray-300 text-sm space-y-2 ml-4">
                <li>• <strong>Fondos insuficientes:</strong> Verifica que tu cuenta tenga balance suficiente</li>
                <li>• <strong>Límites de gasto:</strong> Algunos bancos tienen límites diarios o mensuales</li>
                <li>• <strong>Tarjeta vencida:</strong> Revisa la fecha de vencimiento de tu tarjeta</li>
                <li>• <strong>Bloqueo por seguridad:</strong> Contacta a tu banco para verificar transacciones</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-3">💳 Información Incorrecta</h3>
              <ul className="text-gray-300 text-sm space-y-2 ml-4">
                <li>• <strong>CVV incorrecto:</strong> Verifica el código de seguridad de tu tarjeta</li>
                <li>• <strong>Dirección de facturación:</strong> Debe coincidir con la registrada en tu banco</li>
                <li>• <strong>Nombre del titular:</strong> Debe ser exactamente como aparece en la tarjeta</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-3">🌍 Restricciones Geográficas</h3>
              <ul className="text-gray-300 text-sm space-y-2 ml-4">
                <li>• <strong>Pagos internacionales:</strong> Algunos bancos bloquean pagos internacionales</li>
                <li>• <strong>Moneda:</strong> Verifica que tu banco permita transacciones en USD</li>
                <li>• <strong>Servicios online:</strong> Asegúrate de tener habilitados los pagos por internet</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6">Mejores Prácticas</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-200 mb-3">💡 Recomendaciones</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Mantén tu tarjeta actualizada</li>
                <li>• Configura recordatorios de vencimiento</li>
                <li>• Ten una tarjeta de respaldo registrada</li>
                <li>• Verifica tu email regularmente</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-blue-200 mb-3">🔒 Seguridad</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Todos los pagos son procesados por Stripe</li>
                <li>• Encriptación SSL de extremo a extremo</li>
                <li>• No almacenamos información de tarjetas</li>
                <li>• Cumplimiento PCI DSS</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">¿Necesitas Ayuda?</h2>
          <p className="text-gray-300 mb-6">
            Si tienes problemas con tu facturación o necesitas ayuda con tu suscripción, 
            nuestro equipo está aquí para ayudarte.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/payment-recovery"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Actualizar Método de Pago
            </Link>
            
            <Link
              href="mailto:support@inverseneuralab.com"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Contactar Soporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
