'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
              InverseNeural Lab
            </h1>
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
            InverseNeural Lab
          </h1>
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

            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-700 rounded p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creando cuenta...
                </span>
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