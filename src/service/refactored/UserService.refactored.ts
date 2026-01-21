/**
 * Servicio de usuario refactorizado siguiendo principios SOLID:
 * - SRP: Responsabilidad única (gestión de usuarios)
 * - DIP: Depende de abstracciones (IHttpClient, IUserService)
 */

import { IHttpClient } from '../abstractions/IHttpClient';
import { IUserService } from '../../types/services';
import { 
  UsuarioJSON, 
  UsuarioEditarDTO,
  LoginDTO,
  CarritoJSON,
  ComentarioJSON,
  ShowJSON,
  ComentarioNuevoDTO,
  CarritoGetDTO,
  Ubicacion,
} from '../../interface/interfaces';
import { Usuario } from '../../domain/Usuario';
import { Carrito } from '../../domain/Carrito';
import { Comentario } from '../../domain/Comentario';
import { Show } from '../../domain/Show';

export class UserService implements IUserService {
  constructor(private httpClient: IHttpClient) {}

  // ============================================
  // MÉTODOS DE AUTENTICACIÓN
  // ============================================

  async login(credentials: LoginDTO): Promise<UsuarioJSON> {
    return this.httpClient.post<UsuarioJSON>('/usuario-logueado', credentials);
  }

  // ============================================
  // MÉTODOS DE USUARIO
  // ============================================

  async getUser(userId: number): Promise<UsuarioJSON> {
    return this.httpClient.get<UsuarioJSON>(`/user/${userId}`);
  }

  async updateUser(userId: number, updates: UsuarioEditarDTO): Promise<UsuarioJSON> {
    return this.httpClient.patch<UsuarioJSON>(`/editar-datos-usuario/${userId}`, updates);
  }

  async getUserFriends(userId: number): Promise<UsuarioJSON[]> {
    return this.httpClient.get<UsuarioJSON[]>(`/lista-amigos/${userId}`);
  }

  async addFriend(userId: number, friendId: number): Promise<void> {
    await this.httpClient.post(`/agregar-amigo/${userId}/${friendId}`);
  }

  async removeFriend(userId: number, friendId: number): Promise<void> {
    await this.httpClient.put(`/quitar-amigo/${userId}/${friendId}`);
  }

  // ============================================
  // MÉTODOS DE CARRITO
  // ============================================

  async getCart(userId: number): Promise<CarritoJSON[]> {
    return this.httpClient.get<CarritoJSON[]>(`/carrito/${userId}`);
  }

  async addToCart(userId: number, item: CarritoGetDTO): Promise<void> {
    await this.httpClient.post(`/agregar-carrito/${userId}`, item);
  }

  async clearCart(userId: number): Promise<void> {
    await this.httpClient.delete(`/carrito-vacio/${userId}`);
  }

  async checkout(userId: number): Promise<void> {
    await this.httpClient.post(`/comprar-entradas/${userId}`);
  }

  // ============================================
  // MÉTODOS DE ENTRADAS
  // ============================================

  async getPurchasedTickets(userId: number): Promise<ShowJSON[]> {
    return this.httpClient.get<ShowJSON[]>(`/entradas-compradas/${userId}`);
  }

  // ============================================
  // MÉTODOS DE COMENTARIOS
  // ============================================

  async getUserComments(userId: number): Promise<ComentarioJSON[]> {
    return this.httpClient.get<ComentarioJSON[]>(`/lista-comentarios/${userId}`);
  }

  async addComment(
    userId: number,
    showId: string,
    entradaId: number,
    comment: ComentarioNuevoDTO
  ): Promise<void> {
    await this.httpClient.post(
      `/dejar-comentario/${userId}/${showId}/${entradaId}`,
      comment
    );
  }

  async deleteComment(userId: number, showId: string): Promise<void> {
    await this.httpClient.delete(`/borrar-comentario/${userId}/${showId}`);
  }

  // ============================================
  // MÉTODOS DE SALDO
  // ============================================

  async addCredits(userId: number, amount: number): Promise<void> {
    await this.httpClient.patch(`/sumar-credito/${userId}/${amount}`);
  }
}
