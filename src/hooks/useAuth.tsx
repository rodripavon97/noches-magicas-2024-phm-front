// ============================================
// HOOK DE AUTENTICACIÓN
// ============================================

import { useAuthStore } from '../stores/authStore'
import { getErrorMessage } from '../errors'

/**
 * Hook para gestionar autenticación
 * RESPONSABILIDAD: Conectar componentes con el store de autenticación
 */
export function useAuth() {
  const {
    isLoggedIn,
    isAdmin,
    userId,
    loading,
    error,
    login: loginStore,
    logout: logoutStore,
    checkAuth,
  } = useAuthStore()

  /**
   * Login de usuario
   */
  const login = async (username: string, password: string): Promise<void> => {
    try {
      await loginStore(username, password)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  /**
   * Logout de usuario
   */
  const logout = (): void => {
    logoutStore()
  }

  return {
    isLoggedIn,
    isAdmin,
    userId,
    loading,
    error,
    login,
    logout,
    checkAuth,
  }
}
