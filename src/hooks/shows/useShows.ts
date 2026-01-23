/**
 * Hook para obtener lista de shows
 */

import { useState, useCallback, useEffect } from 'react';
import { showServiceNew as showService } from '../../service/showServiceNew';
import { ShowJSON } from '../../interface/interfaces';
import { GetShowsParams } from '../../service/showServiceNew';

interface UseShowsResult {
  shows: ShowJSON[];
  loading: boolean;
  error: Error | null;
  refetch: (params?: GetShowsParams) => Promise<void>;
}

export function useShows(initialParams: GetShowsParams = {}): UseShowsResult {
  const [shows, setShows] = useState<ShowJSON[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState(initialParams);

  const fetchShows = useCallback(async (newParams?: GetShowsParams) => {
    const searchParams = newParams || params;
    setParams(searchParams);
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await showService.getShows(searchParams);
      setShows(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  // Cargar automáticamente al montar
  useEffect(() => {
    fetchShows();
  }, []);

  return {
    shows,
    loading,
    error,
    refetch: fetchShows,
  };
}
