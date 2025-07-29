/**
 * API Response Types
 * Tipos específicos para las respuestas de la API
 */

import { AlgorithmStatus } from './index';

// Respuesta del endpoint de health
export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version?: string;
}

// Respuesta del endpoint de status
export interface StatusResponse extends AlgorithmStatus {
  last_trade?: {
    pair: string;
    action: 'buy' | 'sell';
    amount: number;
    price: number;
    timestamp: string;
  };
  active_pairs?: string[];
  error_count?: number;
}

// Respuesta de start/stop
export interface ToggleResponse {
  success: boolean;
  message: string;
  new_status: 'running' | 'stopped';
  timestamp: string;
}

// Error response de la API
export interface ApiError {
  error: string;
  details?: string;
  timestamp: string;
  status_code: number;
}

// Parámetros para las llamadas a la API
export interface StartAlgorithmParams {
  user_id: string;
  selected_pairs?: string[];
  position_size?: number;
  aggressiveness?: string;
}

export interface StopAlgorithmParams {
  user_id: string;
  force?: boolean;
}
