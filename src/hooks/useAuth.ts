/**
 * Hooks para gestión de autenticación
 * Siguiendo principios de Clean Code y SOLID
 */

import { useState, useCallback, useEffect } from 'react';
import { authService } from '../service/authService';
import { LoginDTO, UsuarioJSON } from '../interface/interfaces';
import UseUser from './useUserStore';

// ============================================
// HOOK: Autenticación
// ============================================

interface UseAuthResult {
  user: UsuarioJSON | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: Error | null;
  login: (credentials: LoginDTO) => Promise<UsuarioJSON>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<UsuarioJSON | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Integración con el store de Zustand
  const { setUser: setUserStore, logout: logoutStore } = UseUser();

  // Cargar usuario actual al montar
  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };

    if (authService.isAuthenticated()) {
      loadUser();
    }
  }, []);

  const login = useCallback(async (credentials: LoginDTO) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      
      // Actualizar el store de Zustand
      setUserStore(userData);
      
      return userData;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUserStore]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
      
      // Actualizar el store de Zustand
      logoutStore();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [logoutStore]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: authService.isAuthenticated(),
    isAdmin: authService.isAdmin(),
    loading,
    error,
    login,
    logout,
    refetch,
  };
}

// ============================================
// HOOK: Login
// ============================================

interface UseLoginResult {
  login: (credentials: LoginDTO) => Promise<UsuarioJSON>;
  loading: boolean;
  error: Error | null;
}

export function useLogin(): UseLoginResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { setUser: setUserStore } = UseUser();

  const login = useCallback(async (credentials: LoginDTO) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.login(credentials);
      
      // Actualizar el store de Zustand
      setUserStore(userData);
      
      return userData;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUserStore]);

  return {
    login,
    loading,
    error,
  };
}

// ============================================
// HOOK: Logout
// ============================================

interface UseLogoutResult {
  logout: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export function useLogout(): UseLogoutResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { logout: logoutStore } = UseUser();

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
      
      // Actualizar el store de Zustand
      logoutStore();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [logoutStore]);

  return {
    logout,
    loading,
    error,
  };
}

// ============================================
// HOOK: Obtener usuario actual
// ============================================

interface UseCurrentUserResult {
  user: UsuarioJSON | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<UsuarioJSON | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar
  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchUser();
    }
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}
