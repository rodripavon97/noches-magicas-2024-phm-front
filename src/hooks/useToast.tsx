// ============================================
// HOOK DE TOAST (Notificaciones)
// ============================================

import { useToast as useChakraToast, ToastId } from '@chakra-ui/react'

/**
 * Opciones para mostrar toast
 */
interface ToastOptions {
  title?: string
  description?: string
  duration?: number
  isClosable?: boolean
}

/**
 * Hook para mostrar notificaciones toast
 * RESPONSABILIDAD: Abstraer lógica de notificaciones
 */
export function useToast() {
  const toast = useChakraToast()

  /**
   * Muestra un toast de éxito
   */
  const success = (message: string, options: ToastOptions = {}): ToastId => {
    return toast({
      title: options.title || 'Éxito',
      description: message,
      status: 'success',
      duration: options.duration || 3000,
      isClosable: options.isClosable !== false,
      position: 'top-right',
    })
  }

  /**
   * Muestra un toast de error
   */
  const error = (message: string, options: ToastOptions = {}): ToastId => {
    return toast({
      title: options.title || 'Error',
      description: message,
      status: 'error',
      duration: options.duration || 5000,
      isClosable: options.isClosable !== false,
      position: 'top-right',
    })
  }

  /**
   * Muestra un toast de advertencia
   */
  const warning = (message: string, options: ToastOptions = {}): ToastId => {
    return toast({
      title: options.title || 'Advertencia',
      description: message,
      status: 'warning',
      duration: options.duration || 4000,
      isClosable: options.isClosable !== false,
      position: 'top-right',
    })
  }

  /**
   * Muestra un toast informativo
   */
  const info = (message: string, options: ToastOptions = {}): ToastId => {
    return toast({
      title: options.title || 'Información',
      description: message,
      status: 'info',
      duration: options.duration || 3000,
      isClosable: options.isClosable !== false,
      position: 'top-right',
    })
  }

  /**
   * Cierra todos los toasts
   */
  const closeAll = (): void => {
    toast.closeAll()
  }

  /**
   * Cierra un toast específico
   */
  const close = (id: ToastId): void => {
    if (id) {
      toast.close(id)
    }
  }

  return {
    success,
    error,
    warning,
    info,
    closeAll,
    close,
  }
}
