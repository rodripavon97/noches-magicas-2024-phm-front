/**
 * Types para servicios y API
 * Siguiendo el principio DIP (Dependency Inversion Principle)
 */

import { 
  UsuarioJSON, 
  ShowJSON, 
  LoginDTO, 
  ComentarioNuevoDTO,
  CarritoJSON,
  CarritoGetDTO,
  UsuarioEditarDTO,
} from '../interface/interfaces';

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// ============================================
// SERVICE INTERFACES (Abstracciones)
// ============================================

/**
 * Interfaz para el servicio de autenticación
 * Permite cambiar la implementación sin afectar a los componentes
 */
export interface IAuthService {
  login(credentials: LoginDTO): Promise<UsuarioJSON>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UsuarioJSON | null>;
  isAuthenticated(): boolean;
}

/**
 * Interfaz para el servicio de usuarios
 */
export interface IUserService {
  getUser(userId: number): Promise<UsuarioJSON>;
  updateUser(userId: number, updates: UsuarioEditarDTO): Promise<UsuarioJSON>;
  getUserFriends(userId: number): Promise<UsuarioJSON[]>;
  addFriend(userId: number, friendId: number): Promise<void>;
  removeFriend(userId: number, friendId: number): Promise<void>;
}

/**
 * Interfaz para el servicio de shows
 */
export interface IShowService {
  getShows(): Promise<ShowJSON[]>;
  getShowById(id: string): Promise<ShowJSON>;
  searchShows(query: string): Promise<ShowJSON[]>;
  getShowsByLocation(location: string): Promise<ShowJSON[]>;
}

/**
 * Interfaz para el servicio de carrito
 */
export interface ICartService {
  getCart(userId: number): Promise<CarritoJSON[]>;
  addToCart(userId: number, item: CarritoGetDTO): Promise<void>;
  removeFromCart(userId: number, itemId: number): Promise<void>;
  clearCart(userId: number): Promise<void>;
  checkout(userId: number): Promise<void>;
}

/**
 * Interfaz para el servicio de comentarios
 */
export interface ICommentService {
  addComment(showId: string, userId: number, comment: ComentarioNuevoDTO): Promise<void>;
  getComments(showId: string): Promise<any[]>;
  updateComment(commentId: number, updates: ComentarioNuevoDTO): Promise<void>;
  deleteComment(commentId: number): Promise<void>;
}

/**
 * Interfaz para el servicio de logging
 */
export interface ILoggingService {
  registrarClickEnShow(showId: string, ubicacion: string): Promise<void>;
  getLogs(): Promise<any[]>;
}

// ============================================
// QUERY/MUTATION KEYS (para React Query)
// ============================================

export const QueryKeys = {
  user: (id: number) => ['user', id] as const,
  users: ['users'] as const,
  shows: ['shows'] as const,
  show: (id: string) => ['show', id] as const,
  cart: (userId: number) => ['cart', userId] as const,
  comments: (showId: string) => ['comments', showId] as const,
} as const;
