# ✅ TEST COMPLETO - FLUJO DE ESTADOS DE SUSCRIPCIÓN

## 🎯 CHECKLIST DE TESTING

### Paso 1: Estado Inicial ✓
- [ ] Ejecutar Script #1 (Ver estado actual)
- [ ] Verificar que usuario está en trial normal
- [ ] Dashboard accesible sin banners

### Paso 2: Trial Expirado con Gracia ⚠️
- [ ] Ejecutar Script #2 (Trial expirado + 2 días gracia)
- [ ] Verificar Script #9 (debería mostrar "GRACIA ACTIVA")
- [ ] Recargar dashboard
- [ ] **VALIDAR**: Banner amarillo/naranja visible
- [ ] **VALIDAR**: Acceso al dashboard permitido
- [ ] **VALIDAR**: Mensaje "Te quedan X días para suscribirte"

### Paso 3: Último Día de Gracia 🔴
- [ ] Ejecutar Script #3 (Solo 6 horas restantes)
- [ ] Verificar Script #9
- [ ] Recargar dashboard
- [ ] **VALIDAR**: Banner rojo urgente
- [ ] **VALIDAR**: Mensaje "Quedan solo X horas"
- [ ] **VALIDAR**: Botón "Ver Planes"

### Paso 4: Sin Acceso - Redirect 🚫
- [ ] Ejecutar Script #4 (Gracia completamente expirada)
- [ ] Verificar Script #9 (debería mostrar "SIN ACCESO")
- [ ] **CRÍTICO**: Intentar acceder a /dashboard
- [ ] **VALIDAR**: Middleware redirige automáticamente a /pricing
- [ ] **VALIDAR**: No se puede acceder al dashboard

### Paso 5: Pago Fallido con Gracia ⚠️
- [ ] Ejecutar Script #5 (payment_failed + gracia activa)
- [ ] Verificar Script #9
- [ ] Recargar dashboard
- [ ] **VALIDAR**: Banner rojo "Problema con método de pago"
- [ ] **VALIDAR**: Botón "Actualizar Pago"
- [ ] **VALIDAR**: Click abre Stripe Checkout
- [ ] **VALIDAR**: Después de completar, banner desaparece

### Paso 6: Pago Fallido sin Gracia 🚫
- [ ] Ejecutar Script #6 (payment_failed + gracia expirada)
- [ ] **VALIDAR**: Middleware bloquea acceso a dashboard
- [ ] **VALIDAR**: Redirect a página de pago

### Paso 7: Restaurar Estado Normal ✅
- [ ] Ejecutar Script #7 (Trial normal 15 días)
- [ ] Verificar Script #9
- [ ] **VALIDAR**: Dashboard normal sin banners
- [ ] **VALIDAR**: Acceso completo restaurado

## 🔍 PUNTOS CRÍTICOS A VALIDAR

### A. Middleware (Más Importante)
- [ ] Bloquea acceso cuando grace_period_end < NOW()
- [ ] Permite acceso cuando grace_period_end > NOW()
- [ ] Redirige correctamente a /pricing vs /payment-recovery

### B. Banner Display
- [ ] Se muestra solo cuando corresponde
- [ ] Mensajes correctos según estado
- [ ] Botones apropiados (Ver Planes vs Actualizar Pago)
- [ ] Cálculo correcto de tiempo restante

### C. Integración Stripe
- [ ] Botón "Actualizar Pago" funciona
- [ ] Stripe Checkout se abre correctamente
- [ ] Webhook actualiza estado después del pago
- [ ] Grace period se limpia automáticamente

### D. Estados Edge Case
- [ ] Usuario sin grace_period_end (NULL)
- [ ] Usuario con trial muy antiguo
- [ ] Usuario con múltiples fallos de pago

## 🚨 TROUBLESHOOTING

### Si el banner no aparece:
1. Verificar console.log debug en dashboard
2. Verificar que subscription_status es correcto
3. Verificar que trial_ends_at < NOW()

### Si middleware no bloquea:
1. Verificar que grace_period_end < NOW()
2. Check console logs en middleware
3. Verificar que profile se obtiene correctamente

### Si Stripe falla:
1. Verificar STRIPE_SECRET_KEY en .env
2. Check logs de API en /api/stripe/update-payment
3. Verificar que stripe_customer_id existe

## 📊 RESULTADOS ESPERADOS

| Estado | Banner | Acceso Dashboard | Redirect |
|--------|--------|------------------|----------|
| Trial Normal | ❌ No | ✅ Sí | - |
| Trial + Gracia | ⚠️ Amarillo | ✅ Sí | - |
| Último Día | 🔴 Rojo | ✅ Sí | - |
| Sin Gracia | ❌ No | ❌ No | → /pricing |
| Pago Fallido + Gracia | 🔴 Rojo | ✅ Sí | - |
| Pago Fallido Sin Gracia | ❌ No | ❌ No | → /payment-recovery |

¡Vamos con el testing! 🚀
