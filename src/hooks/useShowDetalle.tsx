// ============================================
// HOOK DE DETALLE DE SHOW
// ============================================

import { useEffect } from 'react'
import { useShowStore } from '../stores/showStore'
import { usuarioService } from '../services/usuarioService'
import { showService } from '../services/showService'
import { useAuth } from './useAuth'
import { getErrorMessage } from '../errors'
import { Ubicacion } from '../types'

/**
 * Hook para gestionar el detalle de un show
 * RESPONSABILIDAD: Conectar componentes con el store y servicios de show
 */
export function useShowDetalle(showId: string) {
  const { userId } = useAuth()
  const {
    showSeleccionado,
    loading,
    error,
    loadShowPorID,
    clearShowSeleccionado,
  } = useShowStore()

  /**
   * Cargar show al montar
   */
  useEffect(() => {
    if (showId) {
      loadShowPorID(showId).catch(() => {
        // Error manejado por el store
      })
    }

    return () => {
      clearShowSeleccionado()
    }
  }, [showId])

  /**
   * Agregar al carrito
   */
  const agregarAlCarrito = async (
    idFuncion: number,
    cantidad: number,
    ubicacion: Ubicacion
  ): Promise<void> => {
    if (!userId) throw new Error('Usuario no autenticado')
    try {
      await usuarioService.agregarAlCarrito(userId, showId, idFuncion, cantidad, ubicacion)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  /**
   * Dejar comentario
   */
  const dejarComentario = async (
    entradaId: number,
    contenido: string,
    puntuacion: number | null
  ): Promise<void> => {
    if (!userId) throw new Error('Usuario no autenticado')
    try {
      await usuarioService.dejarComentario(userId, showId, entradaId, contenido, puntuacion)
      // Recargar show para ver el nuevo comentario
      await loadShowPorID(showId)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  /**
   * Borrar comentario
   */
  const borrarComentario = async (): Promise<void> => {
    if (!userId) throw new Error('Usuario no autenticado')
    try {
      await usuarioService.borrarComentario(userId, showId)
      // Recargar show
      await loadShowPorID(showId)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  /**
   * Agregar a lista de espera
   */
  const agregarAListaEspera = async (): Promise<void> => {
    if (!userId) throw new Error('Usuario no autenticado')
    try {
      await showService.sumarAListaEspera(showId, userId)
      // Recargar show
      await loadShowPorID(showId)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  return {
    show: showSeleccionado,
    loading,
    error,
    agregarAlCarrito,
    dejarComentario,
    borrarComentario,
    agregarAListaEspera,
  }
}
