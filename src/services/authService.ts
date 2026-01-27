// ============================================
// SERVICIO DE AUTENTICACIÓN - Capa de Negocio
// ============================================

import { AUTH_CONFIG } from '../api/config'

/**
 * Servicio de Autenticación
 * RESPONSABILIDAD: Gestión de tokens y estado de autenticación
 */
class AuthService {
  // ============================================
  // GESTIÓN DE TOKENS
  // ============================================

  setAuthToken(token: string): void {
    localStorage.setItem(AUTH_CONFIG.tokenKey, token)
  }

  getAuthToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.tokenKey)
  }

  removeAuthToken(): void {
    localStorage.removeItem(AUTH_CONFIG.tokenKey)
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(AUTH_CONFIG.refreshTokenKey, token)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.refreshTokenKey)
  }

  removeRefreshToken(): void {
    localStorage.removeItem(AUTH_CONFIG.refreshTokenKey)
  }

  // ============================================
  // GESTIÓN DE USUARIO
  // ============================================

  setUserId(id: string): void {
    localStorage.setItem(AUTH_CONFIG.userIdKey, id)
  }

  getUserId(): string | null {
    return localStorage.getItem(AUTH_CONFIG.userIdKey)
  }

  removeUserId(): void {
    localStorage.removeItem(AUTH_CONFIG.userIdKey)
  }

  setIsAdmin(isAdmin: boolean): void {
    localStorage.setItem(AUTH_CONFIG.isAdminKey, String(isAdmin))
  }

  getIsAdmin(): boolean {
    return localStorage.getItem(AUTH_CONFIG.isAdminKey) === 'true'
  }

  removeIsAdmin(): void {
    localStorage.removeItem(AUTH_CONFIG.isAdminKey)
  }

  // ============================================
  // ESTADO DE AUTENTICACIÓN
  // ============================================

  isAuthenticated(): boolean {
    return !!this.getAuthToken() && !!this.getUserId()
  }

  // ============================================
  // LIMPIEZA
  // ============================================

  clearAuth(): void {
    this.removeAuthToken()
    this.removeRefreshToken()
    this.removeUserId()
    this.removeIsAdmin()
    localStorage.removeItem('user')
    localStorage.removeItem('userFotoPerfil')
    localStorage.removeItem('nombreApellido')
  }
}

// Exportar instancia única (singleton)
export const authService = new AuthService()
