/**
 * InverseNeural Lab - Type Definitions
 * Tipos centralizados para el dashboard de trading cuantitativo
 */

// ===== CORE TYPES =====

// Estados del algoritmo de trading
export interface AlgorithmStatus {
  user_id: string;
  status: 'running' | 'stopped';
  profit: number;
  trades: number;
  win_rate: number;
  start_time?: string;
  last_update?: string;
}

// Entradas del sistema de logs
export interface LogEntry {
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

// Configuración de parámetros del algoritmo
export interface Config {
  selectedPairs: string[];
  positionSize: number;
  aggressiveness: 'conservador' | 'balanceado' | 'agresivo';
  // Credenciales IQ Option
  email: string;
  password: string;
  accountType: 'PRACTICE' | 'REAL';
}

// ===== UNION TYPES =====

// Estados de salud del sistema
export type HealthStatus = 'healthy' | 'error' | 'checking';

// Niveles de agresividad disponibles
export type AggressivenessLevel = 'conservador' | 'balanceado' | 'agresivo';

// Pares de trading disponibles
export type TradingPair = 
  | 'NVDA/AMD'
  | 'TESLA/FORD' 
  | 'META/GOOGLE'
  | 'AMZN/ALIBABA'
  | 'MSFT/AAPL'
  | 'AMZN/EBAY'
  | 'NFLX/AMZN'
  | 'GOOGLE/MSFT'
  | 'INTEL/IBM';

// Niveles de severity para logs
export type LogLevel = 'info' | 'success' | 'warning' | 'error';

// Estado del toggle switch
export type AlgorithmState = 'running' | 'stopped';

// ===== CONSTANTS =====

// Constantes del sistema
export const TRADING_PAIRS: TradingPair[] = [
  'NVDA/AMD',
  'TESLA/FORD', 
  'META/GOOGLE',
  'AMZN/ALIBABA',
  'MSFT/AAPL',
  'AMZN/EBAY',
  'NFLX/AMZN',
  'GOOGLE/MSFT',
  'INTEL/IBM'
];

// Mapeo de símbolos reales del mercado para display
export const TRADING_SYMBOLS: Record<TradingPair, string> = {
  'NVDA/AMD': 'NVDA/AMD',
  'TESLA/FORD': 'TSLA/F', 
  'META/GOOGLE': 'META/GOOGL',
  'AMZN/ALIBABA': 'AMZN/BABA',
  'MSFT/AAPL': 'MSFT/AAPL',
  'AMZN/EBAY': 'AMZN/EBAY',
  'NFLX/AMZN': 'NFLX/AMZN',
  'GOOGLE/MSFT': 'GOOGL/MSFT',
  'INTEL/IBM': 'INTC/IBM'
};

// Configuración por defecto
export const DEFAULT_CONFIG: Config = {
  selectedPairs: [], // Empezar sin pares seleccionados
  positionSize: 5,
  aggressiveness: 'balanceado',
  email: '',
  password: '',
  accountType: 'PRACTICE'
};

// Estado inicial del algoritmo
export const INITIAL_STATUS: AlgorithmStatus = {
  user_id: 'user123',
  status: 'stopped',
  profit: 0,
  trades: 0,
  win_rate: 0
};

// Configuración de API
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000',
  ENDPOINTS: {
    START: '/strategy/start',
    STOP: '/strategy/stop',
    STATUS: '/strategy/status',
    HEALTH: '/health',
    LOGS: '/strategy/logs',
    RESET: '/strategy/reset'
  },
  POLLING_INTERVALS: {
    STATUS: 5000,     // 5 segundos
    LOGS: 3000,       // 3 segundos para logs
    HEALTH: 30000     // 30 segundos
  }
} as const;

// Rangos de position size y sus colores
export const POSITION_SIZE_CONFIG = {
  MIN: 1,
  MAX: 15,
  COLORS: {
    CONSERVATIVE: { min: 1, max: 5, class: 'text-green-400' },
    BALANCED: { min: 6, max: 10, class: 'text-yellow-400' },
    AGGRESSIVE: { min: 11, max: 15, class: 'text-red-400' }
  }
} as const;

// Mensajes iniciales para los logs
export const INITIAL_LOGS: LogEntry[] = [
  { 
    timestamp: new Date().toISOString(), 
    level: 'info', 
    message: 'Sistema InverseNeural Lab iniciado' 
  },
  { 
    timestamp: new Date().toISOString(), 
    level: 'info', 
    message: 'Motores de álgebra lineal inversa cargados' 
  }
];

// ===== RE-EXPORTS =====

// Exportar todos los tipos de API
export * from './api';

// Exportar todos los tipos de UI
export * from './ui';
