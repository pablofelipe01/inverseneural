'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Legal agreement checkboxes
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [confirmEducational, setConfirmEducational] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate legal agreements
    if (!acceptTerms) {
      setError('Debe aceptar los Términos y Condiciones para continuar');
      setIsLoading(false);
      return;
    }

    if (!acceptPrivacy) {
      setError('Debe aceptar la Política de Privacidad para continuar');
      setIsLoading(false);
      return;
    }

    if (!confirmEducational) {
      setError('Debe confirmar que entiende el propósito educativo de la plataforma');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          fullName,
          legalAgreements: {
            acceptedTerms: true,
            acceptedPrivacy: true,
            confirmedEducational: true,
            timestamp: new Date().toISOString()
          }
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear cuenta');
      }

      if (data.success) {
        setSuccess(true);
      } else {
        throw new Error('Error inesperado');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image 
                src="/logo.png" 
                alt="InverseNeural Lab" 
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                InverseNeural Lab
              </h1>
            </div>
            <p className="text-gray-400 text-sm">Algoritmos de Álgebra Lineal Inversa</p>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
            <div className="text-green-400 text-4xl mb-4">✓</div>
            <h2 className="text-xl font-semibold mb-4 text-green-300">¡Registro Exitoso!</h2>
            <p className="text-gray-400 mb-6">
              Hemos enviado un email de confirmación a <strong className="text-white">{email}</strong>
            </p>
            <p className="text-sm text-yellow-400 mb-6">
              🎉 <strong>Al confirmar tu email, activarás tu trial gratuito de 15 días</strong>
            </p>
            <Link 
              href="/auth/login"
              className="inline-block bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
            >
              Ir a Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image 
              src="/logo.png" 
              alt="InverseNeural Lab" 
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              InverseNeural Lab
            </h1>
          </div>
          <p className="text-gray-400 text-sm">Algoritmos de Álgebra Lineal Inversa</p>
        </div>

        {/* Register Form */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-2 text-blue-300">Crear Cuenta</h2>
          <p className="text-gray-400 text-sm mb-6">
            🎉 <strong className="text-yellow-400">15 días gratis</strong> para probar el laboratorio completo
          </p>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {/* Legal Agreement Checkboxes */}
            <div className="bg-gray-900/50 border border-yellow-600 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-center mb-2">
                <span className="text-yellow-400 text-lg">⚖️</span>
                <span className="text-sm font-medium text-yellow-300 ml-2">
                  Acuerdos Legales Obligatorios
                </span>
              </div>
              
              <div className="space-y-3">
                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    required
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-gray-300">
                    <span className="text-red-400">*</span> He leído y acepto los{' '}
                    <Link 
                      href="/terms" 
                      target="_blank" 
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Términos y Condiciones
                    </Link>
                    {' '}incluyendo todas las limitaciones de responsabilidad y advertencias sobre el propósito educativo.
                  </label>
                </div>

                {/* Privacy Policy */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="acceptPrivacy"
                    checked={acceptPrivacy}
                    onChange={(e) => setAcceptPrivacy(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    required
                  />
                  <label htmlFor="acceptPrivacy" className="text-sm text-gray-300">
                    <span className="text-red-400">*</span> He leído y acepto la{' '}
                    <Link 
                      href="/privacy" 
                      target="_blank" 
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Política de Privacidad
                    </Link>
                    {' '}y consiento el procesamiento de mis datos según se describe.
                  </label>
                </div>

                {/* Educational Purpose Confirmation */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="confirmEducational"
                    checked={confirmEducational}
                    onChange={(e) => setConfirmEducational(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    required
                  />
                  <label htmlFor="confirmEducational" className="text-sm text-gray-300">
                    <span className="text-red-400">*</span> 
                    <strong className="text-yellow-300"> Confirmo que entiendo</strong> que esta plataforma es 
                    <strong className="text-green-300"> 100% educativa</strong>, no constituye asesoramiento de inversión, 
                    y <strong className="text-red-300">asumo 100% de la responsabilidad financiera</strong> por mis decisiones de trading sin responsabilizar a InverseNeural Lab.
                  </label>
                </div>
              </div>

              <div className="text-xs text-gray-400 text-center mt-3 pt-3 border-t border-gray-700">
                <span className="text-red-400">*</span> Todos los campos son obligatorios para el registro
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-700 rounded p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !acceptTerms || !acceptPrivacy || !confirmEducational}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creando cuenta...
                </span>
              ) : !acceptTerms || !acceptPrivacy || !confirmEducational ? (
                'Complete todos los acuerdos legales'
              ) : (
                'Crear Cuenta - 15 días gratis'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                Iniciar Sesión
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2">✨ Incluye en tu trial:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Acceso completo a algoritmos cuantitativos</li>
              <li>• 9 pares de activos premium</li>
              <li>• Análisis estadístico en tiempo real</li>
              <li>• Soporte técnico incluido</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}