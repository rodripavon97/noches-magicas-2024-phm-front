// ============================================
// HOOK DE USUARIO
// ============================================

import { useEffect } from 'react'
import { useUsuarioStore } from '../stores/usuarioStore'
import { useAuth } from './useAuth'
import { getErrorMessage } from '../errors'

/**
 * Hook para gestionar datos del usuario
 * RESPONSABILIDAD: Conectar componentes con el store de usuario
 */
export function useUsuario() {
  const { userId } = useAuth()
  const {
    usuario,
    carrito,
    entradasCompradas,
    amigos,
    comentarios,
    loading,
    error,
    loadUsuario,
    loadCarrito,
    loadEntradasCompradas,
    loadAmigos,
    loadComentarios,
    editarDatos: editarDatosStore,
    sumarCredito: sumarCreditoStore,
    quitarAmigo: quitarAmigoStore,
    vaciarCarrito: vaciarCarritoStore,
    comprarEntradas: comprarEntradasStore,
    clear,
  } = useUsuarioStore()

  /**
   * Cargar datos del usuario al montar
   */
  useEffect(() => {
    if (userId) {
      loadUsuario(userId).catch(() => {
        // Error manejado por el store
      })
    } else {
      clear()
    }
  }, [userId])

  /**
   * Editar datos del usuario
   */
  const editarDatos = async (nombre: string, apellido: string): Promise<void> => {
    if (!userId) throw new Error('Usuario no autenticado')
    try {
      await editarDatosStore(userId, nombre, apellido)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  /**
   * Sumar crédito al usuario
   */
  const sumarCredito = async (credito: number): Promise<void> => {
    if (!userId) throw new Error('Usuario no autenticado')
    try {
      await sumarCreditoStore(userId, credito)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  /**
   * Quitar amigo
   */
  const quitarAmigo = async (amigoId: number): Promise<void> => {
    if (!userId) throw new Error('Usuario no autenticado')
    try {
      await quitarAmigoStore(userId, amigoId)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  /**
   * Vaciar carrito
   */
  const vaciarCarrito = async (): Promise<void> => {
    if (!userId) throw new Error('Usuario no autenticado')
    try {
      await vaciarCarritoStore(userId)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  /**
   * Comprar entradas del carrito
   */
  const comprarEntradas = async (): Promise<void> => {
    if (!userId) throw new Error('Usuario no autenticado')
    try {
      await comprarEntradasStore(userId)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  /**
   * Cargar carrito
   */
  const refreshCarrito = async (): Promise<void> => {
    if (!userId) throw new Error('Usuario no autenticado')
    try {
      await loadCarrito(userId)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  /**
   * Cargar entradas compradas
   */
  const refreshEntradas = async (): Promise<void> => {
    if (!userId) throw new Error('Usuario no autenticado')
    try {
      await loadEntradasCompradas(userId)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  /**
   * Cargar amigos
   */
  const refreshAmigos = async (): Promise<void> => {
    if (!userId) throw new Error('Usuario no autenticado')
    try {
      await loadAmigos(userId)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  /**
   * Cargar comentarios
   */
  const refreshComentarios = async (): Promise<void> => {
    if (!userId) throw new Error('Usuario no autenticado')
    try {
      await loadComentarios(userId)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  return {
    usuario,
    carrito,
    entradasCompradas,
    amigos,
    comentarios,
    loading,
    error,
    editarDatos,
    sumarCredito,
    quitarAmigo,
    vaciarCarrito,
    comprarEntradas,
    refreshCarrito,
    refreshEntradas,
    refreshAmigos,
    refreshComentarios,
  }
}
