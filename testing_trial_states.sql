-- =================================================================
-- SCRIPTS PARA TESTING: SIMULACIÓN DE ESTADOS DE TRIAL Y GRACIA
-- =================================================================
-- Usar en Supabase SQL Editor para testing del flujo de suscripciones
-- Usuario de prueba: pablo.felipe.acebedo+staging@gmail.com

-- =================================================================
-- 0. PREPARAR BASE DE DATOS - EJECUTAR PRIMERO
-- =================================================================
-- Agregar columnas necesarias para el sistema de período de gracia
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS grace_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_failure_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_payment_failure TIMESTAMPTZ;

-- Verificar que las columnas se crearon correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('grace_period_end', 'payment_failure_count', 'last_payment_failure')
ORDER BY column_name;

-- -----------------------------------------------------------------
-- 1. VER ESTADO ACTUAL
-- -----------------------------------------------------------------
-- Verificar el estado actual del usuario
SELECT 
  email,
  subscription_status,
  trial_ends_at,
  grace_period_end,
  trial_ends_at < NOW() as trial_expired,
  grace_period_end < NOW() as grace_expired,
  CASE 
    WHEN subscription_status = 'active' THEN '✅ Suscripción Activa'
    WHEN subscription_status = 'trial' AND trial_ends_at > NOW() THEN '🟡 Trial Activo'
    WHEN subscription_status = 'trial' AND trial_ends_at < NOW() AND (grace_period_end IS NULL OR grace_period_end > NOW()) THEN '🟠 Trial Expirado - En Período de Gracia'
    WHEN subscription_status = 'trial' AND grace_period_end < NOW() THEN '🔴 Trial y Gracia Expirados - SIN ACCESO'
    WHEN subscription_status = 'payment_failed' AND (grace_period_end IS NULL OR grace_period_end > NOW()) THEN '⚠️ Pago Fallido - En Período de Gracia'
    WHEN subscription_status = 'payment_failed' AND grace_period_end < NOW() THEN '🔴 Pago Fallido - Gracia Expirada - SIN ACCESO'
    ELSE '❓ Estado Desconocido'
  END as status_description
FROM profiles 
WHERE email = 'pablo.felipe.acebedo+staging@gmail.com';

-- -----------------------------------------------------------------
-- 2. SIMULAR TRIAL EXPIRADO CON GRACIA ACTIVA (Día 1-3)
-- -----------------------------------------------------------------
-- El trial terminó pero aún quedan días de gracia
-- Mostrar banner pero permitir acceso al dashboard
UPDATE profiles 
SET 
  trial_ends_at = NOW() - INTERVAL '1 day',
  grace_period_end = NOW() + INTERVAL '2 days'  -- 2 días más de gracia
WHERE email = 'pablo.felipe.acebedo+staging@gmail.com';

-- -----------------------------------------------------------------
-- 3. SIMULAR ÚLTIMO DÍA DE GRACIA
-- -----------------------------------------------------------------
-- Trial expirado, último día de gracia (urgente)
UPDATE profiles 
SET 
  trial_ends_at = NOW() - INTERVAL '3 days',
  grace_period_end = NOW() + INTERVAL '6 hours'  -- Quedan solo 6 horas
WHERE email = 'pablo.felipe.acebedo+staging@gmail.com';

-- -----------------------------------------------------------------
-- 4. SIMULAR GRACIA EXPIRADA - SIN ACCESO AL DASHBOARD
-- -----------------------------------------------------------------
-- Trial y gracia completamente expirados
-- El middleware debería redirigir a /pricing
UPDATE profiles 
SET 
  trial_ends_at = NOW() - INTERVAL '4 days',
  grace_period_end = NOW() - INTERVAL '1 day'  -- Gracia expirada desde ayer
WHERE email = 'pablo.felipe.acebedo+staging@gmail.com';

-- -----------------------------------------------------------------
-- 5. SIMULAR PAGO FALLIDO CON GRACIA ACTIVA
-- -----------------------------------------------------------------
-- Usuario con suscripción activa pero pago fallido, en período de gracia
UPDATE profiles 
SET 
  subscription_status = 'payment_failed',
  trial_ends_at = NOW() - INTERVAL '30 days',  -- Trial muy antiguo
  grace_period_end = NOW() + INTERVAL '2 days',  -- 2 días de gracia por pago fallido
  payment_failure_count = 1,
  last_payment_failure = NOW() - INTERVAL '1 day'
WHERE email = 'pablo.felipe.acebedo+staging@gmail.com';

