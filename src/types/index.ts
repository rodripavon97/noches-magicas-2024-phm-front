// ============================================
// TIPOS CENTRALIZADOS
// ============================================

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface ApiError {
  message: string
  status?: number
  code?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// Re-exportar todos los tipos del dominio
export type {
  // Enums
  Ubicacion,
  // JSON Types
  AdminJSON,
  UsuarioAmigosJSON,
  ComentarioJSON,
  ShowJSON,
  ShowAdminJSON,
  ShowDetalleJSON,
  EntradaJSON,
  CarritoJSON,
  UsuarioJSON,
  UsuarioDataJSON,
  UsuarioDataLogsJSON,
  LogsJSON,
  // DTOs
  LoginDTO,
  ComentarioNuevoDTO,
  CarritoGetDTO,
  UsuarioEditarDTO,
} from '../interface/interfaces'
