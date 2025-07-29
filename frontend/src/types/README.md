# Types Architecture - InverseNeural Lab

## 📁 Estructura de Tipos

La arquitectura de tipos está organizada de manera modular para facilitar el mantenimiento y la escalabilidad del proyecto.

```
src/types/
├── index.ts       # Tipos principales y re-exports
├── api.ts         # Tipos específicos para API
├── ui.ts          # Tipos para componentes UI
└── README.md      # Este archivo
```

## 🏗️ Arquitectura de Tipos

### **index.ts** - Tipos Principales
Contiene los tipos fundamentales del dominio de negocio:

#### Core Interfaces
- `AlgorithmStatus` - Estado del algoritmo de trading
- `LogEntry` - Entradas del sistema de logs  
- `Config` - Configuración de parámetros

#### Union Types
- `HealthStatus` - Estados de salud del sistema
- `AggressivenessLevel` - Niveles de agresividad
- `TradingPair` - Pares de trading disponibles
- `LogLevel` - Niveles de severity
- `AlgorithmState` - Estados del toggle

#### Constants
- `TRADING_PAIRS` - Lista de pares disponibles
- `DEFAULT_CONFIG` - Configuración por defecto
- `INITIAL_STATUS` - Estado inicial del algoritmo
- `API_CONFIG` - Configuración de endpoints y polling
- `POSITION_SIZE_CONFIG` - Configuración de rangos y colores
- `INITIAL_LOGS` - Mensajes iniciales del sistema

### **api.ts** - Tipos de API
Tipos específicos para comunicación con el backend:

#### Response Types
- `HealthResponse` - Respuesta del health check
- `StatusResponse` - Respuesta del estado del algoritmo
- `ToggleResponse` - Respuesta de start/stop
- `ApiError` - Estructura de errores de API

#### Request Parameters
- `StartAlgorithmParams` - Parámetros para iniciar algoritmo
- `StopAlgorithmParams` - Parámetros para detener algoritmo

### **ui.ts** - Tipos de UI
Tipos específicos para componentes de interfaz:

#### Component Props
- `ToggleSwitchProps` - Props del switch principal
- `StatusIndicatorProps` - Props del indicador de estado
- `LogDisplayProps` - Props del display de logs
- `PairSelectorProps` - Props del selector de pares
- `PositionSizeSliderProps` - Props del slider de position size
- `StatCardProps` - Props de las tarjetas de estadísticas

#### UI State
- `DashboardState` - Estado general del dashboard
- `ThemeColors` - Definición de colores del tema
- `Breakpoint` - Breakpoints responsivos
- `AnimationConfig` - Configuración de animaciones

## 🔄 Importación y Uso

### Importación Centralizada
```typescript
// Importar desde el índice principal
import { 
  AlgorithmStatus, 
  Config, 
  TRADING_PAIRS,
  API_CONFIG 
} from '@/types';
```

### Importación Específica
```typescript
// Importar tipos específicos de API
import { HealthResponse, StatusResponse } from '@/types/api';

// Importar tipos específicos de UI
import { ToggleSwitchProps, StatCardProps } from '@/types/ui';
```

## 🎯 Beneficios de esta Arquitectura

### 1. **Separación de Responsabilidades**
- Tipos de dominio en `index.ts`
- Tipos de comunicación en `api.ts`  
- Tipos de presentación en `ui.ts`

### 2. **Mantenibilidad**
- Fácil localización de tipos específicos
- Actualizaciones centralizadas
- Evolución independiente de cada módulo

### 3. **Reutilización**
- Constantes centralizadas evitan duplicación
- Tipos base pueden extenderse fácilmente
- Configuración unificada

### 4. **Type Safety**
- TypeScript estricto en toda la aplicación
- Autocompletado mejorado en IDEs
- Detección temprana de errores

### 5. **Escalabilidad**
- Fácil agregar nuevos dominios
- Estructura modular permite crecimiento
- Re-exports simplifican importaciones

## 🛠️ Patrones de Uso

### Extender Tipos Base
```typescript
// En api.ts - Extender AlgorithmStatus
export interface StatusResponse extends AlgorithmStatus {
  last_trade?: TradeDetails;
  active_pairs?: string[];
}
```

### Usar Constantes Tipadas
```typescript
// En lugar de strings mágicos
const endpoint = API_CONFIG.ENDPOINTS.STATUS; // ✅

// En lugar de
const endpoint = '/strategy/status'; // ❌
```

### Definir Props con Tipos Union
```typescript
// Usar tipos union para props
interface StatusProps {
  status: AlgorithmState; // 'running' | 'stopped'
  level: LogLevel;        // 'info' | 'success' | 'warning' | 'error'
}
```

## 🔮 Roadmap

### Próximas Adiciones
- **analytics.ts** - Tipos para métricas y analytics
- **trading.ts** - Tipos específicos de trading (orders, positions)
- **user.ts** - Tipos de usuario y configuraciones
- **charts.ts** - Tipos para componentes de gráficos

### Mejoras Futuras
- Generación automática desde OpenAPI specs
- Validación runtime con Zod/Yup
- Documentación automática de tipos
- Tests de tipos con TypeScript

---

Esta arquitectura proporciona una base sólida y escalable para el crecimiento del proyecto **InverseNeural Lab**.
