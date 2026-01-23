/**
 * Hook para obtener shows por ubicación
 */

import { useState, useCallback } from 'react';
import { showServiceNew as showService } from '../../service/showServiceNew';
import { ShowJSON } from '../../interface/interfaces';

interface UseShowsByLocationResult {
  shows: ShowJSON[];
  loading: boolean;
  error: Error | null;
  fetchByLocation: (location: string) => Promise<void>;
}

export function useShowsByLocation(): UseShowsByLocationResult {
  const [shows, setShows] = useState<ShowJSON[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchByLocation = useCallback(async (location: string) => {
    if (!location) {
      setShows([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await showService.getShowsByLocation(location);
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
    fetchByLocation,
  };
}
