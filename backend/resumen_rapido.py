#!/usr/bin/env python3
"""
Script de Resumen Rápido para monitoreo durante el día
"""

import json
import os
from datetime import datetime
from collections import defaultdict

def quick_summary():
    """Generar un resumen rápido del estado actual"""
    
    print("\n" + "="*60)
    print(f"📊 RESUMEN RÁPIDO - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)
    
    # 1. Leer estado actual
    if os.path.exists('strategy_state.json'):
        with open('strategy_state.json', 'r') as f:
            state = json.load(f)
        
        print("\n💰 ESTADO FINANCIERO:")
        print(f"  Profit del día: ${state.get('daily_profit', 0):.2f}")
        print(f"  Profit total: ${state.get('total_profit', 0):.2f}")
        
        # Operaciones
        wins = sum(state.get('wins', {}).values())
        losses = sum(state.get('losses', {}).values())
        ties = sum(state.get('ties', {}).values())
        total = wins + losses + ties
        
        if total > 0:
            print(f"\n📊 OPERACIONES:")
            print(f"  Total: {total}")
            print(f"  Victorias: {wins} ({wins/total*100:.1f}%)")
            print(f"  Derrotas: {losses} ({losses/total*100:.1f}%)")
            print(f"  Empates: {ties} ({ties/total*100:.1f}%)")
            
            if wins + losses > 0:
                win_rate = (wins / (wins + losses)) * 100
                print(f"  Tasa de éxito (sin empates): {win_rate:.1f}%")
        
        # RSI actual de cada activo
        if 'rsi_history' in state:
            print("\n📈 ALGEBRA INVERSA ACTUAL (última lectura):")
            
            # Agrupar por tipo
            by_group = defaultdict(list)
            for asset, history in state['rsi_history'].items():
                if history:
                    last_rsi = history[-1]
                    group = get_asset_group_simple(asset)
                    by_group[group].append((asset, last_rsi))
            
            # Mostrar por grupo
            for group in ["FOREX", "CRYPTO", "COMMODITY", "PAIR", "INDEX", "STOCK"]:
                if group in by_group:
                    print(f"\n  {group}:")
                    for asset, rsi in sorted(by_group[group]):
                        # Determinar estado
                        levels = get_levels_for_group(group)
                        if rsi <= levels[0]:
                            status = "🔴 SOBREVENTA"
                        elif rsi >= levels[1]:
                            status = "🟢 SOBRECOMPRA"
                        else:
                            status = "⚪ NEUTRAL"
                        
                        print(f"    {asset}: {rsi:.1f} {status}")
    
    # 2. Últimas señales del log
    print("\n🔔 ÚLTIMAS ACTIVIDADES (últimos 20 min):")
    
    if os.path.exists('iqoption_strategy.log'):
        from datetime import datetime, timedelta
        cutoff_time = datetime.now() - timedelta(minutes=20)
        
        signals = []
        stale_signals = []
        
        with open('iqoption_strategy.log', 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    # Extraer timestamp
                    time_str = line[:19]
                    line_time = datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S")
                    
                    if line_time < cutoff_time:
                        continue
                    
                    # Buscar eventos importantes
                    if "Momentum" in line and "confirmado" in line:
                        signals.append(f"  {time_str} - {line.strip()}")
                    elif "sin cruce fresco" in line:
                        asset = line.split()[3]
                        if asset not in stale_signals:
                            stale_signals.append(asset)
                except:
                    continue
        
        if signals:
            print("\n  ✅ Señales válidas:")
            for signal in signals[-5:]:  # Últimas 5
                print(f"    {signal}")
        
        if stale_signals:
            print(f"\n  ⏭️ Activos en zona extrema sin cruce: {', '.join(stale_signals[-10:])}")
        
        if not signals and not stale_signals:
            print("  Sin actividad relevante")
    
    print("\n" + "="*60)

def get_asset_group_simple(asset):
    """Determinar grupo de activo (versión simple)"""
    if any(x in asset for x in ["EUR", "GBP", "USD", "JPY", "AUD"]) and "/" not in asset:
        return "FOREX"
    elif any(x in asset for x in ["BTC", "ETH", "LTC", "XRP", "DOT", "ATOM", "MATIC", "INJ", "NEAR", "SUI", "ARB"]):
        return "CRYPTO"
    elif any(x in asset for x in ["XAU", "XAG"]) and "/" not in asset:
        return "COMMODITY"
    elif "/" in asset:
        return "PAIR"
    elif any(x in asset for x in ["GER30", "UK100", "JP225"]):
        return "INDEX"
    elif any(x in asset for x in ["MSFT", "AAPL"]):
        return "STOCK"
    return "OTHER"

def get_levels_for_group(group):
    """Obtener niveles RSI por grupo"""
    levels = {
        "FOREX": (35, 65),
        "CRYPTO": (30, 70),
        "COMMODITY": (33, 67),
        "PAIR": (32, 68),
        "INDEX": (35, 65),
        "STOCK": (30, 70),
        "OTHER": (35, 65)
    }
    return levels.get(group, (35, 65))

if __name__ == "__main__":
    quick_summary()