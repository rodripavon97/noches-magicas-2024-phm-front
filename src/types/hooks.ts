export interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}

export interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
}
