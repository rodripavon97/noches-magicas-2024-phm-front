// ============================================
// STORE DE AUTENTICACIÓN - Estado Global
// ============================================

import { create } from 'zustand'
import { authService } from '../services/authService'
import { usuarioService } from '../services/usuarioService'

/**
 * Estado de autenticación
 */
interface AuthState {
  isLoggedIn: boolean
  isAdmin: boolean
  userId: string | null
  loading: boolean
  error: string | null
}

/**
 * Acciones de autenticación
 */
interface AuthActions {
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

/**
 * Store de Autenticación
 * RESPONSABILIDAD: Estado global de autenticación
 */
export const useAuthStore = create<AuthState & AuthActions>((set) => {
  // Inicializar estado desde localStorage
  const userId = authService.getUserId()
  const isAdmin = authService.getIsAdmin()
  const isLoggedIn = authService.isAuthenticated()

  return {
    // Estado inicial
    isLoggedIn,
    isAdmin,
    userId,
    loading: false,
    error: null,

    // Acciones
    login: async (username: string, password: string) => {
      set({ loading: true, error: null })
      try {
        const response = await usuarioService.login(username, password)

        // Guardar datos de autenticación
        if (response.token) {
          authService.setAuthToken(response.token)
        }
        if (response.id) {
          authService.setUserId(String(response.id))
        }
        if (response.esAdm !== undefined) {
          authService.setIsAdmin(response.esAdm)
        }

        set({
          isLoggedIn: true,
          isAdmin: response.esAdm || false,
          userId: String(response.id),
          loading: false,
        })
      } catch (error) {
        set({ loading: false, error: String(error) })
        throw error
      }
    },

    logout: () => {
      authService.clearAuth()
      set({
        isLoggedIn: false,
        isAdmin: false,
        userId: null,
        error: null,
      })
    },

    checkAuth: () => {
      const userId = authService.getUserId()
      const isAdmin = authService.getIsAdmin()
      const isLoggedIn = authService.isAuthenticated()

      set({ isLoggedIn, isAdmin, userId })
    },

    setLoading: (loading: boolean) => set({ loading }),

    setError: (error: string | null) => set({ error }),
  }
})
