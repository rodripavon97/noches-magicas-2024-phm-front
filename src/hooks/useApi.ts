import { useState, useEffect } from 'react'
import type { UseApiResult, ApiError } from '@types/hooks'

interface UseApiOptions {
  immediate?: boolean
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = { immediate: true }
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<ApiError | null>(null)

  const fetchData = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    
    // SIN try-catch - los errores se propagan al componente
    const result = await fetcher()
    setData(result)
    setLoading(false)
  }

  useEffect(() => {
    if (options.immediate) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data, loading, error, refetch: fetchData }
}
