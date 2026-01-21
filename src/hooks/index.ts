// Hooks personalizados nuevos
export { useApi } from './useApi'
export { useToastHandler } from './useToastHandler'
export { useForm } from './useForm'
export { useDebounce } from './useDebounce'
export { useLocalStorage } from './useLocalStorage'

// Hooks existentes migrados
export { useOnInit } from './useOnInit'
export { useMessageToast } from './useToast'
export { default as UseUser } from './useUser'

// Tipos
export type { UseApiResult, ApiError } from '@types/hooks'
