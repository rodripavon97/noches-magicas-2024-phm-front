/**
 * Hook para obtener detalle de un show
 */

import { useState, useCallback, useEffect } from 'react';
import { showServiceNew as showService } from '../../service/showServiceNew';
import { ShowDetalle } from '../../domain/detalleShow';

interface UseShowResult {
  show: ShowDetalle | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useShow(showId: string): UseShowResult {
  const [show, setShow] = useState<ShowDetalle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchShow = useCallback(async () => {
    if (!showId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await showService.getShowDetail(showId);
      setShow(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [showId]);

  // Cargar automáticamente al montar
  useEffect(() => {
    fetchShow();
  }, [fetchShow]);

  return {
    show,
    loading,
    error,
    refetch: fetchShow,
  };
}
