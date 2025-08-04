// API Configuration for Elestio Backend Communication
export const ELESTIO_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  API_KEY: process.env.API_SECRET_KEY || '',
  TIMEOUT: 10000, // 10 seconds
  
  ENDPOINTS: {
    // Trading Algorithm
    START_ALGORITHM: '/algorithm/start',
    STOP_ALGORITHM: '/algorithm/stop',
    STATUS: '/algorithm/status',
    RESET: '/algorithm/reset',
    
    // Logs
    LOGS: '/algorithm/logs',
    
    // Health Check
    HEALTH: '/health',
    
    // User Management
    USER_STATUS: '/user/status',
    USER_CONFIG: '/user/config',
  },
  
  // Headers for authentication
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ELESTIO_API_CONFIG.API_KEY}`,
    'X-Client-Version': '1.0.0',
  }),
  
  // Full URL builder
  getUrl: (endpoint: string) => `${ELESTIO_API_CONFIG.BASE_URL}${endpoint}`,
}

// API Client for Elestio Backend
export class ElestioAPIClient {
  private baseURL: string
  private apiKey: string
  private timeout: number

  constructor() {
    this.baseURL = ELESTIO_API_CONFIG.BASE_URL
    this.apiKey = ELESTIO_API_CONFIG.API_KEY
    this.timeout = ELESTIO_API_CONFIG.TIMEOUT
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...ELESTIO_API_CONFIG.getHeaders(),
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Algorithm Management
  async startAlgorithm(userId: string, config: Record<string, unknown>) {
    return this.makeRequest(`${ELESTIO_API_CONFIG.ENDPOINTS.START_ALGORITHM}?user_id=${userId}`, {
      method: 'POST',
      body: JSON.stringify(config),
    })
  }

  async stopAlgorithm(userId: string) {
    return this.makeRequest(`${ELESTIO_API_CONFIG.ENDPOINTS.STOP_ALGORITHM}?user_id=${userId}`)
  }

  async getStatus(userId: string) {
    return this.makeRequest(`${ELESTIO_API_CONFIG.ENDPOINTS.STATUS}/${userId}`)
  }

  async resetAlgorithm(userId: string) {
    return this.makeRequest(`${ELESTIO_API_CONFIG.ENDPOINTS.RESET}/${userId}`)
  }

  async getLogs(userId: string, limit: number = 100) {
    return this.makeRequest(`${ELESTIO_API_CONFIG.ENDPOINTS.LOGS}/${userId}?limit=${limit}`)
  }

  async healthCheck() {
    return this.makeRequest(ELESTIO_API_CONFIG.ENDPOINTS.HEALTH)
  }
}

// Export singleton instance
export const elestioAPI = new ElestioAPIClient()

// Environment validation
export const validateElestioConfig = () => {
  const errors: string[] = []
  
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    errors.push('NEXT_PUBLIC_API_BASE_URL is required')
  }
  
  if (!process.env.API_SECRET_KEY) {
    errors.push('API_SECRET_KEY is required')
  }
  
  if (errors.length > 0) {
    console.error('Elestio API Configuration Errors:', errors)
    return false
  }
  
  return true
}
