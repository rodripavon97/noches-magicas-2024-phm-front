import { useToast } from '@chakra-ui/react'

const INTERNAL_SERVER_ERROR = 500

interface ErrorResponse {
  response?: {
    status: number
    data?: {
      message: string
    }
  }
  message?: string
}

export const useMessageToast = () => {
  const toast = useToast()

  const errorToast = (error: ErrorResponse | any): void => {
    const response = error.response ? error.response : 'Error de dominio'
    const status = error.response ? response.status : 400
    const message = response.data ? response.data.message : error.message

    const mensajeError =
      status >= INTERNAL_SERVER_ERROR
        ? 'Ocurrió un error. Consulte al administrador del sistema'
        : status === undefined
        ? 'Ocurrió un error al conectarse al backend. Consulte al administrador del sistema'
        : message
    if (status >= INTERNAL_SERVER_ERROR) {
      console.error(error)
    }
    toast({
      description: mensajeError,
      status: 'error',
      position: 'bottom',
      isClosable: true,
      duration: 5000,
      variant: 'solid',
    })
  }

  const successToast = (mensajeExitoso: string): void => {
    toast({
      description: mensajeExitoso,
      status: 'success',
      position: 'bottom',
      isClosable: true,
      duration: 5000,
      variant: 'solid',
    })
  }

  return { errorToast, successToast }
}