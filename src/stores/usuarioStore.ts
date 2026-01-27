// ============================================
// STORE DE USUARIO - Estado Global
// ============================================

import { create } from 'zustand'
import { Usuario } from '../domain/Usuario'
import { Carrito } from '../domain/Carrito'
import { Comentario } from '../domain/Comentario'
import { Show } from '../domain/Show'
import { usuarioService } from '../services/usuarioService'
import { UsuarioJSON } from '../types'

/**
 * Estado del usuario
 */
interface UsuarioState {
  usuario: Usuario | null
  carrito: Carrito[]
  entradasCompradas: Show[]
  amigos: Usuario[]
  comentarios: Comentario[]
  loading: boolean
  error: string | null
}

/**
 * Acciones del usuario
 */
interface UsuarioActions {
  loadUsuario: (userId: string) => Promise<void>
  loadCarrito: (userId: string) => Promise<void>
  loadEntradasCompradas: (userId: string) => Promise<void>
  loadAmigos: (userId: string) => Promise<void>
  loadComentarios: (userId: string) => Promise<void>
  editarDatos: (userId: string, nombre: string, apellido: string) => Promise<void>
  sumarCredito: (userId: string, credito: number) => Promise<void>
  quitarAmigo: (userId: string, amigoId: number) => Promise<void>
  vaciarCarrito: (userId: string) => Promise<void>
  comprarEntradas: (userId: string) => Promise<void>
  setUsuario: (usuario: Usuario | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clear: () => void
}

/**
 * Store de Usuario
 * RESPONSABILIDAD: Estado global del usuario logueado
 */
export const useUsuarioStore = create<UsuarioState & UsuarioActions>((set, get) => ({
  // Estado inicial
  usuario: null,
  carrito: [],
  entradasCompradas: [],
  amigos: [],
  comentarios: [],
  loading: false,
  error: null,

  // Acciones
  loadUsuario: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const usuarioJSON = await usuarioService.getInfoUsuario(userId)
      const usuario = Usuario.fromJSON(usuarioJSON)
      set({ usuario, loading: false })
    } catch (error) {
      set({ loading: false, error: String(error) })
      throw error
    }
  },

  loadCarrito: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const carrito = await usuarioService.getCarrito(userId)
      set({ carrito, loading: false })
    } catch (error) {
      set({ loading: false, error: String(error) })
      throw error
    }
  },

  loadEntradasCompradas: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const entradas = await usuarioService.getEntradasCompradas(userId)
      set({ entradasCompradas: entradas, loading: false })
    } catch (error) {
      set({ loading: false, error: String(error) })
      throw error
    }
  },

  loadAmigos: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const amigos = await usuarioService.getAmigos(userId)
      set({ amigos, loading: false })
    } catch (error) {
      set({ loading: false, error: String(error) })
      throw error
    }
  },

  loadComentarios: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const comentarios = await usuarioService.getComentarios(userId)
      set({ comentarios, loading: false })
    } catch (error) {
      set({ loading: false, error: String(error) })
      throw error
    }
  },

  editarDatos: async (userId: string, nombre: string, apellido: string) => {
    set({ loading: true, error: null })
    try {
      await usuarioService.editarDatos(userId, { nombre, apellido })
      // Recargar usuario actualizado
      await get().loadUsuario(userId)
    } catch (error) {
      set({ loading: false, error: String(error) })
      throw error
    }
  },

  sumarCredito: async (userId: string, credito: number) => {
    set({ loading: true, error: null })
    try {
      await usuarioService.sumarCredito(userId, credito)
      // Recargar usuario actualizado
      await get().loadUsuario(userId)
    } catch (error) {
      set({ loading: false, error: String(error) })
      throw error
    }
  },

  quitarAmigo: async (userId: string, amigoId: number) => {
    set({ loading: true, error: null })
    try {
      await usuarioService.quitarAmigo(userId, amigoId)
      // Recargar amigos
      await get().loadAmigos(userId)
    } catch (error) {
      set({ loading: false, error: String(error) })
      throw error
    }
  },

  vaciarCarrito: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      await usuarioService.vaciarCarrito(userId)
      set({ carrito: [], loading: false })
    } catch (error) {
      set({ loading: false, error: String(error) })
      throw error
    }
  },

  comprarEntradas: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      await usuarioService.comprarEntradas(userId)
      // Limpiar carrito y recargar datos
      set({ carrito: [] })
      await get().loadUsuario(userId)
      await get().loadEntradasCompradas(userId)
    } catch (error) {
      set({ loading: false, error: String(error) })
      throw error
    }
  },

  setUsuario: (usuario: Usuario | null) => set({ usuario }),

  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: string | null) => set({ error }),

  clear: () =>
    set({
      usuario: null,
      carrito: [],
      entradasCompradas: [],
      amigos: [],
      comentarios: [],
      loading: false,
      error: null,
    }),
}))
