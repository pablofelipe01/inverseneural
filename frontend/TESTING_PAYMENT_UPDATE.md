# 🧪 TESTING COMPLETO - ACTUALIZACIÓN DE MÉTODO DE PAGO

## Paso 1: Preparar Base de Datos
```sql
-- Ejecutar en Supabase SQL Editor
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS grace_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_failure_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_payment_failure TIMESTAMPTZ;
```

## Paso 2: Simular Estado de Pago Fallido
```sql
-- Script #5: Simular pago fallido con gracia activa
UPDATE profiles 
SET 
  subscription_status = 'payment_failed',
  trial_ends_at = NOW() - INTERVAL '30 days',
  grace_period_end = NOW() + INTERVAL '2 days',
  payment_failure_count = 1,
  last_payment_failure = NOW() - INTERVAL '1 day'
WHERE email = 'pablo.felipe.acebedo@gmail.com';
```

## Paso 3: Verificar Estado
```sql
-- Script #9: Verificación
SELECT 
  email,
  subscription_status,
  grace_period_end,
  payment_failure_count,
  CASE 
    WHEN subscription_status = 'payment_failed' AND grace_period_end > NOW() THEN '⚠️ PAGO FALLIDO - GRACIA ACTIVA'
    ELSE 'OTRO ESTADO'
  END as status
FROM profiles 
WHERE email = 'pablo.felipe.acebedo@gmail.com';
```

## Paso 4: Probar en Frontend
1. Recargar dashboard (debería mostrar banner rojo de pago fallido)
2. Click en "Actualizar Pago"
3. Debería redirigir a Stripe Checkout para actualizar método de pago
4. Después de completar, debería volver al dashboard sin banner

## Paso 5: Restaurar Estado Normal
```sql
-- Script #7: Restaurar a trial normal
UPDATE profiles 
SET 
  subscription_status = 'trial',
  trial_ends_at = NOW() + INTERVAL '15 days',
  grace_period_end = NULL,
  payment_failure_count = 0,
  last_payment_failure = NULL
WHERE email = 'pablo.felipe.acebedo@gmail.com';
```

## 🔧 Configuración de Stripe (Opcional)
Si quieres usar el Portal de Facturación completo:
1. Ve a: https://dashboard.stripe.com/test/settings/billing/portal
2. Configura features básicas
3. Guarda configuración

## 🚨 Troubleshooting
- Error 500: Verificar variables de entorno STRIPE_SECRET_KEY
- Error "No configuration": Usar nuestra implementación alternativa (ya aplicada)
- Banner no aparece: Verificar que subscription_status = 'payment_failed'
