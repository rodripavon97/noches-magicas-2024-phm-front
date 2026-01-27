// ============================================
// CLIENTE HTTP CON JWT + XSRF
// ============================================

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_CONFIG, AUTH_CONFIG } from './config'
import { createApiError } from '../errors'

/**
 * Cliente HTTP configurado con interceptores para JWT y XSRF
 */
class HttpClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      withCredentials: API_CONFIG.withCredentials,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  /**
   * Configura los interceptores de request y response
   */
  private setupInterceptors(): void {
    // Request interceptor - Añade JWT y XSRF token
    this.client.interceptors.request.use(
      (config) => {
        // Añadir JWT token si existe
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Añadir XSRF token si existe
        const xsrfToken = this.getXsrfToken()
        if (xsrfToken) {
          config.headers['X-XSRF-TOKEN'] = xsrfToken
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor - Manejo de errores y refresh token
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // Si es 401 y no hemos intentado refresh todavía
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const newToken = await this.refreshToken()
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            // Si el refresh falla, limpiar tokens y redirigir al login
            this.clearTokens()
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  /**
   * Obtiene el token JWT del localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.tokenKey)
  }

  /**
   * Obtiene el token XSRF de las cookies
   */
  private getXsrfToken(): string | null {
    const cookies = document.cookie.split(';')
    const xsrfCookie = cookies.find((c) => c.trim().startsWith('XSRF-TOKEN='))
    return xsrfCookie ? xsrfCookie.split('=')[1] : null
  }

  /**
   * Refresca el token JWT usando el refresh token
   */
  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem(AUTH_CONFIG.refreshTokenKey)
      if (!refreshToken) {
        throw createApiError('No refresh token available', 401)
      }

      const response = await axios.post(
        `${API_CONFIG.baseURL}/auth/refresh`,
        { refreshToken },
        { withCredentials: true }
      )

      const newToken = response.data.token
      if (newToken) {
        localStorage.setItem(AUTH_CONFIG.tokenKey, newToken)
        return newToken
      }

      return null
    } catch (error) {
      throw createApiError('Failed to refresh token', 401)
    }
  }

  /**
   * Limpia todos los tokens del storage
   */
  private clearTokens(): void {
    localStorage.removeItem(AUTH_CONFIG.tokenKey)
    localStorage.removeItem(AUTH_CONFIG.refreshTokenKey)
    localStorage.removeItem(AUTH_CONFIG.userIdKey)
    localStorage.removeItem(AUTH_CONFIG.isAdminKey)
  }

  /**
   * Método público para realizar requests HTTP tipados
   * OBLIGATORIO: Todo request debe pasar por esta función
   */
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Métodos de conveniencia
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }
}

// Instancia única (singleton)
export const httpClient = new HttpClient()

/**
 * Función helper para requests HTTP
 * OBLIGATORIO: Usar esta función en lugar de axios directo
 */
export async function httpRequest<T>(config: AxiosRequestConfig): Promise<T> {
  return httpClient.request<T>(config)
}
