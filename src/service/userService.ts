/**
 * Servicio de gestión de usuarios
 */

import axios from 'axios';
import { REST_SERVER_URL } from './constant';
import { 
  UsuarioJSON, 
  UsuarioEditarDTO,
  CarritoJSON,
  ComentarioJSON,
  ShowJSON,
  ComentarioNuevoDTO,
  CarritoGetDTO,
} from '../interface/interfaces';

class UserService {
  // ============================================
  // MÉTODOS DE USUARIO
  // ============================================

  async getUser(userId: number): Promise<UsuarioJSON> {
    const response = await axios.get<UsuarioJSON>(`${REST_SERVER_URL}/user/${userId}`);
    return response.data;
  }

  async updateUser(userId: number, updates: UsuarioEditarDTO): Promise<UsuarioJSON> {
    const response = await axios.patch<UsuarioJSON>(`${REST_SERVER_URL}/editar-datos-usuario/${userId}`, updates);
    return response.data;
  }

  async getUserFriends(userId: number): Promise<UsuarioJSON[]> {
    const response = await axios.get<UsuarioJSON[]>(`${REST_SERVER_URL}/lista-amigos/${userId}`);
    return response.data;
  }

  async addFriend(userId: number, friendId: number): Promise<void> {
    await axios.post(`${REST_SERVER_URL}/agregar-amigo/${userId}/${friendId}`);
  }

  async removeFriend(userId: number, friendId: number): Promise<void> {
    await axios.put(`${REST_SERVER_URL}/quitar-amigo/${userId}/${friendId}`);
  }

  // ============================================
  // MÉTODOS DE CARRITO
  // ============================================

  async getCart(userId: number): Promise<CarritoJSON[]> {
    const response = await axios.get<CarritoJSON[]>(`${REST_SERVER_URL}/carrito/${userId}`);
    return response.data;
  }

  async addToCart(userId: number, item: CarritoGetDTO): Promise<void> {
    await axios.post(`${REST_SERVER_URL}/agregar-carrito/${userId}`, item);
  }

  async clearCart(userId: number): Promise<void> {
    await axios.delete(`${REST_SERVER_URL}/carrito-vacio/${userId}`);
  }

  async checkout(userId: number): Promise<void> {
    await axios.post(`${REST_SERVER_URL}/comprar-entradas/${userId}`);
  }

  // ============================================
  // MÉTODOS DE ENTRADAS
  // ============================================

  async getPurchasedTickets(userId: number): Promise<ShowJSON[]> {
    const response = await axios.get<ShowJSON[]>(`${REST_SERVER_URL}/entradas-compradas/${userId}`);
    return response.data;
  }

  // ============================================
  // MÉTODOS DE COMENTARIOS
  // ============================================

  async getUserComments(userId: number): Promise<ComentarioJSON[]> {
    const response = await axios.get<ComentarioJSON[]>(`${REST_SERVER_URL}/lista-comentarios/${userId}`);
    return response.data;
  }

  async addComment(
    showId: string,
    userId: number,
    comment: ComentarioNuevoDTO
  ): Promise<void> {
    await axios.post(
      `${REST_SERVER_URL}/dejar-comentario/${showId}?idUser=${userId}`,
      comment
    );
  }

  async deleteComment(userId: number, showId: string): Promise<void> {
    await axios.delete(`${REST_SERVER_URL}/borrar-comentario/${userId}/${showId}`);
  }

  // ============================================
  // MÉTODOS DE SALDO
  // ============================================

  async addCredits(userId: number, amount: number): Promise<void> {
    await axios.patch(`${REST_SERVER_URL}/sumar-credito/${userId}/${amount}`);
  }
}

export const userService = new UserService();
