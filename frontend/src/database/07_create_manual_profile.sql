-- Crear perfil manualmente para usuario existente
-- Ejecutar en Supabase SQL Editor

-- 1. Ver usuarios sin perfil
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.email_confirmed_at,
  p.id as profile_exists
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
ORDER BY u.created_at DESC;

-- 2. Crear perfil para el usuario más reciente (reemplaza el email si es necesario)
INSERT INTO profiles (
  id,
  email,
  full_name,
  subscription_status,
  trial_ends_at,
  plan_type,
  created_at,
  updated_at
)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as full_name,
  'trial' as subscription_status,
  NOW() + INTERVAL '15 days' as trial_ends_at,
  'trial' as plan_type,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users u
WHERE u.email = 'syliconservicioalcliente+debug2@gmail.com'
AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id);

-- 3. Verificar que se creó
SELECT 
  u.email,
  p.full_name,
  p.subscription_status,
  p.trial_ends_at,
  p.max_active_assets
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'syliconservicioalcliente+debug2@gmail.com';
