import axios, { AxiosResponse } from 'axios'
import { REST_SERVER_URL } from './constant'
import { Usuario } from '../domain/Usuario'
import { UsuarioJSON, CarritoJSON, ComentarioJSON, EntradaJSON, ShowJSON, Ubicacion, ComentarioNuevoDTO } from '../interface/interfaces'
import { Carrito } from '../domain/Carrito'
import { Comentario } from '../domain/Comentario'
import { Entrada } from '../domain/entrada'
import { Show } from '../domain/Show'

class UsuarioService {
  setIdUsuarioLogueado(id: number): void {
    localStorage.setItem("idUsuarioLogueado", JSON.stringify(id))
  }

  getIdUsuarioLogueado(): string | null {
    return localStorage.getItem("idUsuarioLogueado")
  }

  removeIdUsuarioLogueado(): void {
    localStorage.removeItem("idUsuarioLogueado")
  }

  async login(username: string, password: string): Promise<any> {
    const requestBody = {
      username: username,
      password: password
    }
    const response = await axios.post(`${REST_SERVER_URL}/usuario-logueado`, requestBody)

    return response.data
  }

  async getInfoUsuario(): Promise<UsuarioJSON> {
    const id = localStorage.getItem('userId')
    const response = await axios.get<UsuarioJSON>(`${REST_SERVER_URL}/user/${id}`)
    const datos = response.data
    return datos
  }

  async getEntradasCompradas(): Promise<Show[]> {
    const id = localStorage.getItem('userId')
    const response = await axios.get<ShowJSON[]>(`${REST_SERVER_URL}/entradas-compradas/${id}`)
    const shows = response.data.map((showJSON) => Show.fromJSON(showJSON))
    return shows
  }

  async getCarrito(): Promise<Carrito[]> {
    const id = localStorage.getItem('userId')
    const response = await axios.get<CarritoJSON[]>(`${REST_SERVER_URL}/carrito/${id}`)
    const carrito = response.data.map((carritoJSON) => Carrito.fromJSON(carritoJSON))
    return carrito
  }

  async vaciarCarrito(): Promise<AxiosResponse> {
    const id = localStorage.getItem('userId')
    const response = await axios.delete(`${REST_SERVER_URL}/carrito-vacio/${id}`)
    return response
  }

  async getAmigos(): Promise<Usuario[]> {
    const id = localStorage.getItem('userId')
    const response = await axios.get<UsuarioJSON[]>(`${REST_SERVER_URL}/lista-amigos/${id}`)
    const amigos = response.data.map((amigo) => Usuario.fromJSON(amigo))
    return amigos
  }

  async getComentarios(): Promise<Comentario[]> {
    const id = localStorage.getItem('userId')
    const response = await axios.get<ComentarioJSON[]>(`${REST_SERVER_URL}/lista-comentarios/${id}`)
    const comentarios = response.data.map((comentario) => Comentario.fromJSON(comentario))
    return comentarios
  }

  async editarDatos(nombre: string, apellido: string): Promise<AxiosResponse> {
    const requestBody = {
      nombre: nombre,
      apellido: apellido
    }
    const id = localStorage.getItem('userId')
    const response = await axios.patch(`${REST_SERVER_URL}/editar-datos-usuario/${id}`, requestBody)
    return response
  }

  async comprarEntradas(): Promise<AxiosResponse> {
    const id = localStorage.getItem('userId')
    const response = await axios.post(`${REST_SERVER_URL}/comprar-entradas/${id}`)
    return response
  }

  async agregarAlCarrito(idShow: string, idFuncion: number, cantidad: number, ubi: Ubicacion): Promise<AxiosResponse> {
    const id = localStorage.getItem('userId')
    if (!id) {
      throw new Error('Usuario no autenticado')
    }
    
    const requestBody = {
      idShow: idShow,
      idFuncion: idFuncion,
      cantidad: cantidad,
      ubicacion: ubi
    }
    
    const response = await axios.post(`${REST_SERVER_URL}/agregar-carrito/${id}`, requestBody)
    return response
  }

  async sumarCredito(credito: number): Promise<AxiosResponse> {
    const id = localStorage.getItem('userId')
    const response = await axios.patch(`${REST_SERVER_URL}/sumar-credito/${id}/${credito}`)
    return response
  }

  async quitarAmigo(amigoId: number): Promise<AxiosResponse> {
    const id = localStorage.getItem('userId')
    const response = await axios.put(`${REST_SERVER_URL}/quitar-amigo/${id}/${amigoId}`)
    return response
  }

  async dejarComentario(showId: string, entradaId: number, contenido: string, puntuacion: number | null): Promise<void> {
    const requestBody: ComentarioNuevoDTO = {
      contenido: contenido,
      puntuacion: puntuacion
    }
    const id = localStorage.getItem('userId')
    await axios.post(`${REST_SERVER_URL}/dejar-comentario/${id}/${showId}/${entradaId}`, requestBody)
  }

  async borrarComentario(showId: string): Promise<AxiosResponse> {
    const id = localStorage.getItem('userId')
    const response = await axios.delete(`${REST_SERVER_URL}/borrar-comentario/${id}/${showId}`)
    return response
  }
}
export const usuarioService = new UsuarioService()