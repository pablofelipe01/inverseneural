'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Config,
  AlgorithmStatus,
  LogEntry,
  HealthStatus,
  TRADING_PAIRS,
  TRADING_SYMBOLS,
  DEFAULT_CONFIG,
  INITIAL_STATUS,
  INITIAL_LOGS,
  API_CONFIG,
  POSITION_SIZE_CONFIG
} from '@/types';
import { useUser } from '@/contexts/UserContext';
import Loading from '@/components/Loading';

export default function InverseNeuralDashboard() {
  // User context
  const { user, profile, loading, signOut } = useUser();

  // Refs
  const logsContainerRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [status, setStatus] = useState<AlgorithmStatus>({
    ...INITIAL_STATUS,
    user_id: user?.id || 'user123'
  });
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('checking');
  const [connectionRetries, setConnectionRetries] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // API functions
  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STATUS}/${status.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatus(prev => ({ ...prev, ...data }));
        setLastError(null);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error fetching status:', errorMessage);
      setLastError(errorMessage);
      
      setLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        level: 'warning',
        message: `Error al obtener estado: ${errorMessage}`
      }]);
    }
  }, [status.user_id]);

  const checkHealth = useCallback(async () => {
    try {
      setHealthStatus('checking');
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Health check successful:', data);
        setHealthStatus('healthy');
        setConnectionRetries(0);
        setLastError(null);
        
        if (connectionRetries > 0) {
          setLogs(prev => [...prev, {
            timestamp: new Date().toISOString(),
            level: 'success',
            message: 'Conexión con backend restablecida'
          }]);
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      let errorMessage = 'Error de conexión';
      
      if (err instanceof Error) {
        if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
          errorMessage = 'Error CORS - Backend no configurado para frontend';
        } else if (err.name === 'AbortError') {
          errorMessage = 'Timeout - Backend no responde';
        } else {
          errorMessage = err.message;
        }
      }
      
      console.error('Health check failed:', errorMessage);
      
      setHealthStatus('error');
      setConnectionRetries(prev => prev + 1);
      setLastError(errorMessage);
      
      if (connectionRetries % 3 === 0) {
        setLogs(prev => [...prev, {
          timestamp: new Date().toISOString(),
          level: 'error',
          message: `Error de conexión con backend (intento ${connectionRetries + 1}): ${errorMessage}`
        }]);
      }
    }
  }, [connectionRetries]);

  const fetchLogs = useCallback(async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGS}/${status.user_id}?limit=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.logs && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      } else {
        console.error('Error fetching logs:', response.status);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  }, [status.user_id]);

  const toggleAlgorithm = async () => {
    setIsLoading(true);
    setLastError(null);
    
    try {
      if (status.status === 'running') {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STOP}?user_id=${status.user_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(10000),
        });
        
        if (response.ok) {
          setStatus(prev => ({ ...prev, status: 'stopped' }));
          setLogs(prev => [...prev, {
            timestamp: new Date().toISOString(),
            level: 'info',
            message: '⏹️ Algoritmo de trading detenido'
          }]);
        } else {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }
      } else {
        if (config.selectedPairs.length === 0) {
          throw new Error('Debes seleccionar al menos un par de activos');
        }
        
        if (!config.password || config.password === 'tu_password_aqui') {
          throw new Error('Debes configurar tu contraseña de IQ Option');
        }
        
        const configPayload = {
          selectedPairs: config.selectedPairs,
          positionSize: config.positionSize,
          aggressiveness: config.aggressiveness.toLowerCase(),
          email: user?.email || '',
          password: config.password,
          accountType: config.accountType
        };
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/strategy/start?user_id=${status.user_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(configPayload),
          signal: AbortSignal.timeout(10000),
        });
        
        if (response.ok) {
          setStatus(prev => ({ ...prev, status: 'running' }));
          
          const selectedPairsText = config.selectedPairs.length === 9 
            ? 'todos los pares premium' 
            : `${config.selectedPairs.length} pares: ${config.selectedPairs.slice(0, 3).join(', ')}${config.selectedPairs.length > 3 ? '...' : ''}`;
          
          setLogs(prev => [...prev, {
            timestamp: new Date().toISOString(),
            level: 'success',
            message: `🚀 Algoritmo iniciado con ${selectedPairsText}`
          }, {
            timestamp: new Date().toISOString(),
            level: 'info',
            message: `⚙️ Configuración: Posición ${config.positionSize}%, Modo ${config.aggressiveness}`
          }]);
        } else {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Toggle algorithm failed:', errorMessage);
      setLastError(errorMessage);
      
      setLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        level: 'error',
        message: `❌ Error al ${status.status === 'running' ? 'detener' : 'iniciar'} algoritmo: ${errorMessage}`
      }]);
    }
    setIsLoading(false);
  };

  const resetStrategy = async () => {
    setIsResetting(true);
    setLastError(null);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESET}/${status.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          setStatus(prev => ({ 
            ...prev, 
            profit: 0, 
            trades: 0, 
            win_rate: 0 
          }));
          
          setLogs(prev => [...prev, {
            timestamp: new Date().toISOString(),
            level: 'success',
            message: `✅ ${data.message || 'Estadísticas reseteadas exitosamente'}`
          }]);
          
          setShowResetConfirm(false);
        } else {
          throw new Error(data.message || 'Error en el reset');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Reset failed:', errorMessage);
      setLastError(errorMessage);
      
      setLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        level: 'error',
        message: `❌ Error en reset: ${errorMessage}`
      }]);
    }
    setIsResetting(false);
  };

  // Effects
  useEffect(() => {
    checkHealth();
    const healthInterval = setInterval(checkHealth, API_CONFIG.POLLING_INTERVALS.HEALTH);
    return () => clearInterval(healthInterval);
  }, [checkHealth]);

  useEffect(() => {
    if (status.status === 'running') {
      const statusInterval = setInterval(fetchStatus, API_CONFIG.POLLING_INTERVALS.STATUS);
      return () => clearInterval(statusInterval);
    }
  }, [status.status, fetchStatus]);

  useEffect(() => {
    fetchLogs();
    const logsInterval = setInterval(fetchLogs, API_CONFIG.POLLING_INTERVALS.LOGS);
    return () => clearInterval(logsInterval);
  }, [fetchLogs]);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Helper functions
  const getPositionSizeColor = (size: number) => {
    const { CONSERVATIVE, BALANCED, AGGRESSIVE } = POSITION_SIZE_CONFIG.COLORS;
    
    if (size >= CONSERVATIVE.min && size <= CONSERVATIVE.max) return CONSERVATIVE.class;
    if (size >= BALANCED.min && size <= BALANCED.max) return BALANCED.class;
    if (size >= AGGRESSIVE.min && size <= AGGRESSIVE.max) return AGGRESSIVE.class;
    
    return 'text-gray-400';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const handlePairSelection = (pair: string) => {
    setConfig(prev => {
      const newPairs = prev.selectedPairs.includes(pair)
        ? prev.selectedPairs.filter(p => p !== pair)
        : [...prev.selectedPairs, pair];
      
      return { ...prev, selectedPairs: newPairs };
    });
  };

  const getTrialDaysLeft = () => {
    if (!profile?.trial_ends_at) return 0;
    const trialEnd = new Date(profile.trial_ends_at);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Loading check after all hooks
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              InverseNeural Lab
            </h1>
            <p className="text-gray-400 text-sm">Algoritmos de Álgebra Lineal Inversa • Análisis Estadístico Cuantitativo</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  {profile?.full_name || user?.email}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    profile?.subscription_status === 'trial' 
                      ? 'bg-yellow-600 text-yellow-100' 
                      : profile?.subscription_status === 'active'
                      ? 'bg-green-600 text-green-100'
                      : 'bg-gray-600 text-gray-100'
                  }`}>
                    {profile?.subscription_status === 'trial' 
                      ? `Trial: ${getTrialDaysLeft()} días` 
                      : profile?.plan_type?.toUpperCase() || 'FREE'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={signOut}
                className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
              >
                Salir
              </button>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
              <div className={`w-2 h-2 rounded-full ${
                healthStatus === 'healthy' ? 'bg-green-400' : 
                healthStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
              } ${healthStatus === 'healthy' ? 'animate-pulse' : ''}`}></div>
              <span className="text-sm text-gray-300">
                {healthStatus === 'healthy' ? 'Conectado' : 
                 healthStatus === 'error' ? `Desconectado ${connectionRetries > 0 ? `(${connectionRetries} intentos)` : ''}` : 'Verificando...'}
              </span>
              {lastError && (
                <div className="hidden sm:block text-xs text-red-400 max-w-xs truncate" title={lastError}>
                  {lastError}
                </div>
              )}
              {healthStatus === 'error' && (
                <button
                  onClick={checkHealth}
                  className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                >
                  Reconectar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Debug Panel - Solo visible cuando hay errores */}
        {healthStatus === 'error' && (
          <div className="lg:col-span-3 bg-red-900/20 border border-red-700 rounded-lg p-4">
            <h3 className="text-red-300 font-semibold mb-2 flex items-center">
              <span className="mr-2">⚠️</span>
              Estado de Conexión - Debug
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Backend URL:</span>
                <div className="text-white font-mono">{API_CONFIG.BASE_URL}</div>
              </div>
              <div>
                <span className="text-gray-400">Intentos fallidos:</span>
                <div className="text-red-300">{connectionRetries}</div>
              </div>
              <div>
                <span className="text-gray-400">Último error:</span>
                <div className="text-red-300 truncate" title={lastError || 'N/A'}>
                  {lastError || 'N/A'}
                </div>
              </div>
            </div>
            
            {/* Información específica para errores CORS */}
            {lastError?.includes('CORS') && (
              <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-700 rounded">
                <h4 className="text-yellow-300 font-medium mb-2">🔧 Solución para Error CORS:</h4>
                <div className="text-sm text-yellow-100 space-y-1">
                  <p>• El backend necesita configurar headers CORS para permitir requests desde localhost:3000</p>
                  <p>• Agregar estos headers en el backend Python:</p>
                  <code className="block mt-1 p-2 bg-black/30 rounded text-xs font-mono">
                    Access-Control-Allow-Origin: http://localhost:3000<br/>
                    Access-Control-Allow-Methods: GET, POST, OPTIONS<br/>
                    Access-Control-Allow-Headers: Content-Type
                  </code>
                </div>
              </div>
            )}
            
            <div className="mt-3 flex gap-2">
              <button
                onClick={checkHealth}
                className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
              >
                Reintentar Conexión
              </button>
              <button
                onClick={() => window.open(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.HEALTH, '_blank')}
                className="text-xs bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded transition-colors"
              >
                Abrir Health Check
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`curl -s ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`);
                  alert('Comando curl copiado al clipboard');
                }}
                className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
              >
                Copiar Comando curl
              </button>
            </div>
          </div>
        )}

        {/* Main Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Algorithm Control */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Control de Algoritmo</h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className={`text-2xl font-bold ${
                  status.status === 'running' ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {status.status === 'running' ? 'EJECUTÁNDOSE' : 'DETENIDO'}
                </div>
                <p className="text-gray-400 text-sm">
                  {status.status === 'running' ? 'Procesando matrices inversas...' : 'Motor cuantitativo en espera'}
                </p>
              </div>
              <button
                onClick={toggleAlgorithm}
                disabled={isLoading || healthStatus !== 'healthy'}
                className={`
                  relative w-20 h-10 rounded-full transition-all duration-300 border-2
                  ${status.status === 'running' 
                    ? 'bg-green-600 border-green-400' 
                    : 'bg-gray-600 border-gray-500'
                  }
                  ${isLoading || healthStatus !== 'healthy' 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105 cursor-pointer'
                  }
                `}
              >
                <div className={`
                  absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300
                  ${status.status === 'running' ? 'translate-x-11' : 'translate-x-1'}
                `}></div>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            </div>
            
            {/* Reset Button - Testing Mode */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-400 text-sm font-medium">⚠️ Modo Testing</p>
                  <p className="text-gray-500 text-xs">Resetear estadísticas para pruebas</p>
                </div>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  disabled={status.status === 'running' || isResetting || healthStatus !== 'healthy'}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${status.status === 'running' || isResetting || healthStatus !== 'healthy'
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-700 text-white border border-orange-500'
                    }
                  `}
                >
                  {isResetting ? (
                    <span className="flex items-center">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Resetting...
                    </span>
                  ) : (
                    '⚠️ RESET DATOS'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Configuración de Parámetros</h2>
            
            {/* IQ Option Credentials */}
            <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-600">
              <h3 className="text-lg font-medium text-yellow-300 mb-3 flex items-center">
                🔐 Credenciales Broker
                <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">SEGURO</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                    <span className="ml-2 text-xs text-blue-400">(Vinculado a tu cuenta)</span>
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    disabled
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-gray-300 cursor-not-allowed"
                    title="El email está vinculado a tu cuenta y no se puede cambiar"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={config.password}
                    onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Cuenta</label>
                  <select
                    value={config.accountType}
                    onChange={(e) => setConfig(prev => ({ ...prev, accountType: e.target.value as 'PRACTICE' | 'REAL' }))}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PRACTICE">PRACTICE - Cuenta Demo</option>
                    <option value="REAL">REAL - Cuenta Real</option>
                  </select>
                </div>
                <div className="hidden md:block text-xs text-gray-400 max-w-xs">
                  <p className="mb-1">🔒 Tus credenciales están seguras</p>
                  <p className="mb-1">Email vinculado a tu cuenta de usuario</p>
                  <p>Solo se usan para conectar al broker</p>
                </div>
              </div>
              
              {/* Mensaje de seguridad para móvil */}
              <div className="md:hidden mt-3 text-xs text-gray-400 text-center">
                <p className="mb-1">🔒 Tus credenciales están seguras</p>
                <p className="mb-1">Email vinculado a tu cuenta de usuario</p>
                <p>Solo se usan para conectar al broker</p>
              </div>
            </div>
            
            {/* Trading Pairs Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Pares de Activos ({config.selectedPairs.length}/9)
                </label>
                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-1 rounded font-bold">
                  PLAN ELITE
                </span>
              </div>
              <p className="text-xs text-green-400 mb-3">✨ Acceso completo a todos los pares premium</p>
              <div className="grid grid-cols-3 gap-2">
                {TRADING_PAIRS.map(pair => (
                  <button
                    key={pair}
                    onClick={() => handlePairSelection(pair)}
                    className={`
                      px-1 py-1 rounded text-xs font-medium transition-colors
                      ${config.selectedPairs.includes(pair)
                        ? 'bg-blue-600 text-white border border-blue-400 shadow-lg'
                        : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
                      }
                    `}
                  >
                    <span className="block leading-tight text-2xs">{TRADING_SYMBOLS[pair]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Position Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tamaño de Posición: <span className={getPositionSizeColor(config.positionSize)}>{config.positionSize}%</span>
              </label>
              <input
                type="range"
                min={POSITION_SIZE_CONFIG.MIN}
                max={POSITION_SIZE_CONFIG.MAX}
                value={config.positionSize}
                onChange={(e) => setConfig(prev => ({ ...prev, positionSize: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{POSITION_SIZE_CONFIG.MIN}% (Conservador)</span>
                <span>8% (Equilibrado)</span>
                <span>{POSITION_SIZE_CONFIG.MAX}% (Agresivo)</span>
              </div>
            </div>

            {/* Aggressiveness */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nivel de Agresividad</label>
              <select
                value={config.aggressiveness}
                onChange={(e) => setConfig(prev => ({ ...prev, aggressiveness: e.target.value as Config['aggressiveness'] }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="conservador">Conservador - Menor riesgo, análisis profundo</option>
                <option value="balanceado">Balanceado - Equilibrio riesgo/retorno</option>
                <option value="agresivo">Agresivo - Mayor frecuencia, alta velocidad</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics and Logs */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-300">Estadísticas</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Beneficio Total:</span>
                <span className={`font-semibold ${status.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${status.profit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Operaciones:</span>
                <span className="font-semibold text-blue-400">{status.trades}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tasa de Éxito:</span>
                <span className="font-semibold text-purple-400">{status.win_rate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Logs */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-300">
              Registro de Actividad 
              <span className="text-sm text-gray-400 ml-2">({logs.length} entradas)</span>
            </h2>
            <div 
              ref={logsContainerRef}
              className="h-64 overflow-y-auto space-y-2 bg-gray-900 rounded p-3 logs-container scroll-smooth"
            >
              {logs.map((log, index) => (
                <div key={`${log.timestamp}-${index}`} className="text-xs">
                  <span className="text-gray-500">{formatTime(log.timestamp)}</span>
                  <span className={`ml-2 font-medium ${
                    log.level === 'success' ? 'text-green-400' :
                    log.level === 'warning' ? 'text-yellow-400' :
                    log.level === 'error' ? 'text-red-400' :
                    'text-blue-400'
                  }`}>
                    [{log.level.toUpperCase()}]
                  </span>
                  <span className="ml-1 text-gray-200">
                    {log.message}
                  </span>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Cargando logs del sistema...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-red-600 p-6 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">⚠️</span>
              <h3 className="text-xl font-bold text-red-400">Confirmar Reset</h3>
            </div>
            <p className="text-gray-300 mb-2">
              ¿Estás seguro de que quieres resetear todas las estadísticas?
            </p>
            <p className="text-red-400 text-sm mb-6">
              Esta acción borrará permanentemente:
            </p>
            <ul className="text-sm text-gray-400 mb-6 space-y-1">
              <li>• Beneficio total: ${status.profit.toFixed(2)}</li>
              <li>• Operaciones realizadas: {status.trades}</li>
              <li>• Tasa de éxito: {status.win_rate.toFixed(1)}%</li>
              <li>• Historial de trading</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={resetStrategy}
                disabled={isResetting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isResetting ? 'Resetting...' : 'Sí, Resetear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}