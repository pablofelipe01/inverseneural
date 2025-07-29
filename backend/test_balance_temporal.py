# test_balance_temporal_cop.py
# Script para detectar el problema del balance temporal en cuenta REAL (COP)

import time
import json
from datetime import datetime
from iqoptionapi.stable_api import IQ_Option
from config import IQ_EMAIL, IQ_PASSWORD

# COLORES para mejor visualización
class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def test_balance_temporal_issue():
    """
    Test específico para detectar el problema del balance temporal
    """
    print(f"\n{Colors.RED}{Colors.BOLD}{'='*80}{Colors.RESET}")
    print(f"{Colors.RED}{Colors.BOLD}⚠️  ADVERTENCIA: TEST EN CUENTA REAL{Colors.RESET}")
    print(f"{Colors.RED}{Colors.BOLD}{'='*80}{Colors.RESET}")
    print(f"""
Este test:
1. Colocará una orden REAL de $4,000 COP
2. Monitoreará el balance cada 0.5 segundos por 5 minutos
3. Detectará si hay un "balance temporal incorrecto"

{Colors.YELLOW}IMPORTANTE: Solo ejecutar si estás dispuesto a arriesgar $4,000 COP{Colors.RESET}

Presiona ENTER para continuar o Ctrl+C para cancelar...
""")
    input()
    
    # Conectar
    print(f"{Colors.CYAN}🔗 Conectando a IQ Option...{Colors.RESET}")
    iq = IQ_Option(IQ_EMAIL, IQ_PASSWORD)
    check, reason = iq.connect()
    
    if not check:
        print(f"{Colors.RED}❌ Error: {reason}{Colors.RESET}")
        return
    
    print(f"{Colors.GREEN}✅ Conectado exitosamente{Colors.RESET}")
    
    # Cambiar a cuenta REAL
    iq.change_balance("REAL")
    balance_initial = iq.get_balance()
    print(f"{Colors.GREEN}💰 Balance inicial REAL: ${balance_initial:,.2f} COP{Colors.RESET}")
    
    # Confirmar una vez más
    print(f"\n{Colors.YELLOW}Última confirmación: Se colocará una orden de $4,000 COP en cuenta REAL")
    print(f"Escribe 'CONFIRMO' para continuar: {Colors.RESET}", end="")
    if input() != "CONFIRMO":
        print(f"{Colors.RED}❌ Cancelado{Colors.RESET}")
        return
    
    # Colocar orden
    asset = "EURUSD-OTC"
    direction = "CALL"
    amount = 4000  # 4000 pesos colombianos
    expiry = 1  # 1 minuto
    
    print(f"\n{Colors.CYAN}📈 Colocando {direction} en {asset} por ${amount:,.0f} COP{Colors.RESET}")
    order_time = datetime.now()
    status, order_id = iq.buy(amount, asset, direction.lower(), expiry)
    
    if not status:
        print(f"{Colors.RED}❌ Error colocando orden: {order_id}{Colors.RESET}")
        return
    
    print(f"{Colors.GREEN}✅ Orden colocada exitosamente")
    print(f"   ID: {order_id}")
    print(f"   Hora: {order_time.strftime('%H:%M:%S')}{Colors.RESET}")
    
    # MONITOREO DETALLADO
    print(f"\n{Colors.BOLD}📊 MONITOREO DETALLADO DEL BALANCE{Colors.RESET}")
    print("Seg  | Balance           | Cambio         | Estado    | Notas")
    print("-"*75)
    
    start_time = time.time()
    balance_history = []
    all_balances = []
    anomalies = []
    lowest_balance = balance_initial
    highest_balance = balance_initial
    
    # Monitorear por 5 minutos (300 segundos)
    for i in range(600):  # 600 * 0.5s = 300s
        elapsed = time.time() - start_time
        current_balance = iq.get_balance()
        change = current_balance - balance_initial
        
        # Registrar todos los balances
        all_balances.append({
            'time': elapsed,
            'balance': current_balance,
            'change': change
        })
        
        # Actualizar mínimos y máximos
        if current_balance < lowest_balance:
            lowest_balance = current_balance
        if current_balance > highest_balance:
            highest_balance = current_balance
        
        # Detectar cambios significativos
        if len(balance_history) == 0 or current_balance != balance_history[-1]['balance']:
            balance_history.append({
                'time': elapsed,
                'balance': current_balance,
                'change': change
            })
            
            # Determinar estado
            if change > 0:
                estado = f"{Colors.GREEN}WIN{Colors.RESET}"
                color = Colors.GREEN
            elif change < 0:
                estado = f"{Colors.RED}LOSS{Colors.RESET}"
                color = Colors.RED
                # Detectar anomalía: pérdida mayor al monto apostado
                if abs(change) > amount * 1.1:
                    anomalies.append({
                        'time': elapsed,
                        'type': 'EXCESSIVE_LOSS',
                        'balance': current_balance,
                        'change': change
                    })
            else:
                estado = f"{Colors.YELLOW}EQUAL{Colors.RESET}"
                color = Colors.YELLOW
            
            # Notas especiales
            notas = ""
            if int(elapsed) == 60:
                notas = "← EXPIRACIÓN"
            elif int(elapsed) == 15:
                notas = "← Verificación temprana del bot"
            elif int(elapsed) == 30:
                notas = "← Nueva verificación propuesta"
            
            # Imprimir cambio
            print(f"{int(elapsed):4d} | ${current_balance:17,.2f} | {color}${change:14,.2f}{Colors.RESET} | {estado:9s} | {notas}")
        
        # Cada 30 segundos, resumen
        elif int(elapsed) % 30 == 0 and elapsed > 0:
            print(f"{int(elapsed):4d} | ${current_balance:17,.2f} | ${change:14,.2f} | {'---':9s} | ...")
        
        time.sleep(0.5)
    
    # ANÁLISIS FINAL
    print(f"\n{Colors.BOLD}{'='*75}")
    print(f"📊 ANÁLISIS COMPLETO")
    print(f"{'='*75}{Colors.RESET}")
    
    final_balance = iq.get_balance()
    total_change = final_balance - balance_initial
    
    print(f"\n💰 Balance inicial: ${balance_initial:,.2f} COP")
    print(f"💰 Balance final: ${final_balance:,.2f} COP")
    print(f"{'📈' if total_change >= 0 else '📉'} Cambio total: ", end="")
    if total_change > 0:
        print(f"{Colors.GREEN}${total_change:+,.2f} COP (GANANCIA){Colors.RESET}")
    elif total_change < 0:
        print(f"{Colors.RED}${total_change:+,.2f} COP (PÉRDIDA){Colors.RESET}")
    else:
        print(f"{Colors.YELLOW}${total_change:+,.2f} COP (EMPATE){Colors.RESET}")
    
    # Análisis de anomalías
    if anomalies:
        print(f"\n{Colors.RED}{Colors.BOLD}⚠️ ANOMALÍAS DETECTADAS:{Colors.RESET}")
        for anomaly in anomalies:
            print(f"   - A los {int(anomaly['time'])}s: Balance mostró ${anomaly['change']:+,.2f} COP")
            print(f"     Esto es {abs(anomaly['change'])/amount:.0f}x el monto apostado!")
    
    # Buscar el patrón del problema
    print(f"\n{Colors.BOLD}🔍 ANÁLISIS DEL PROBLEMA:{Colors.RESET}")
    
    # Buscar si hubo un balance temporal bajo
    temp_loss_detected = False
    for entry in balance_history:
        if entry['change'] < -amount * 0.9 and entry['time'] < 120:  # Pérdida antes de 2 min
            # Verificar si luego se recuperó
            later_entries = [e for e in balance_history if e['time'] > entry['time']]
            if later_entries and any(e['change'] > 0 for e in later_entries):
                temp_loss_detected = True
                print(f"\n{Colors.RED}⚠️ PROBLEMA DETECTADO:{Colors.RESET}")
                print(f"   - A los {int(entry['time'])}s el balance mostró pérdida: ${entry['change']:,.2f} COP")
                print(f"   - Pero el resultado final fue: ${total_change:+,.2f} COP")
                print(f"   - {Colors.BOLD}El bot habría detectado incorrectamente una pérdida!{Colors.RESET}")
                break
    
    if not temp_loss_detected and total_change > 0:
        print(f"\n{Colors.YELLOW}⚠️ POSIBLE PROBLEMA:{Colors.RESET}")
        print(f"   - El resultado final fue ganancia (${total_change:+,.2f} COP)")
        print(f"   - Pero no se detectó un balance temporal negativo")
        print(f"   - Es posible que el problema ocurra en otros momentos")
    
    # Estadísticas
    print(f"\n{Colors.BOLD}📊 ESTADÍSTICAS:{Colors.RESET}")
    print(f"   - Balance más bajo: ${lowest_balance:,.2f} COP (${lowest_balance - balance_initial:+,.2f})")
    print(f"   - Balance más alto: ${highest_balance:,.2f} COP (${highest_balance - balance_initial:+,.2f})")
    print(f"   - Número de cambios detectados: {len(balance_history)}")
    
    # Guardar datos para análisis posterior
    filename = f"balance_test_{order_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    data = {
        'order_id': order_id,
        'initial_balance': balance_initial,
        'final_balance': final_balance,
        'total_change': total_change,
        'balance_history': balance_history,
        'anomalies': anomalies,
        'lowest_balance': lowest_balance,
        'highest_balance': highest_balance,
        'temp_loss_detected': temp_loss_detected,
        'currency': 'COP',
        'amount': amount
    }
    
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"\n💾 Datos guardados en: {filename}")
    
    # Recomendaciones
    print(f"\n{Colors.BOLD}💡 RECOMENDACIONES:{Colors.RESET}")
    if temp_loss_detected:
        print(f"   1. {Colors.BOLD}Aumentar el tiempo de espera antes de verificar{Colors.RESET}")
        print(f"      - Actual: 15 segundos")
        print(f"      - Recomendado: 30-45 segundos")
        print(f"   2. {Colors.BOLD}Ignorar verificaciones por balance{Colors.RESET}")
        print(f"      - Usar solo API methods (order_binary, get_async_order)")
        print(f"   3. {Colors.BOLD}Implementar verificación múltiple{Colors.RESET}")
        print(f"      - Si detecta pérdida por balance, re-verificar después de 30s")
    
    print(f"\n✅ Test completado")


if __name__ == "__main__":
    test_balance_temporal_issue()