/**
 * Hook para agregar a lista de espera
 */

import { useState, useCallback } from 'react';
import { showServiceNew as showService } from '../../service/showServiceNew';

interface UseWaitingListResult {
  addToWaitingList: (showId: string, userId: number) => Promise<void>;
  adding: boolean;
  error: Error | null;
}

export function useWaitingList(): UseWaitingListResult {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addToWaitingList = useCallback(async (showId: string, userId: number) => {
    setAdding(true);
    setError(null);
    
    try {
      await showService.addToWaitingList(showId, userId);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setAdding(false);
    }
  }, []);

  return {
    addToWaitingList,
    adding,
    error,
  };
}
