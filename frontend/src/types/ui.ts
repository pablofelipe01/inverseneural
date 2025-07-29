/**
 * UI Component Types
 * Tipos específicos para componentes de la interfaz
 */

import { LogLevel, AlgorithmState } from './index';

// Props para componentes reutilizables
export interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface StatusIndicatorProps {
  status: AlgorithmState;
  isConnected: boolean;
  showPulse?: boolean;
}

export interface LogDisplayProps {
  logs: Array<{
    timestamp: string;
    level: LogLevel;
    message: string;
  }>;
  maxHeight?: string;
  maxEntries?: number;
}

export interface PairSelectorProps {
  availablePairs: string[];
  selectedPairs: string[];
  maxSelections: number;
  onPairToggle: (pair: string) => void;
  isDisabled?: boolean;
}

export interface PositionSizeSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  colorRanges: {
    conservative: { min: number; max: number };
    balanced: { min: number; max: number };
    aggressive: { min: number; max: number };
  };
  isDisabled?: boolean;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  color?: 'green' | 'red' | 'blue' | 'purple' | 'yellow';
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

// Estados de UI
export interface DashboardState {
  isLoading: boolean;
  error: string | null;
  lastUpdate: string | null;
  connectionRetries: number;
}

// Tema y colores
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
}

// Breakpoints responsivos
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Animaciones
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}
