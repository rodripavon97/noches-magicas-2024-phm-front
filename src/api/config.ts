// ============================================
// CONFIGURACIÓN DE LA API
// ============================================

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 30000,
  withCredentials: true,
} as const

export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  userIdKey: 'userId',
  isAdminKey: 'isAdmin',
} as const
