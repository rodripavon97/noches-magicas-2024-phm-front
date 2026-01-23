// ============================================
// HOOKS UTILITARIOS
// ============================================

export { useApi } from './useApi'
export { useToastHandler } from './useToastHandler'
export { useForm } from './useForm'
export { useDebounce } from './useDebounce'
export { useLocalStorage } from './useLocalStorage'
export { useOnInit } from './useOnInit'
export { useMessageToast } from './useToast'

// ============================================
// HOOKS DE ESTADO GLOBAL (Zustand)
// ============================================

export { default as UseUser } from './useUserStore';
export { useUserStore } from './useUserStore';

// ============================================
// HOOKS DE AUTENTICACIÓN
// ============================================

export { 
  useAuth, 
  useLogin, 
  useLogout, 
  useCurrentUser 
} from './useAuth'

// ============================================
// HOOKS DE USUARIOS
// ============================================

export {
  useUser,
  useUserFriends,
  useUpdateUser,
  useCart,
  useUserComments,
  usePurchasedTickets,
  useAddCredits,
} from './useUsers'

// ============================================
// HOOKS DE SHOWS
// ============================================

export {
  useShows,
  useShow,
  useSearchShows,
  useShowsByLocation,
  useShowsAdmin,
  useUpdateShow,
  useDeleteShow,
  useAddFunction,
  useWaitingList,
  useRegisterClick,
} from './shows'

// ============================================
// TIPOS
// ============================================

export type { UseApiResult, ApiError } from '../types/hooks'
