// Verificar configuración de Auth en Supabase
// Ir a: Authentication > URL Configuration en el dashboard de Supabase

// Las URLs deben estar configuradas así:
// Site URL: http://localhost:3000 (desarrollo) o tu dominio (producción)
// Redirect URLs: 
// - http://localhost:3000/api/auth/callback
// - tu-dominio.com/api/auth/callback

// Email Templates > Confirm signup:
// Debería tener algo como:
// <a href="{{ .SiteURL }}/api/auth/callback?token_hash={{ .TokenHash }}&type=signup">Confirm email</a>

// Si no está bien configurado, el link del email no llegará al callback correcto
