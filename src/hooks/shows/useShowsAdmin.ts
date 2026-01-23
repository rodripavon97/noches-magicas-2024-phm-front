/**
 * Hooks para gestión de shows del admin
 */

import { useState, useCallback, useEffect } from 'react';
import { showServiceNew as showService } from '../../service/showServiceNew';
import { ShowJSON } from '../../interface/interfaces';
import { GetShowsAdminParams, NuevaFuncionData, EditarShowData } from '../../service/showServiceNew';

// ============================================
// HOOK: Obtener shows para admin
// ============================================

interface UseShowsAdminResult {
  shows: ShowJSON[];
  loading: boolean;
  error: Error | null;
  refetch: (params?: GetShowsAdminParams) => Promise<void>;
}

export function useShowsAdmin(initialParams: GetShowsAdminParams = {}): UseShowsAdminResult {
  const [shows, setShows] = useState<ShowJSON[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState(initialParams);

  const fetchShows = useCallback(async (newParams?: GetShowsAdminParams) => {
    const searchParams = newParams || params;
    setParams(searchParams);
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await showService.getShowsAdmin(searchParams);
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

// ============================================
// HOOK: Actualizar show (admin)
// ============================================

interface UseUpdateShowResult {
  updateShow: (showId: string, updates: EditarShowData) => Promise<void>;
  updating: boolean;
  error: Error | null;
}

export function useUpdateShow(): UseUpdateShowResult {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateShow = useCallback(async (showId: string, updates: EditarShowData) => {
    setUpdating(true);
    setError(null);
    
    try {
      await showService.updateShow(showId, updates);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  return {
    updateShow,
    updating,
    error,
  };
}

// ============================================
// HOOK: Eliminar show (admin)
// ============================================

interface UseDeleteShowResult {
  deleteShow: (showId: string) => Promise<void>;
  deleting: boolean;
  error: Error | null;
}

export function useDeleteShow(): UseDeleteShowResult {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteShow = useCallback(async (showId: string) => {
    setDeleting(true);
    setError(null);
    
    try {
      await showService.deleteShow(showId);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setDeleting(false);
    }
  }, []);

  return {
    deleteShow,
    deleting,
    error,
  };
}

// ============================================
// HOOK: Agregar nueva función (admin)
// ============================================

interface UseAddFunctionResult {
  addFunction: (showId: string, functionData: NuevaFuncionData) => Promise<void>;
  adding: boolean;
  error: Error | null;
}

export function useAddFunction(): UseAddFunctionResult {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addFunction = useCallback(async (showId: string, functionData: NuevaFuncionData) => {
    setAdding(true);
    setError(null);
    
    try {
      await showService.addNewFunction(showId, functionData);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setAdding(false);
    }
  }, []);

  return {
    addFunction,
    adding,
    error,
  };
}
