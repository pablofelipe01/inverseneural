# Diagnóstico completo del problema de Auth

## 1. Verificar configuración en Supabase Dashboard

### A. Authentication > URL Configuration
- **Site URL**: debe ser `http://localhost:3000` (desarrollo)
- **Redirect URLs**: debe incluir `http://localhost:3000/api/auth/callback`

### B. Authentication > Email Templates > Confirm signup
El template debe contener algo como:
```html
<a href="{{ .SiteURL }}/api/auth/callback?token_hash={{ .TokenHash }}&type=signup">Confirm email</a>
```

## 2. Verificar variables de entorno

Revisar que están configuradas:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (si se usa)

## 3. Probar manualmente

### A. Registrar usuario y ver el link del email
1. Registrar con email nuevo
2. Copiar el link COMPLETO del email
3. Verificar que apunta a `/api/auth/callback`

### B. Probar callback directamente
Visitar: `http://localhost:3000/api/auth/callback`
Debe responder con error de "No authorization code" (esto es normal)

## 4. Revisar logs

Activar debug completo en Supabase client
