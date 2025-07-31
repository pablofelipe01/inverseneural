-- Fix RLS: Permitir inserción de perfiles durante registro
-- Fecha: 2025-07-31

-- Eliminar todas las políticas existentes para recrearlas
DROP POLICY IF EXISTS "Users can insert own config" ON user_configs;
DROP POLICY IF EXISTS "Users can view own config" ON user_configs;
DROP POLICY IF EXISTS "Users can update own config" ON user_configs;
DROP POLICY IF EXISTS "Allow profile creation during registration" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Nueva política: Permitir inserción de perfiles durante registro
-- Esto permite crear perfiles cuando auth.uid() es NULL (durante registro)
CREATE POLICY "Allow profile creation during registration" ON profiles 
FOR INSERT 
WITH CHECK (true);

-- Política: Usuarios autenticados pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Política: Usuarios autenticados pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Recrear políticas para user_configs
CREATE POLICY "Users can view own config" ON user_configs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own config" ON user_configs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own config" ON user_configs 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);

-- Verificar políticas activas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('profiles', 'user_configs')
ORDER BY tablename, policyname;
