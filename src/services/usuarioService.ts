// ============================================
// SERVICIO DE USUARIO - Capa de Negocio
// ============================================

import { httpClient } from '../api/httpClient'
import { Usuario } from '../domain/Usuario'
import { Carrito } from '../domain/Carrito'
import { Comentario } from '../domain/Comentario'
import { Show } from '../domain/Show'
import {
  UsuarioJSON,
  CarritoJSON,
  ComentarioJSON,
  ShowJSON,
  Ubicacion,
  ComentarioNuevoDTO,
  UsuarioEditarDTO,
} from '../types'

/**
 * Servicio de Usuario
 * RESPONSABILIDAD: Lógica de negocio relacionada con usuarios
 * NO conoce axios, solo httpClient
 */
class UsuarioService {
  // ============================================
  // AUTENTICACIÓN
  // ============================================

  async login(username: string, password: string): Promise<any> {
    const requestBody = { username, password }
    return httpClient.post('/usuario-logueado', requestBody)
  }

  // ============================================
  // INFORMACIÓN DEL USUARIO
  // ============================================

  async getInfoUsuario(userId: string): Promise<UsuarioJSON> {
    return httpClient.get<UsuarioJSON>(`/user/${userId}`)
  }

  async getEntradasCompradas(userId: string): Promise<Show[]> {
    const showsJSON = await httpClient.get<ShowJSON[]>(`/entradas-compradas/${userId}`)
    return showsJSON.map((showJSON) => Show.fromJSON(showJSON))
  }

  async getAmigos(userId: string): Promise<Usuario[]> {
    const amigosJSON = await httpClient.get<UsuarioJSON[]>(`/lista-amigos/${userId}`)
    return amigosJSON.map((amigoJSON) => Usuario.fromJSON(amigoJSON))
  }

  async getComentarios(userId: string): Promise<Comentario[]> {
    const comentariosJSON = await httpClient.get<ComentarioJSON[]>(
      `/lista-comentarios/${userId}`
    )
    return comentariosJSON.map((comentarioJSON) => Comentario.fromJSON(comentarioJSON))
  }

  // ============================================
  // CARRITO
  // ============================================

  async getCarrito(userId: string): Promise<Carrito[]> {
    const carritoJSON = await httpClient.get<CarritoJSON[]>(`/carrito/${userId}`)
    return carritoJSON.map((item) => Carrito.fromJSON(item))
  }

  async agregarAlCarrito(
    userId: string,
    idShow: string,
    idFuncion: number,
    cantidad: number,
    ubicacion: Ubicacion
  ): Promise<void> {
    const requestBody = {
      idShow,
      idFuncion,
      cantidad,
      ubicacion,
    }
    await httpClient.post(`/agregar-carrito/${userId}`, requestBody)
  }

  async vaciarCarrito(userId: string): Promise<void> {
    await httpClient.delete(`/carrito-vacio/${userId}`)
  }

  async comprarEntradas(userId: string): Promise<void> {
    await httpClient.post(`/comprar-entradas/${userId}`)
  }

  // ============================================
  // GESTIÓN DE USUARIO
  // ============================================

  async editarDatos(userId: string, datos: UsuarioEditarDTO): Promise<void> {
    const requestBody = {
      nombre: datos.nombre,
      apellido: datos.apellido,
    }
    await httpClient.patch(`/editar-datos-usuario/${userId}`, requestBody)
  }

  async sumarCredito(userId: string, credito: number): Promise<void> {
    await httpClient.patch(`/sumar-credito/${userId}/${credito}`)
  }

  // ============================================
  // AMIGOS
  // ============================================

  async quitarAmigo(userId: string, amigoId: number): Promise<void> {
    await httpClient.put(`/quitar-amigo/${userId}/${amigoId}`)
  }

  // ============================================
  // COMENTARIOS
  // ============================================

  async dejarComentario(
    userId: string,
    showId: string,
    entradaId: number,
    contenido: string,
    puntuacion: number | null
  ): Promise<void> {
    const requestBody: ComentarioNuevoDTO = {
      contenido,
      puntuacion,
    }
    await httpClient.post(
      `/dejar-comentario/${userId}/${showId}/${entradaId}`,
      requestBody
    )
  }

  async borrarComentario(userId: string, showId: string): Promise<void> {
    await httpClient.delete(`/borrar-comentario/${userId}/${showId}`)
  }
}

// Exportar instancia única (singleton)
export const usuarioService = new UsuarioService()
