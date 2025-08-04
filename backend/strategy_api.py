from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import json
import os
import signal
import time

app = FastAPI(title="Trading Strategy API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js development server
        "http://127.0.0.1:3000",  # Alternative localhost format
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Diccionario para rastrear procesos activos
active_processes = {}

@app.get("/")
async def root():
    return {"message": "Trading Strategy API is running"}

@app.get("/strategy/start")
async def start_strategy(user_id: str, pairs: str = None):
    if user_id in active_processes:
        # Verificar si el proceso aún está vivo
        process = active_processes[user_id]
        if process.poll() is None:  # Proceso aún corriendo
            return {"error": "Strategy already running for this user", "pid": process.pid}
        else:
            # Proceso murió, limpiarlo
            del active_processes[user_id]
    
    try:
        # Preparar comando con pares seleccionados
        cmd = ['python3', 'main.py']
        
        # Si se especifican pares, agregarlos como argumento
        if pairs:
            # Los pares vienen como string separado por comas: "NVDA/AMD,TESLA/FORD,META/GOOGLE"
            selected_pairs = pairs.split(',')
            cmd.extend(['--pairs'] + selected_pairs)
        
        # Ejecutar tu main.py con los pares seleccionados
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Guardar referencia del proceso
        active_processes[user_id] = process
        
        return {
            "message": f"Strategy started for user {user_id}",
            "pid": process.pid,
            "status": "running",
            "selected_pairs": selected_pairs if pairs else "all_pairs"
        }
        
    except Exception as e:
        return {"error": f"Failed to start strategy: {str(e)}"}

@app.post("/strategy/start")
async def start_strategy_post(user_id: str, request: Request):
    """
    Endpoint POST para recibir configuración completa desde el dashboard
    """
    if user_id in active_processes:
        process = active_processes[user_id]
        if process.poll() is None:
            return {"error": "Strategy already running for this user", "pid": process.pid}
        else:
            del active_processes[user_id]
    
    try:
        # Obtener el payload JSON del request
        config = await request.json()
        print(f"🔧 Configuración recibida desde dashboard: {config}")
        
        cmd = ['python3', 'main.py']
        
        # Procesar configuración del dashboard
        if 'selectedPairs' in config and config['selectedPairs']:
            selected_pairs = config['selectedPairs']
            cmd.extend(['--pairs'] + selected_pairs)
            print(f"📊 Pares seleccionados: {selected_pairs}")
        
        # Procesar crypto assets
        if 'selectedCrypto' in config and config['selectedCrypto']:
            selected_crypto = config['selectedCrypto']
            cmd.extend(['--crypto'] + selected_crypto)
            print(f"🪙 Crypto seleccionados: {selected_crypto}")
            
        # Agregar credenciales IQ Option
        if 'email' in config and config['email']:
            cmd.extend(['--email', config['email']])
            print(f"📧 Email configurado: {config['email'][:3]}***{config['email'][-10:]}")  # Ocultar email parcialmente
            
        if 'password' in config and config['password']:
            cmd.extend(['--password', config['password']])
            print(f"🔒 Contraseña configurada: {'*' * len(config['password'])}")  # Ocultar contraseña completa
            
        if 'accountType' in config:
            cmd.extend(['--account', config['accountType']])
            print(f"🏦 Tipo de cuenta: {config['accountType']}")
            
        # Agregar tamaño de posición (legacy para compatibilidad)
        if 'positionSize' in config:
            cmd.extend(['--position-size', str(config['positionSize'])])
            print(f"💰 Tamaño de posición (legacy): {config['positionSize']}%")
        
        # Agregar tamaños de posición separados
        if 'pairsPositionSize' in config:
            cmd.extend(['--pairs-position-size', str(config['pairsPositionSize'])])
            print(f"📊 Tamaño de posición pares: {config['pairsPositionSize']}%")
        
        if 'cryptoPositionSize' in config:
            cmd.extend(['--crypto-position-size', str(config['cryptoPositionSize'])])
            print(f"🪙 Tamaño de posición crypto: {config['cryptoPositionSize']}%")
        
        # Agregar nivel de agresividad
        if 'aggressiveness' in config:
            cmd.extend(['--aggressiveness', config['aggressiveness']])
            print(f"⚡ Agresividad: {config['aggressiveness']}")
        
        print(f"🚀 Ejecutando comando: {' '.join(cmd)}")
        
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        active_processes[user_id] = process
        
        return {
            "message": f"Strategy started for user {user_id}",
            "pid": process.pid,
            "status": "running",
            "config": config
        }
        
    except Exception as e:
        print(f"❌ Error al iniciar estrategia: {str(e)}")
        return {"error": f"Failed to start strategy: {str(e)}"}

@app.get("/strategy/stop")
async def stop_strategy(user_id: str):
    if user_id not in active_processes:
        return {"error": "No active strategy for this user"}
    
    try:
        process = active_processes[user_id]
        
        # Enviar SIGINT (equivalente a Ctrl+C)
        process.send_signal(signal.SIGINT)
        
        # Esperar un poco a que termine gracefully
        time.sleep(2)
        
        # Si aún está corriendo, forzar terminación
        if process.poll() is None:
            process.terminate()
            time.sleep(1)
            if process.poll() is None:
                process.kill()
        
        # Limpiar referencia
        del active_processes[user_id]
        
        return {
            "message": f"Strategy stopped for user {user_id}",
            "status": "stopped"
        }
        
    except Exception as e:
        return {"error": f"Failed to stop strategy: {str(e)}"}

@app.get("/strategy/status/{user_id}")
async def get_status(user_id: str):
    if user_id not in active_processes:
        return {"status": "stopped", "user_id": user_id}
    
    process = active_processes[user_id]
    
    # Verificar si el proceso aún está vivo
    if process.poll() is None:
        return {
            "status": "running",
            "pid": process.pid,
            "user_id": user_id
        }
    else:
        # Proceso murió, limpiar
        del active_processes[user_id]
        return {"status": "stopped", "user_id": user_id}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "active_processes": len(active_processes),
        "processes": {user_id: {"pid": proc.pid, "running": proc.poll() is None} 
                     for user_id, proc in active_processes.items()}
    }

