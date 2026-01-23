/**
 * Hook para buscar shows
 */

import { useState, useCallback } from 'react';
import { showServiceNew as showService } from '../../service/showServiceNew';
import { ShowJSON } from '../../interface/interfaces';

interface UseSearchShowsResult {
  shows: ShowJSON[];
  loading: boolean;
  error: Error | null;
  search: (query: string) => Promise<void>;
}

export function useSearchShows(): UseSearchShowsResult {
  const [shows, setShows] = useState<ShowJSON[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setShows([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await showService.searchShows(query);
      setShows(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    shows,
    loading,
    error,
    search,
  };
}
