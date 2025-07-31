-- Script para limpiar usuarios de testing
-- Ejecutar en Supabase SQL Editor

-- Ver usuarios actuales (opcional)
SELECT 
  u.id,
  u.email,
  u.created_at,
  p.full_name,
  p.subscription_status,
  p.plan_type
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;

-- Eliminar perfil específico (reemplaza 'test@example.com' con el email que quieres limpiar)
DELETE FROM profiles 
WHERE email = 'test@example.com';

-- Eliminar usuario de auth (reemplaza 'test@example.com' con el email que quieres limpiar)
DELETE FROM auth.users 
WHERE email = 'test@example.com';

-- Verificar que se eliminó
SELECT COUNT(*) as usuarios_restantes FROM auth.users;
SELECT COUNT(*) as perfiles_restantes FROM profiles;
