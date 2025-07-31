-- Verificar políticas actuales y diagnosticar RLS
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar políticas activas para profiles
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- 2. Verificar que RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'profiles';

-- 3. Probar inserción directa (esto debería funcionar si las políticas están bien)
-- CUIDADO: Solo para testing, usar UUID válido
INSERT INTO profiles (
  id,
  email,
  full_name,
  subscription_status,
  trial_ends_at,
  plan_type
) VALUES (
  gen_random_uuid(),
  'test@example.com',
  'Test User',
  'trial',
  NOW() + INTERVAL '15 days',
  'trial'
);

-- 4. Si el insert anterior falla, verificar permisos en auth.users
SELECT 
  id,
  email,
  created_at
FROM auth.users 
LIMIT 3;