@app.get("/strategy/reset/{user_id}")
async def reset_strategy(user_id: str):
    """
    Resetea las estadísticas del usuario ejecutando reset_strategy.py
    """
    try:
        # Verificar si hay proceso activo
        if user_id in active_processes:
            process = active_processes[user_id]
            if process.poll() is None:  # Proceso aún corriendo
                return {
                    "error": "Cannot reset while strategy is running. Stop the strategy first.",
                    "message": "Detén el algoritmo antes de hacer reset"
                }
        
        # Verificar que existe el archivo reset_strategy.py
        reset_script = "reset_strategy.py"
        if not os.path.exists(reset_script):
            return {
                "error": f"Reset script not found: {reset_script}",
                "message": "Script de reset no encontrado"
            }
        
        # Ejecutar reset_strategy.py con input automático 's'
        reset_process = subprocess.Popen(
            ['python3', reset_script],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Enviar ambas confirmaciones automáticamente:
        # 1. "¿Estás seguro de que quieres reiniciar la estrategia? (s/N):" -> 's'
        # 2. "¿Deseas también limpiar el archivo de log? (s/N):" -> 's'
        auto_input = 's\ns\n'
        stdout, stderr = reset_process.communicate(input=auto_input, timeout=30)
        
        if reset_process.returncode == 0:
            return {
                "success": True,
                "message": "Estadísticas reseteadas exitosamente",
                "output": stdout.strip() if stdout else "Reset completado",
                "user_id": user_id
            }
        else:
            return {
                "error": "Reset failed",
                "message": f"Error en el proceso de reset: {stderr or 'Error desconocido'}",
                "returncode": reset_process.returncode
            }
            
    except subprocess.TimeoutExpired:
        return {
            "error": "Reset timeout",
            "message": "El proceso de reset tardó demasiado tiempo"
        }
    except Exception as e:
        return {
            "error": f"Reset exception: {str(e)}",
            "message": f"Error inesperado durante el reset: {str(e)}"
        }

@app.get("/strategy/logs/{user_id}")
async def get_logs(user_id: str, limit: int = 50):
    """
    Obtiene los logs más recientes del proceso de trading
    """
    try:
        # Verificar si hay proceso activo
        if user_id not in active_processes:
            # Devolver logs base si no hay proceso activo
            return {
                "logs": [
                    {
                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                        "level": "info",
                        "message": "🚀 Sistema InverseNeural Lab iniciado - Plan Elite activo"
                    },
                    {
                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                        "level": "info", 
                        "message": "⚡ Motores de álgebra lineal inversa listos para análisis cuantitativo"
                    },
                    {
                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                        "level": "success", 
                        "message": "✅ Acceso completo a los 9 pares de activos premium habilitado"
                    }
                ]
            }
        
        process = active_processes[user_id]
        
        # Verificar si el proceso está vivo
        if process.poll() is not None:
            del active_processes[user_id]
            return {
                "logs": [
                    {
                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                        "level": "warning",
                        "message": "⚠️ Proceso de trading terminado inesperadamente"
                    }
                ]
            }
        
        # Leer logs del archivo de log si existe
        log_file = "iqoption_strategy.log"
        logs = []
        
        if os.path.exists(log_file):
            try:
                with open(log_file, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    
                # Tomar las últimas 'limit' líneas
                recent_lines = lines[-limit:] if len(lines) > limit else lines
                
                for line in recent_lines:
                    line = line.strip()
                    if line:
                        # Parsear formato básico de log
                        try:
                            if ' - ' in line:
                                parts = line.split(' - ', 2)
                                if len(parts) >= 3:
                                    timestamp_str = parts[0]
                                    level = parts[1].lower()
                                    message = parts[2]
                                    
                                    # Mapear niveles de log y agregar emojis
                                    if level in ['info', 'debug']:
                                        level = 'info'
                                        if 'error' not in message.lower():
                                            message = f"ℹ️ {message}"
                                    elif level in ['warn', 'warning']:
                                        level = 'warning'
                                        message = f"⚠️ {message}"
                                    elif level in ['err', 'error']:
                                        level = 'error'
                                        message = f"❌ {message}"
                                    elif level in ['success']:
                                        level = 'success'
                                        message = f"✅ {message}"
                                    else:
                                        level = 'info'
                                        message = f"📊 {message}"
                                    
                                    logs.append({
                                        "timestamp": timestamp_str,
                                        "level": level,
                                        "message": message
                                    })
                                else:
                                    # Línea sin formato, tratarla como info
                                    logs.append({
                                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                                        "level": "info",
                                        "message": f"📝 {line}"
                                    })
                            else:
                                # Línea sin formato, tratarla como info
                                logs.append({
                                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                                    "level": "info",
                                    "message": f"📝 {line}"
                                })
                        except Exception as parse_error:
                            # Si hay error parseando, incluir la línea como info
                            logs.append({
                                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                                "level": "info",
                                "message": f"📄 {line}"
                            })
                            
            except Exception as file_error:
                logs.append({
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                    "level": "warning",
                    "message": f"⚠️ Error leyendo archivo de logs: {str(file_error)}"
                })
        else:
            # Archivo de log no existe, devolver logs de estado del proceso
            logs = [
                {
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                    "level": "success",
                    "message": f"🔄 Algoritmo ejecutándose (PID: {process.pid})"
                },
                {
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                    "level": "info",
                    "message": "🧮 Analizando mercados con álgebra lineal inversa..."
                },
                {
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                    "level": "info",
                    "message": "📈 Monitoreando oportunidades en pares premium..."
                }
            ]
        
        return {"logs": logs}
        
    except Exception as e:
        return {
            "logs": [
                {
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                    "level": "error",
                    "message": f"❌ Error obteniendo logs: {str(e)}"
                }
            ]
        }