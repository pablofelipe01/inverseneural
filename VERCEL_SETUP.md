# 🚀 VERCEL DEPLOYMENT - CONFIGURACIÓN

## Variables de Entorno para Vercel

### Authentication & Database
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Stripe Configuration
```env
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ELITE_PRICE_ID=price_...
```

### Backend API Configuration (NUEVO)
```env
# Elestio Backend URL
NEXT_PUBLIC_API_BASE_URL=https://your-trading-api.elestio.app
API_SECRET_KEY=your_secure_api_key_here
```

### Deployment Settings
```env
NEXT_PUBLIC_APP_URL=https://inverseneural.io
NODE_ENV=production
```

## Archivos a configurar:

1. **vercel.json** - Configuración de deploy
2. **next.config.js** - Optimizaciones
3. **API routes updates** - Para comunicación externa
4. **Environment validation** - Verificar variables

¿Creamos estos archivos de configuración?
