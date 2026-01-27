// ============================================
// MANEJO CENTRALIZADO DE ERRORES
// ============================================

import { AxiosError } from 'axios'
import { ApiError } from '../types'

/**
 * Extrae un mensaje de error legible de cualquier tipo de error
 * OBLIGATORIO: Todo componente debe usar esta función para mostrar errores
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message
  }

  if (isAxiosError(error)) {
    return extractAxiosErrorMessage(error)
  }

  if (isApiError(error)) {
    return error.message
  }

  return 'Ha ocurrido un error inesperado'
}

/**
 * Type guard para verificar si es un AxiosError
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true
}

/**
 * Type guard para verificar si es un ApiError
 */
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  )
}

/**
 * Extrae el mensaje de error de una respuesta de Axios
 */
function extractAxiosErrorMessage(error: AxiosError): string {
  const status = error.response?.status
  const data = error.response?.data as any

  // Mensajes personalizados por código de estado
  if (status === 401) {
    return 'No tiene autorización para realizar esta acción'
  }

  if (status === 403) {
    return 'Acceso denegado'
  }

  if (status === 404) {
    return 'Recurso no encontrado'
  }

  if (status === 500) {
    return 'Error interno del servidor'
  }

  // Intentar extraer mensaje del backend
  if (data) {
    if (typeof data === 'string') {
      return data
    }
    if (data.message) {
      return data.message
    }
    if (data.error) {
      return data.error
    }
  }

  // Mensaje por defecto
  return error.message || 'Error de conexión con el servidor'
}

/**
 * Crea un ApiError personalizado
 */
export function createApiError(message: string, status?: number, code?: string): ApiError {
  return { message, status, code }
}

/**
 * Determina si un error es recuperable
 */
export function isRecoverableError(error: unknown): boolean {
  if (isAxiosError(error)) {
    const status = error.response?.status
    return status !== undefined && status >= 400 && status < 500 && status !== 401
  }
  return false
}
