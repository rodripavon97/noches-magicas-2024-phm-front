// ============================================
// STORE DE SHOWS - Estado Global
// ============================================

import { create } from 'zustand'
import { Show } from '../domain/Show'
import { ShowDetalle } from '../domain/detalleShow'
import { showService, GetShowsParams, GetShowsAdminParams } from '../services/showService'

/**
 * Estado de shows
 */
interface ShowState {
  shows: Show[]
  showSeleccionado: ShowDetalle | null
  loading: boolean
  error: string | null
  filtros: {
    artista: string
    location: string
    conAmigos: boolean
  }
}

/**
 * Acciones de shows
 */
interface ShowActions {
  loadShows: (params: GetShowsParams) => Promise<void>
  loadShowsAdmin: (params: GetShowsAdminParams) => Promise<void>
  loadShowPorID: (id: string) => Promise<void>
  setFiltros: (filtros: Partial<ShowState['filtros']>) => void
  clearShowSeleccionado: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

/**
 * Store de Shows
 * RESPONSABILIDAD: Estado global de shows y búsqueda
 */
export const useShowStore = create<ShowState & ShowActions>((set, get) => ({
  // Estado inicial
  shows: [],
  showSeleccionado: null,
  loading: false,
  error: null,
  filtros: {
    artista: '',
    location: '',
    conAmigos: false,
  },

  // Acciones
  loadShows: async (params: GetShowsParams) => {
    set({ loading: true, error: null })
    try {
      const shows = await showService.getShows(params)
      set({ shows, loading: false })
    } catch (error) {
      set({ loading: false, error: String(error) })
      throw error
    }
  },

  loadShowsAdmin: async (params: GetShowsAdminParams) => {
    set({ loading: true, error: null })
    try {
      const shows = await showService.getShowsAdmin(params)
      set({ shows, loading: false })
    } catch (error) {
      set({ loading: false, error: String(error) })
      throw error
    }
  },

  loadShowPorID: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const show = await showService.getShowPorID(id)
      set({ showSeleccionado: show, loading: false })
    } catch (error) {
      set({ loading: false, error: String(error) })
      throw error
    }
  },

  setFiltros: (filtros: Partial<ShowState['filtros']>) => {
    set((state) => ({
      filtros: { ...state.filtros, ...filtros },
    }))
  },

  clearShowSeleccionado: () => set({ showSeleccionado: null }),

  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: string | null) => set({ error }),
}))
