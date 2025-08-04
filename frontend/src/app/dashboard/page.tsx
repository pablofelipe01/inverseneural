'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Config,
  AlgorithmStatus,
  LogEntry,
  HealthStatus,
  TRADING_PAIRS,
  TRADING_SYMBOLS,
  CRYPTO_ASSETS,
  CRYPTO_SYMBOLS,
  DEFAULT_CONFIG,
  INITIAL_STATUS,
  INITIAL_LOGS,
  API_CONFIG,
  POSITION_SIZE_CONFIG,
  CRYPTO_POSITION_SIZE_CONFIG,
  ASSET_GROUP_STYLING
} from '@/types';
import { useUser } from '@/contexts/UserContext';
import Loading from '@/components/Loading';

// Componente separado para manejar searchParams con Suspense
function SuccessHandler() {
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);
  const [processedParams, setProcessedParams] = useState(false);
  const { refreshUser } = useUser();

  useEffect(() => {
    const success = searchParams.get('success');
    const plan = searchParams.get('plan');
    
    if (success === 'true' && plan && !processedParams) {
      setShowSuccessMessage(true);
      setSuccessPlan(plan);
      setProcessedParams(true);
      
      // Refresh user data ONCE to get updated subscription status
      refreshUser();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      // Clear URL parameters after processing to prevent reload issues
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('success');
        url.searchParams.delete('plan');
        window.history.replaceState({}, '', url.toString());
      }, 1000);
    }
  }, [searchParams, processedParams, refreshUser]);

  if (showSuccessMessage && successPlan) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-green-600 text-white p-4 rounded-lg shadow-lg border border-green-500 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎉</div>
          <div>
            <div className="font-semibold">¡Suscripción Activada!</div>
            <div className="text-sm opacity-90">
              Plan {successPlan.toUpperCase()} activado correctamente
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function DashboardContent() {
  // User context
  const { user, profile, loading, signOut } = useUser();

  // Debug: Log profile state for banner debugging
  console.log('🔍 Dashboard Profile Debug:', {
    subscriptionStatus: profile?.subscription_status,
    trialEndsAt: profile?.trial_ends_at,
    gracePeriodEnd: profile?.grace_period_end,
    isTrialExpired: profile?.trial_ends_at ? new Date(profile.trial_ends_at) < new Date() : false,
    shouldShowBanner: profile?.subscription_status === 'payment_failed' || 
      (profile?.subscription_status === 'trial' && profile?.trial_ends_at && new Date(profile.trial_ends_at) < new Date())
  });

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
  
  // Smart scroll state
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [hasNewLogs, setHasNewLogs] = useState(false);

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
        if (config.selectedPairs.length === 0 && config.selectedCrypto.length === 0) {
          throw new Error('Debes seleccionar al menos un activo (par o crypto)');
        }
        
        if (!config.password || config.password === 'tu_password_aqui') {
          throw new Error('Debes configurar tu contraseña de IQ Option');
        }
        
        const configPayload = {
          selectedPairs: config.selectedPairs,
          selectedCrypto: config.selectedCrypto,
          positionSize: config.positionSize,
          pairsPositionSize: config.pairsPositionSize,
          cryptoPositionSize: config.cryptoPositionSize,
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
            : config.selectedPairs.length > 0 
              ? `${config.selectedPairs.length} pares: ${config.selectedPairs.slice(0, 3).join(', ')}${config.selectedPairs.length > 3 ? '...' : ''}`
              : '';
          
          const selectedCryptoText = config.selectedCrypto.length === 8
            ? 'todas las crypto'
            : config.selectedCrypto.length > 0
              ? `${config.selectedCrypto.length} crypto: ${config.selectedCrypto.slice(0, 3).join(', ')}${config.selectedCrypto.length > 3 ? '...' : ''}`
              : '';
          
          const assetsText = [selectedPairsText, selectedCryptoText].filter(Boolean).join(' + ');
          
          setLogs(prev => [...prev, {
            timestamp: new Date().toISOString(),
            level: 'success',
            message: `🚀 Algoritmo iniciado con ${assetsText}`
          }, {
            timestamp: new Date().toISOString(),
            level: 'info',
            message: `⚙️ Configuración: Pares ${config.pairsPositionSize}%, Crypto ${config.cryptoPositionSize}%, Modo ${config.aggressiveness}`
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

  // Manejar pago exitoso
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isSuccessfulPayment = urlParams.get('success') === 'true';
    const planType = urlParams.get('plan');
    
    if (isSuccessfulPayment && planType) {
      // Mostrar mensaje de éxito
      setLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        level: 'success',
        message: `🎉 ¡Pago exitoso! Bienvenido al Plan ${planType.toUpperCase()}`
      }]);
      
      // Limpiar URL después de mostrar el mensaje
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
      
      // Forzar refresh del perfil del usuario después de 2 segundos
      // para dar tiempo al webhook de Stripe
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, []); // Solo ejecutar una vez al montar el componente

  // Smart scroll functions
  const isNearBottom = () => {
    if (!logsContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
    return scrollTop + clientHeight >= scrollHeight - 50; // 50px tolerance
  };

  const scrollToBottom = () => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
      setHasNewLogs(false);
    }
  };

  const handleScroll = () => {
    if (!logsContainerRef.current) return;
    
    const isAtBottom = isNearBottom();
    setIsUserScrolling(!isAtBottom);
    
    if (isAtBottom) {
      setHasNewLogs(false);
    }
  };

  // Smart auto-scroll effect
  useEffect(() => {
    if (logsContainerRef.current) {
      if (!isUserScrolling) {
        // Auto-scroll only if user is not manually scrolling
        logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
      } else {
        // User is scrolling manually, show indicator for new logs
        setHasNewLogs(true);
      }
    }
  }, [logs, isUserScrolling]);

  // Payment update handler
  const handlePaymentUpdate = async () => {
    try {
      setLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: '🔄 Redirigiendo al portal de pagos...'
      }]);

      const response = await fetch('/api/stripe/update-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Error al procesar la solicitud');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error updating payment:', errorMessage);
      
      setLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        level: 'error',
        message: `❌ Error al actualizar método de pago: ${errorMessage}`
      }]);
    }
  };

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
      const isCurrentlySelected = prev.selectedPairs.includes(pair);
      // Usar límite específico para pares
      const maxAllowed = getPlanInfo().pairsLimit;
      
      if (isCurrentlySelected) {
        // Remover par seleccionado
        const newPairs = prev.selectedPairs.filter(p => p !== pair);
        return { ...prev, selectedPairs: newPairs };
      } else {
        // Agregar par si no se ha alcanzado el límite
        if (prev.selectedPairs.length >= maxAllowed) {
          // Mostrar mensaje de límite alcanzado
          return prev; // No hacer cambios
        }
        const newPairs = [...prev.selectedPairs, pair];
        return { ...prev, selectedPairs: newPairs };
      }
    });
  };

  const handleCryptoSelection = (crypto: string) => {
    setConfig(prev => {
      const isCurrentlySelected = prev.selectedCrypto.includes(crypto);
      // Para trial, permitimos todos los crypto assets
      const maxAllowed = getPlanInfo().cryptoLimit; // Limit specific to crypto
      
      if (isCurrentlySelected) {
        // Remover crypto seleccionado
        const newCrypto = prev.selectedCrypto.filter(c => c !== crypto);
        return { ...prev, selectedCrypto: newCrypto };
      } else {
        // Agregar crypto si no se ha alcanzado el límite
        if (prev.selectedCrypto.length >= maxAllowed) {
          return prev; // No hacer cambios
        }
        const newCrypto = [...prev.selectedCrypto, crypto];
        return { ...prev, selectedCrypto: newCrypto };
      }
    });
  };

  const getCryptoPositionSizeColor = (size: number) => {
    const { CONSERVATIVE, BALANCED, AGGRESSIVE } = CRYPTO_POSITION_SIZE_CONFIG.COLORS;
    
    if (size >= CONSERVATIVE.min && size <= CONSERVATIVE.max) return CONSERVATIVE.class;
    if (size >= BALANCED.min && size <= BALANCED.max) return BALANCED.class;
    if (size >= AGGRESSIVE.min && size <= AGGRESSIVE.max) return AGGRESSIVE.class;
    
    return 'text-gray-400';
  };

  const getPlanInfo = () => {
    if (!profile) return { name: 'CARGANDO...', color: 'bg-gray-500', limit: 0, pairsLimit: 0, cryptoLimit: 0 };
    
    const planType = profile.plan_type?.toUpperCase() || 'TRIAL';
    
    switch (planType) {
      case 'BASIC':
        return { name: 'PLAN BÁSICO', color: 'bg-blue-500', limit: 4, pairsLimit: 4, cryptoLimit: 3 };
      case 'PRO':
        return { name: 'PLAN PRO', color: 'bg-purple-500', limit: 7, pairsLimit: 7, cryptoLimit: 5 };
      case 'ELITE':
        return { name: 'PLAN ELITE', color: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black', limit: 9, pairsLimit: 9, cryptoLimit: 8 };
      case 'TRIAL':
        return { name: 'PLAN TRIAL', color: 'bg-green-500', limit: 9, pairsLimit: 9, cryptoLimit: 8 }; // Trial tiene acceso completo
      default:
        return { name: 'PLAN TRIAL', color: 'bg-green-500', limit: 9, pairsLimit: 9, cryptoLimit: 8 }; // Trial tiene acceso completo
    }
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
      <header className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4 backdrop-blur-sm bg-opacity-95">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="InverseNeural Lab" 
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  InverseNeural Lab
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">Powered by Math, Driven by Intelligence</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-none">
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
                className="text-xs bg-red-600 hover:bg-red-700 px-2 sm:px-3 py-1 rounded transition-colors"
              >
                Salir
              </button>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2 border-l border-gray-700 pl-3 sm:pl-4">
              <div className={`w-2 h-2 rounded-full ${
                healthStatus === 'healthy' ? 'bg-green-400' : 
                healthStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
              } ${healthStatus === 'healthy' ? 'animate-pulse' : ''}`}></div>
              <span className="text-xs sm:text-sm text-gray-300">
                {healthStatus === 'healthy' ? 'Conectado' : 
                 healthStatus === 'error' ? `Desconectado${connectionRetries > 0 ? ` (${connectionRetries})` : ''}` : 'Verificando...'}
              </span>
              {lastError && (
                <div className="hidden lg:block text-xs text-red-400 max-w-xs truncate" title={lastError}>
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

      {/* Payment Warning Banner */}
      {(profile?.subscription_status === 'payment_failed' || 
        (profile?.subscription_status === 'trial' && profile?.trial_ends_at && new Date(profile.trial_ends_at) < new Date())) && (
        <div className="bg-gradient-to-r from-red-900/80 to-orange-900/80 border-b border-red-600/50 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-200 font-semibold">
                  {profile?.subscription_status === 'payment_failed' 
                    ? 'Problema con tu método de pago' 
                    : 'Tu período de prueba ha expirado'}
                </h3>
                <p className="text-red-300 text-sm">
                  {(() => {
                    if (profile.grace_period_end) {
                      const gracePeriodEnd = new Date(profile.grace_period_end)
                      const now = new Date()
                      const diffTime = gracePeriodEnd.getTime() - now.getTime()
                      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                      
                      if (daysLeft > 0) {
                        if (profile.subscription_status === 'payment_failed') {
                          return `Tu suscripción sigue activa por ${daysLeft} día${daysLeft !== 1 ? 's' : ''} más. Actualiza tu método de pago para evitar la suspensión.`
                        } else {
                          return `Te quedan ${daysLeft} día${daysLeft !== 1 ? 's' : ''} para suscribirte antes de perder acceso a tu cuenta.`
                        }
                      } else {
                        return profile.subscription_status === 'payment_failed'
                          ? 'El período de gracia ha expirado. Actualiza tu método de pago para reactivar tu suscripción.'
                          : 'El período de gracia ha expirado. Selecciona un plan para continuar.'
                      }
                    }
                    return profile.subscription_status === 'payment_failed'
                      ? 'No pudimos procesar tu último pago. Por favor, actualiza tu método de pago.'
                      : 'Tu período de prueba ha expirado. Selecciona un plan para continuar.'
                  })()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (profile?.subscription_status === 'payment_failed') {
                    handlePaymentUpdate();
                  } else {
                    window.location.href = '/pricing';
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {profile?.subscription_status === 'payment_failed' ? 'Actualizar Pago' : 'Ver Planes'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  Pares de Activos ({config.selectedPairs.length}/{getPlanInfo().pairsLimit})
                </label>
                <span className={`text-xs px-2 py-1 rounded font-bold ${getPlanInfo().color}`}>
                  {getPlanInfo().name}
                </span>
              </div>
              <p className="text-xs text-blue-400 mb-3">
                {config.selectedPairs.length === 0 
                  ? '🔸 Selecciona los pares que quieres operar'
                  : `✨ ${config.selectedPairs.length} de ${getPlanInfo().pairsLimit} pares seleccionados`
                }
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TRADING_PAIRS.map(pair => {
                  const isSelected = config.selectedPairs.includes(pair);
                  const maxAllowed = getPlanInfo().pairsLimit;
                  const isLimitReached = config.selectedPairs.length >= maxAllowed && !isSelected;
                  
                  return (
                    <button
                      key={pair}
                      onClick={() => handlePairSelection(pair)}
                      disabled={isLimitReached}
                      className={`
                        px-1 py-1 rounded text-xs font-medium transition-colors
                        ${isSelected
                          ? 'bg-blue-600 text-white border border-blue-400 shadow-lg'
                          : isLimitReached
                          ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed opacity-50'
                          : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 cursor-pointer'
                        }
                      `}
                    >
                      <span className="block leading-tight text-2xs">{TRADING_SYMBOLS[pair]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Crypto Assets Selection */}
            <div className="mb-6">
              <div className={`rounded-lg border p-4 ${ASSET_GROUP_STYLING.crypto.bgColor} ${ASSET_GROUP_STYLING.crypto.borderColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-sm font-medium ${ASSET_GROUP_STYLING.crypto.textColor}`}>
                    🪙 {ASSET_GROUP_STYLING.crypto.title} ({config.selectedCrypto.length}/{getPlanInfo().cryptoLimit})
                  </label>
                  {/* <span className={`text-xs px-2 py-1 rounded font-bold bg-purple-600 text-purple-100`}>
                    Riesgo: {ASSET_GROUP_STYLING.crypto.riskLevel}
                  </span> */}
                </div>
                <p className={`text-xs ${ASSET_GROUP_STYLING.crypto.textColor} mb-3 opacity-80`}>
                  {ASSET_GROUP_STYLING.crypto.description}
                </p>
                <p className={`text-xs text-purple-400 mb-3`}>
                  {config.selectedCrypto.length === 0 
                    ? '🔸 Selecciona las criptomonedas que quieres operar'
                    : `✨ ${config.selectedCrypto.length} de ${getPlanInfo().cryptoLimit} cryptos seleccionados`
                  }
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {CRYPTO_ASSETS.map(crypto => {
                    const isSelected = config.selectedCrypto.includes(crypto);
                    const maxAllowed = getPlanInfo().cryptoLimit;
                    const isLimitReached = config.selectedCrypto.length >= maxAllowed && !isSelected;
                    
                    return (
                      <button
                        key={crypto}
                        onClick={() => handleCryptoSelection(crypto)}
                        disabled={isLimitReached}
                        className={`
                          px-1 py-1 rounded text-xs font-medium transition-colors
                          ${isSelected
                            ? `${ASSET_GROUP_STYLING.crypto.selectedColor} text-white shadow-lg`
                            : isLimitReached
                            ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed opacity-50'
                            : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-purple-700 cursor-pointer'
                          }
                        `}
                      >
                        <span className="block leading-tight text-2xs">{CRYPTO_SYMBOLS[crypto]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Position Size for Traditional Pairs */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tamaño de Posición Pares: <span className={getPositionSizeColor(config.positionSize)}>{config.positionSize}%</span>
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

            {/* Position Size for Crypto */}
            <div className="mb-6">
              <div className={`rounded-lg border p-4 ${ASSET_GROUP_STYLING.crypto.bgColor} ${ASSET_GROUP_STYLING.crypto.borderColor}`}>
                <label className={`block text-sm font-medium ${ASSET_GROUP_STYLING.crypto.textColor} mb-2`}>
                  Tamaño de Posición Crypto: <span className={getCryptoPositionSizeColor(config.cryptoPositionSize)}>{config.cryptoPositionSize}%</span>
                  <span className="text-xs text-purple-400 ml-2"></span>
                </label>
                <input
                  type="range"
                  min={CRYPTO_POSITION_SIZE_CONFIG.MIN}
                  max={CRYPTO_POSITION_SIZE_CONFIG.MAX}
                  value={config.cryptoPositionSize}
                  onChange={(e) => setConfig(prev => ({ ...prev, cryptoPositionSize: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-purple-400 mt-1">
                  <span>{CRYPTO_POSITION_SIZE_CONFIG.MIN}% (Ultra-Conservador)</span>
                  <span>3% (Equilibrado)</span>
                  <span>{CRYPTO_POSITION_SIZE_CONFIG.MAX}% (Agresivo)</span>
                </div>
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

        {/* Logs */}
        <div className="space-y-6">
          {/* Logs */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-yellow-300">
                Registro de Actividad 
                <span className="text-sm text-gray-400 ml-2">({logs.length} entradas)</span>
              </h2>
              
              {/* New logs indicator and scroll to bottom button */}
              {hasNewLogs && (
                <button
                  onClick={scrollToBottom}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-1 animate-pulse"
                >
                  <span>Nuevos logs</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              )}
            </div>
            
            <div 
              ref={logsContainerRef}
              onScroll={handleScroll}
              className="h-96 overflow-y-auto space-y-2 bg-gray-900 rounded p-3 logs-container scroll-smooth"
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

// Componente principal que usa Suspense
export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SuccessHandler />
      <DashboardContent />
    </Suspense>
  );
}
