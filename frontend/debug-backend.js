#!/usr/bin/env node

/**
 * Script de debugging para probar la conectividad con el backend
 * InverseNeural Lab - Trading Dashboard Debug
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

async function testEndpoint(endpoint, description) {
  console.log(`\n🔍 Probando ${description}...`);
  console.log(`   URL: ${API_BASE_URL}${endpoint}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Respuesta: ${JSON.stringify(data, null, 2)}`);
    } else {
      const text = await response.text();
      console.log(`   ❌ Error: ${text}`);
    }
  } catch (error) {
    console.log(`   🚨 Exception: ${error.message}`);
  }
}

async function runDebugTests() {
  console.log('🚀 InverseNeural Lab - Debug de Conectividad Backend');
  console.log('=' + '='.repeat(50));
  
  await testEndpoint('/health', 'Health Check');
  await testEndpoint('/strategy/status/user123', 'Status del Algoritmo');
  await testEndpoint('/strategy/start?user_id=user123', 'Start Algoritmo');
  await testEndpoint('/strategy/stop?user_id=user123', 'Stop Algoritmo');
  
  console.log('\n✨ Tests completados');
  console.log('\n💡 Si ves errores CORS, el backend necesita configurar headers CORS');
  console.log('💡 Si ves "Failed to fetch", verifica que el backend esté corriendo en el puerto 8000');
}

// Solo ejecutar si este archivo se llama directamente
if (typeof window === 'undefined') {
  runDebugTests().catch(console.error);
}

module.exports = { testEndpoint, runDebugTests };
