# InverseNeural Lab - Trading Dashboard

## 🧠 Descripción General

Dashboard profesional para **InverseNeural Lab**, una plataforma SaaS de algoritmos de trading cuantitativo basados en álgebra lineal inversa y análisis estadístico avanzado.

## ✨ Características Principales

### 🎛️ Control Principal
- **Toggle Switch Dinámico**: Control visual para START/STOP del algoritmo
- **Indicador de Estado**: Muestra RUNNING/STOPPED en tiempo real
- **Estado de Conexión**: Indicador visual del estado del backend API

### ⚙️ Configuración Avanzada
- **Selector de Pares**: Selección inteligente de 5 pares de 9 disponibles
- **Position Size Slider**: Control de 1-15% con codificación por colores:
  - 🟢 Verde (1-5%): Conservador
  - 🟡 Amarillo (6-10%): Equilibrado
  - 🔴 Rojo (11-15%): Agresivo
- **Nivel de Agresividad**: Dropdown con estrategias predefinidas

### 📊 Monitoreo en Tiempo Real
- **Estadísticas Live**: Profit, trades ejecutados, win rate
- **Sistema de Logs**: Registro scrollable con niveles de severity
- **Polling Automático**: Actualización cada 5 segundos durante ejecución

## 🎨 Diseño y Branding

### Paleta de Colores
- **Base**: Dark theme (Gray-900, Gray-800)
- **Acentos**: Azul (#3b82f6) y Verde (#10b981)
- **Estados**: Verde (éxito), Amarillo (warning), Rojo (error)

### Tipografía y Branding
- **Título Principal**: "InverseNeural Lab" con gradiente animado
- **Subtítulo Técnico**: "Algoritmos de Álgebra Lineal Inversa • Análisis Estadístico Cuantitativo"
- **Fuente**: Sistema (Apple/Segoe UI/Roboto stack)

## 🔧 Tecnologías Implementadas

### Frontend Stack
- **Next.js 14** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para styling responsivo
- **React Hooks**: useState, useEffect, useCallback

### API Integration
- **Base URL**: `http://127.0.0.1:8000`
- **Endpoints**:
  - `GET /strategy/start?user_id={id}` - Iniciar algoritmo
  - `GET /strategy/stop?user_id={id}` - Detener algoritmo
  - `GET /strategy/status/{user_id}` - Estado del algoritmo
  - `GET /health` - Health check del sistema

### Características Técnicas
- **Responsive Design**: Adaptable a desktop y mobile
- **Error Handling**: Manejo robusto de errores de conexión
- **Loading States**: Indicadores visuales durante operaciones
- **Real-time Updates**: Polling inteligente del estado

## 🚀 Instalación y Uso

### Prerequisitos
```bash
Node.js 18+ 
npm o yarn
Backend API corriendo en puerto 8000
```

### Instalación
```bash
cd trading-frontend
npm install
npm run dev
```

### Acceso
- **URL Local**: http://localhost:3000
- **URL Red**: http://192.168.68.101:3000

## 📱 Funcionalidades del Dashboard

### Control de Algoritmo
1. **Inicio/Parada**: Toggle switch principal
2. **Estado Visual**: Indicador RUNNING/STOPPED
3. **Health Check**: Verificación automática cada 30s

### Configuración de Parámetros
1. **Selección de Pares**: 
   - 9 pares disponibles: EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, NZD/USD, EUR/GBP, GBP/JPY, USD/CHF
   - Máximo 5 pares seleccionables
   - UI con botones toggle

2. **Position Size**:
   - Slider de 1% a 15%
   - Código de colores automático
   - Etiquetas descriptivas

3. **Agresividad**:
   - Conservador: Menor riesgo, análisis profundo
   - Balanceado: Equilibrio riesgo/retorno  
   - Agresivo: Mayor frecuencia, alta velocidad

### Sistema de Logs
- **Capacidad**: Últimos 50 logs
- **Niveles**: Info, Success, Warning, Error
- **Timestamps**: Formato local legible
- **Auto-scroll**: Logs más recientes arriba

### Estadísticas
- **Profit Total**: Con indicador positivo/negativo
- **Número de Trades**: Contador acumulativo
- **Win Rate**: Porcentaje de éxito

## 🛠️ Estructura del Código

### Componentes Principales
- **InverseNeuralDashboard**: Componente principal
- **Estado Global**: useState para configuración y datos
- **API Functions**: fetchStatus, checkHealth, toggleAlgorithm
- **Helper Functions**: formatTime, getPositionSizeColor

### TypeScript Interfaces
```typescript
interface AlgorithmStatus {
  user_id: string;
  status: 'running' | 'stopped';
  profit: number;
  trades: number;
  win_rate: number;
  start_time?: string;
  last_update?: string;
}

interface Config {
  selectedPairs: string[];
  positionSize: number;
  aggressiveness: 'conservador' | 'balanceado' | 'agresivo';
}
```

## 🔄 Estados y Ciclo de Vida

### Estados del Sistema
1. **Inicial**: Sistema detenido, configuración por defecto
2. **Conectando**: Verificando health del backend
3. **Listo**: Conectado, esperando comandos
4. **Ejecutando**: Algoritmo activo, polling de estado
5. **Error**: Desconectado o error en API

### Polling Strategy
- **Health Check**: Cada 30 segundos
- **Status Update**: Cada 5 segundos (solo si running)
- **Error Recovery**: Retry automático en health checks

## 🎯 Casos de Uso

### Trader Cuantitativo
1. Configura pares de interés
2. Ajusta position size según perfil de riesgo
3. Selecciona nivel de agresividad
4. Inicia algoritmo y monitorea performance

### Risk Manager
1. Monitorea position size en tiempo real
2. Observa win rate y profit/loss
3. Puede detener algoritmo instantáneamente
4. Revisa logs para auditoría

### Desarrollador/QA
1. Verifica estado de conexión
2. Monitorea logs de sistema
3. Prueba diferentes configuraciones
4. Valida respuestas de API

## 🔒 Consideraciones de Seguridad

- **No Brokers Específicos**: Sin menciones de plataformas de trading
- **API Local**: Conexión segura a localhost
- **User ID**: Configuración de usuario para multi-tenancy
- **Error Masking**: Mensajes de error generales para usuarios

## 📈 Roadmap y Mejoras Futuras

### Fase 2 - Analytics
- Gráficos de performance histórica
- Métricas avanzadas (Sharpe ratio, drawdown)
- Exportación de datos

### Fase 3 - Automation
- Scheduler para ejecución automática
- Alertas por email/SMS
- Configuraciones guardadas

### Fase 4 - Advanced Features
- Backtesting interface
- A/B testing de estrategias
- Machine learning insights

---

**InverseNeural Lab** - Revolucionando el trading cuantitativo a través de álgebra lineal inversa y análisis estadístico avanzado.