-- -----------------------------------------------------------------
-- 6. SIMULAR PAGO FALLIDO SIN GRACIA - SIN ACCESO
-- -----------------------------------------------------------------
-- Pago fallido y gracia expirada, sin acceso al dashboard
UPDATE profiles 
SET 
  subscription_status = 'payment_failed',
  trial_ends_at = NOW() - INTERVAL '30 days',
  grace_period_end = NOW() - INTERVAL '1 day',  -- Gracia expirada
  payment_failure_count = 2,
  last_payment_failure = NOW() - INTERVAL '4 days'
WHERE email = 'pablo.felipe.acebedo+staging@gmail.com';

-- -----------------------------------------------------------------
-- 7. RESTAURAR A TRIAL NORMAL (Para volver al estado inicial)
-- -----------------------------------------------------------------
-- Volver al estado de trial normal con 15 días
UPDATE profiles 
SET 
  subscription_status = 'trial',
  trial_ends_at = NOW() + INTERVAL '15 days',
  grace_period_end = NULL,
  payment_failure_count = 0,
  last_payment_failure = NULL
WHERE email = 'pablo.felipe.acebedo+staging@gmail.com';

-- -----------------------------------------------------------------
-- 8. SIMULAR SUSCRIPCIÓN ACTIVA (Para testing de funcionalidad completa)
-- -----------------------------------------------------------------
-- Usuario con suscripción pagada y activa
UPDATE profiles 
SET 
  subscription_status = 'active',
  plan_type = 'pro',
  trial_ends_at = NOW() - INTERVAL '30 days',  -- Trial muy antiguo
  grace_period_end = NULL,
  payment_failure_count = 0,
  last_payment_failure = NULL
WHERE email = 'pablo.felipe.acebedo+staging@gmail.com';

-- -----------------------------------------------------------------
-- 9. VERIFICACIÓN FINAL
-- -----------------------------------------------------------------
-- Siempre ejecutar después de cualquier cambio para verificar
SELECT 
  email,
  subscription_status,
  plan_type,
  trial_ends_at,
  grace_period_end,
  payment_failure_count,
  last_payment_failure,
  created_at,
  trial_ends_at < NOW() as trial_expired,
  grace_period_end < NOW() as grace_expired,
  CASE 
    WHEN subscription_status = 'active' THEN '✅ ACCESO COMPLETO'
    WHEN subscription_status = 'trial' AND trial_ends_at > NOW() THEN '✅ TRIAL ACTIVO'
    WHEN subscription_status = 'trial' AND trial_ends_at < NOW() AND (grace_period_end IS NULL OR grace_period_end > NOW()) THEN '⚠️ GRACIA ACTIVA - ACCESO CON BANNER'
    WHEN subscription_status = 'trial' AND grace_period_end < NOW() THEN '🚫 SIN ACCESO - REDIRECT A /pricing'
    WHEN subscription_status = 'payment_failed' AND (grace_period_end IS NULL OR grace_period_end > NOW()) THEN '⚠️ PAGO FALLIDO - GRACIA ACTIVA'
    WHEN subscription_status = 'payment_failed' AND grace_period_end < NOW() THEN '🚫 PAGO FALLIDO - SIN ACCESO'
    ELSE '❓ ESTADO DESCONOCIDO'
  END as access_status,
  CASE 
    WHEN grace_period_end > NOW() THEN 
      EXTRACT(epoch FROM (grace_period_end - NOW())) / 3600 || ' horas restantes'
    WHEN grace_period_end < NOW() THEN 
      'Gracia expirada hace ' || EXTRACT(epoch FROM (NOW() - grace_period_end)) / 3600 || ' horas'
    ELSE 'Sin período de gracia'
  END as grace_time_info
FROM profiles 
WHERE email = 'pablo.felipe.acebedo+staging@gmail.com';

-- =================================================================
-- INSTRUCCIONES DE USO:
-- =================================================================
-- 1. Ejecutar script #1 para ver estado actual
-- 2. Ejecutar script #2 para simular trial expirado con gracia (banner amarillo)
-- 3. Ejecutar script #3 para simular último día (banner rojo urgente)
-- 4. Ejecutar script #4 para simular sin acceso (redirect a /pricing)
-- 5. Ejecutar script #7 para volver a normal
-- 6. Siempre verificar con script #9

-- TESTING FLOW RECOMENDADO:
-- Trial Normal → Trial Expirado con Gracia → Último Día → Sin Acceso → Restaurar
