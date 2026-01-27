// ============================================
// HOOK DE SHOWS
// ============================================

import { useEffect } from 'react'
import { useShowStore } from '../stores/showStore'
import { useAuth } from './useAuth'
import { getErrorMessage } from '../errors'

/**
 * Parámetros de búsqueda de shows
 */
export interface UseShowsParams {
  autoLoad?: boolean
  artista?: string
  location?: string
  conAmigos?: boolean
}

/**
 * Hook para gestionar shows
 * RESPONSABILIDAD: Conectar componentes con el store de shows
 */
export function useShows(params: UseShowsParams = {}) {
  const { autoLoad = false, artista = '', location = '', conAmigos = false } = params
  const { userId, isAdmin } = useAuth()
  const {
    shows,
    loading,
    error,
    filtros,
    loadShows,
    loadShowsAdmin,
    setFiltros,
  } = useShowStore()

  /**
   * Cargar shows automáticamente si está habilitado
   */
  useEffect(() => {
    if (autoLoad) {
      buscarShows()
    }
  }, [autoLoad, artista, location, conAmigos])

  /**
   * Buscar shows
   */
  const buscarShows = async (): Promise<void> => {
    try {
      if (isAdmin) {
        await loadShowsAdmin({
          artista: artista || filtros.artista,
          location: location || filtros.location,
          userId: userId || undefined,
        })
      } else {
        await loadShows({
          artista: artista || filtros.artista,
          location: location || filtros.location,
          conAmigos: conAmigos || filtros.conAmigos,
          userId: userId || undefined,
        })
      }
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  /**
   * Actualizar filtros
   */
  const actualizarFiltros = (nuevosFiltros: Partial<typeof filtros>): void => {
    setFiltros(nuevosFiltros)
  }

  return {
    shows,
    loading,
    error,
    filtros,
    buscarShows,
    actualizarFiltros,
  }
}
