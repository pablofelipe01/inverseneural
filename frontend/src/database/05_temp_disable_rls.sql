-- Solución temporal: Deshabilitar RLS para profiles durante testing
-- CUIDADO: Solo para desarrollo, NO para producción

-- Deshabilitar RLS temporalmente
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Para volver a habilitarlo después:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
