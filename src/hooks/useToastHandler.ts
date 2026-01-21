import { useToast, UseToastOptions } from '@chakra-ui/react'
import type { ApiError } from '@types/hooks'

export function useToastHandler() {
  const toast = useToast()

  const showSuccess = (message: string, options?: UseToastOptions) => {
    toast({
      title: 'Éxito',
      description: message,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
      ...options,
    })
  }

  const showError = (error: Error | ApiError | string, options?: UseToastOptions) => {
    const message = typeof error === 'string' 
      ? error 
      : error.message || 'Ocurrió un error inesperado'

    toast({
      title: 'Error',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
      ...options,
    })
  }

  const showWarning = (message: string, options?: UseToastOptions) => {
    toast({
      title: 'Advertencia',
      description: message,
      status: 'warning',
      duration: 4000,
      isClosable: true,
      position: 'top-right',
      ...options,
    })
  }

  const showInfo = (message: string, options?: UseToastOptions) => {
    toast({
      title: 'Información',
      description: message,
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
      ...options,
    })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
