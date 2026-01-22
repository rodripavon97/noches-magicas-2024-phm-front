/**
 * Hooks para gestión de shows
 * Siguiendo principios de Clean Code y SOLID
 */

import { useState, useCallback, useEffect } from 'react';
import { showServiceNew as showService } from '../service/showServiceNew';
import { ShowJSON } from '../interface/interfaces';
import { ShowDetalle } from '../domain/detalleShow';
import { GetShowsParams, GetShowsAdminParams, NuevaFuncionData, EditarShowData } from '../service/showServiceNew';

// ============================================
// HOOK: Obtener lista de shows
// ============================================

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

// ============================================
// HOOK: Obtener detalle de un show
// ============================================

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

// ============================================
// HOOK: Buscar shows
// ============================================

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

// ============================================
// HOOK: Obtener shows por ubicación
// ============================================

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

// ============================================
// HOOK: Agregar a lista de espera
// ============================================

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

// ============================================
// HOOK: Registrar click en show (logging)
// ============================================

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
