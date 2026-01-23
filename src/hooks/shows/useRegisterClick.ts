/**
 * Hook para registrar click en show (logging)
 */

import { useState, useCallback } from 'react';
import { showServiceNew as showService } from '../../service/showServiceNew';

interface UseRegisterClickResult {
  registerClick: (showId: string, userId: string, payload: any) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export function useRegisterClick(): UseRegisterClickResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const registerClick = useCallback(async (showId: string, userId: string, payload: any) => {
    setLoading(true);
    setError(null);
    
    try {
      await showService.registerClickLog(showId, userId, payload);
    } catch (err) {
      setError(err as Error);
      // No re-lanzar el error para que no interrumpa el flujo
      console.error('Error registrando click:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    registerClick,
    loading,
    error,
  };
}
