-- Testing: Simular trial expirado
-- Ejecutar en Supabase para testing

-- Ver el trial actual
SELECT 
  email,
  subscription_status,
  trial_ends_at,
  trial_ends_at < NOW() as trial_expired
FROM profiles 
WHERE email = 'syliconservicioalcliente+debug2@gmail.com';

-- Simular trial expirado (cambiar fecha para testing)
UPDATE profiles 
SET trial_ends_at = NOW() - INTERVAL '1 day'
WHERE email = 'syliconservicioalcliente+debug2@gmail.com';

-- Para volver a normal después del testing:
-- UPDATE profiles 
-- SET trial_ends_at = NOW() + INTERVAL '15 days'
-- WHERE email = 'syliconservicioalcliente+debug2@gmail.com';
