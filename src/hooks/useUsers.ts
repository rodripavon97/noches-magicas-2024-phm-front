/**
 * Hooks para gestión de usuarios
 * Siguiendo principios de Clean Code y SOLID
 */

import { useState, useCallback } from 'react';
import { userService } from '../service/userService';
import { UsuarioJSON, UsuarioEditarDTO } from '../interface/interfaces';

// ============================================
// HOOK: Obtener información de un usuario
// ============================================

interface UseUserResult {
  user: UsuarioJSON | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useUser(userId: number): UseUserResult {
  const [user, setUser] = useState<UsuarioJSON | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getUser(userId);
      setUser(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}

// ============================================
// HOOK: Obtener amigos del usuario
// ============================================

interface UseUserFriendsResult {
  friends: UsuarioJSON[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  removeFriend: (friendId: number) => Promise<void>;
}

export function useUserFriends(userId: number): UseUserFriendsResult {
  const [friends, setFriends] = useState<UsuarioJSON[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFriends = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getUserFriends(userId);
      setFriends(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const removeFriend = useCallback(async (friendId: number) => {
    try {
      await userService.removeFriend(userId, friendId);
      // Actualizar la lista local
      setFriends(prev => prev.filter(f => f.id !== friendId));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId]);

  return {
    friends,
    loading,
    error,
    refetch: fetchFriends,
    removeFriend,
  };
}

// ============================================
// HOOK: Actualizar datos del usuario
// ============================================

interface UseUpdateUserResult {
  updateUser: (updates: UsuarioEditarDTO) => Promise<UsuarioJSON>;
  updating: boolean;
  error: Error | null;
}

export function useUpdateUser(userId: number): UseUpdateUserResult {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateUser = useCallback(async (updates: UsuarioEditarDTO) => {
    setUpdating(true);
    setError(null);
    
    try {
      const updatedUser = await userService.updateUser(userId, updates);
      return updatedUser;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [userId]);

  return {
    updateUser,
    updating,
    error,
  };
}

// ============================================
// HOOK: Gestión de carrito
// ============================================

import { CarritoJSON, CarritoGetDTO } from '../interface/interfaces';

interface UseCartResult {
  cart: CarritoJSON[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  addToCart: (item: CarritoGetDTO) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
}

export function useCart(userId: number): UseCartResult {
  const [cart, setCart] = useState<CarritoJSON[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCart = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getCart(userId);
      setCart(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addToCart = useCallback(async (item: CarritoGetDTO) => {
    try {
      await userService.addToCart(userId, item);
      await fetchCart(); // Recargar carrito
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId, fetchCart]);

  const clearCart = useCallback(async () => {
    try {
      await userService.clearCart(userId);
      setCart([]);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId]);

  const checkout = useCallback(async () => {
    try {
      await userService.checkout(userId);
      setCart([]);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId]);

  return {
    cart,
    loading,
    error,
    refetch: fetchCart,
    addToCart,
    clearCart,
    checkout,
  };
}

// ============================================
// HOOK: Gestión de comentarios del usuario
// ============================================

import { ComentarioJSON, ComentarioNuevoDTO } from '../interface/interfaces';

interface UseUserCommentsResult {
  comments: ComentarioJSON[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  addComment: (showId: string, comment: ComentarioNuevoDTO) => Promise<void>;
  deleteComment: (showId: string) => Promise<void>;
}

export function useUserComments(userId: number): UseUserCommentsResult {
  const [comments, setComments] = useState<ComentarioJSON[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getUserComments(userId);
      setComments(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addComment = useCallback(async (showId: string, comment: ComentarioNuevoDTO) => {
    try {
      await userService.addComment(showId, userId, comment);
      await fetchComments(); // Recargar comentarios
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId, fetchComments]);

  const deleteComment = useCallback(async (showId: string) => {
    try {
      await userService.deleteComment(userId, showId);
      // Actualizar la lista local
      setComments(prev => prev.filter(c => c.idShow !== showId));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [userId]);

  return {
    comments,
    loading,
    error,
    refetch: fetchComments,
    addComment,
    deleteComment,
  };
}

// ============================================
// HOOK: Obtener entradas compradas
// ============================================

import { ShowJSON } from '../interface/interfaces';

interface UsePurchasedTicketsResult {
  tickets: ShowJSON[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePurchasedTickets(userId: number): UsePurchasedTicketsResult {
  const [tickets, setTickets] = useState<ShowJSON[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTickets = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getPurchasedTickets(userId);
      setTickets(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    tickets,
    loading,
    error,
    refetch: fetchTickets,
  };
}

// ============================================
// HOOK: Agregar créditos
// ============================================

interface UseAddCreditsResult {
  addCredits: (amount: number) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export function useAddCredits(userId: number): UseAddCreditsResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addCredits = useCallback(async (amount: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await userService.addCredits(userId, amount);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    addCredits,
    loading,
    error,
  };
}
