#!/usr/bin/env python3
# patch_strategy.py
# Script para aplicar automáticamente los cambios necesarios a strategy.py

import os
import shutil
from datetime import datetime

def patch_strategy_file():
    """Aplicar parches al archivo strategy.py"""
    
    # Verificar que existe el archivo
    if not os.path.exists('strategy.py'):
        print("❌ Error: No se encuentra strategy.py en el directorio actual")
        return False
    
    # Hacer backup
    backup_name = f"strategy_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.py"
    shutil.copy2('strategy.py', backup_name)
    print(f"✅ Backup creado: {backup_name}")
    
    # Leer el archivo
    with open('strategy.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Contador de cambios
    changes_made = 0
    
    # CAMBIO 1: Aumentar tiempo de espera en check_active_orders
    old_pattern1 = "if time_since_expiry > 15:"
    new_pattern1 = "if time_since_expiry > 45:  # Aumentado para evitar balance temporal"
    if old_pattern1 in content:
        content = content.replace(old_pattern1, new_pattern1)
        changes_made += 1
        print(f"✅ Cambio 1: Tiempo de espera en check_active_orders aumentado a 45s")
    
    # CAMBIO 2: Aumentar tiempo mínimo en process_expired_order
    old_pattern2 = "if time_since_expiry < 10:"
    new_pattern2 = "if time_since_expiry < 45:  # Esperar más para evitar balance temporal"
    if old_pattern2 in content:
        content = content.replace(old_pattern2, new_pattern2)
        changes_made += 1
        print(f"✅ Cambio 2: Tiempo mínimo en process_expired_order aumentado a 45s")
    
    # CAMBIO 3: Modificar verificación por balance - buscar el método 3
    # Buscar el patrón del MÉTODO 3
    old_pattern3 = "if not result_found and 'balance_before' in order and time_since_expiry > 15:"
    new_pattern3 = "if not result_found and 'balance_before' in order and time_since_expiry > 90:  # Solo después de 90s para evitar balance temporal"
    if old_pattern3 in content:
        content = content.replace(old_pattern3, new_pattern3)
        changes_made += 1
        print(f"✅ Cambio 3: Verificación por balance solo después de 90s")
    
    # Variación del patrón
    old_pattern3b = "if not result_found and 'balance_before' in order:"
    if old_pattern3b in content and "time_since_expiry >" not in content.split(old_pattern3b)[1].split('\n')[0]:
        # Necesitamos ser más cuidadosos aquí
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if old_pattern3b in line and "MÉTODO 3" in '\n'.join(lines[max(0,i-5):i]):
                # Agregar la condición de tiempo
                lines[i] = line.replace(old_pattern3b, 
                    "if not result_found and 'balance_before' in order and time_since_expiry > 90:  # Solo después de 90s")
                changes_made += 1
                print(f"✅ Cambio 3b: Agregada condición de tiempo a verificación por balance")
                break
        content = '\n'.join(lines)
    
    # CAMBIO 4: Agregar log de advertencia en verificación por balance
    if "Verificación por balance" in content and "Solo después de 90s" not in content:
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if "Verificación por balance" in line and "self.logger" in line:
                # Agregar advertencia después de esta línea
                indent = len(line) - len(line.lstrip())
                warning_line = ' ' * indent + 'self.logger.warning(f"⚠️ NOTA: El balance puede mostrar valores temporales incorrectos por ~40 segundos")'
                lines.insert(i + 1, warning_line)
                changes_made += 1
                print(f"✅ Cambio 4: Agregada advertencia sobre balance temporal")
                break
        content = '\n'.join(lines)
    
    # Guardar cambios
    if changes_made > 0:
        with open('strategy.py', 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"\n✅ ÉXITO: Se aplicaron {changes_made} cambios a strategy.py")
        print(f"📁 Backup guardado como: {backup_name}")
        
        # Mostrar resumen de cambios
        print("\n📋 RESUMEN DE CAMBIOS:")
        print("1. Tiempo de verificación aumentado de 15s a 45s")
        print("2. Verificación por balance solo después de 90s")
        print("3. Agregadas advertencias sobre balance temporal")
        
        print("\n⚡ RESULTADO ESPERADO:")
        print("- El bot esperará más tiempo antes de verificar órdenes")
        print("- Evitará el período donde IQ Option muestra balance incorrecto")
        print("- Las ganancias ya no serán detectadas como pérdidas")
        
        return True
    else:
        print("⚠️ No se encontraron los patrones esperados")
        print("   Es posible que el archivo ya haya sido modificado")
        print("   o que la estructura sea diferente a la esperada")
        return False

if __name__ == "__main__":
    print("🔧 PARCHE AUTOMÁTICO PARA STRATEGY.PY")
    print("=====================================")
    print("Este script aplicará los cambios necesarios para")
    print("evitar el problema del balance temporal en IQ Option")
    print()
    
    confirm = input("¿Aplicar parches? (s/n): ")
    if confirm.lower() == 's':
        patch_strategy_file()
    else:
        print("❌ Cancelado")