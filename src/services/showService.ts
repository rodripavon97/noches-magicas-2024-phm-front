// ============================================
// SERVICIO DE SHOWS - Capa de Negocio
// ============================================

import { httpClient } from '../api/httpClient'
import { Show } from '../domain/Show'
import { ShowDetalle } from '../domain/detalleShow'
import { ShowJSON, Ubicacion } from '../types'

/**
 * Parámetros para búsqueda de shows
 */
export interface GetShowsParams {
  artista: string
  location: string
  conAmigos: boolean
  userId?: string
}

/**
 * Parámetros para búsqueda de shows (Admin)
 */
export interface GetShowsAdminParams {
  artista: string
  location: string
  userId?: string
}

/**
 * Datos para crear una nueva función
 */
export interface NuevaFuncionData {
  fecha: string
  hora: string
}

/**
 * Datos para editar un show
 */
export interface EditarShowData {
  nombreBanda: string
  nombreShow: string
}

/**
 * Servicio de Shows
 * RESPONSABILIDAD: Lógica de negocio relacionada con shows
 * NO conoce axios, solo httpClient
 */
class ShowService {
  // ============================================
  // BÚSQUEDA Y LISTADO
  // ============================================

  async getShows(params: GetShowsParams): Promise<Show[]> {
    const { artista, location, conAmigos, userId } = params
    const queryParams = new URLSearchParams({
      artista: artista || '',
      locacion: location || '',
      id: userId || '',
      conAmigos: String(conAmigos || ''),
    })

    const showsJSON = await httpClient.get<ShowJSON[]>(`/shows?${queryParams.toString()}`)
    return showsJSON.map((showJSON) => Show.fromJSON(showJSON))
  }

  async getShowsAdmin(params: GetShowsAdminParams): Promise<Show[]> {
    const { artista, location, userId } = params
    const queryParams = new URLSearchParams({
      artista: artista || '',
      locacion: location || '',
      id: userId || '',
    })

    const showsJSON = await httpClient.get<ShowJSON[]>(
      `/admin/shows?${queryParams.toString()}`
    )
    return showsJSON.map((showJSON) => Show.fromJSON(showJSON))
  }

  async getShowPorID(id: string): Promise<ShowDetalle> {
    const showJSON = await httpClient.get(`/show-detalle/${id}`)
    return ShowDetalle.fromJSON(showJSON)
  }

  // ============================================
  // GESTIÓN DE SHOWS (ADMIN)
  // ============================================

  async agregarNuevaFuncion(showId: string, nuevaFuncion: NuevaFuncionData): Promise<any> {
    const payload = {
      fecha: nuevaFuncion.fecha,
      hora: nuevaFuncion.hora + ':00',
      estado: 'PrecioBase',
    }
    return httpClient.post(`/show/${showId}/nueva-funcion`, payload)
  }

  async editarShow(id: string, newData: EditarShowData): Promise<any> {
    const payload = {
      nombreBanda: newData.nombreBanda,
      nombreRecital: newData.nombreShow,
    }
    return httpClient.patch(`/show/${id}`, payload)
  }

  async eliminarShow(id: string): Promise<any> {
    return httpClient.delete(`/show/${id}`)
  }

  // ============================================
  // CARRITO Y COMPRA
  // ============================================

  async agregarCarrito(
    userId: string,
    idShow: string,
    idEntrada: number,
    cantidad: number,
    ubicacion: Ubicacion
  ): Promise<any> {
    return httpClient.post(
      `/agregar-carrito/${userId}/${idShow}/${idEntrada}/${cantidad}/${ubicacion}`
    )
  }

  // ============================================
  // LISTA DE ESPERA
  // ============================================

  async sumarAListaEspera(showId: string, userId: string): Promise<void> {
    await httpClient.post(`/show/${showId}/fila-espera/${userId}`)
  }

  // ============================================
  // LOGGING
  // ============================================

  async registrarLogClick(idShow: string, idUsuario: string, payload: any): Promise<any> {
    return httpClient.post(`/show/${idShow}/log/${idUsuario}`, payload)
  }
}

// Exportar instancia única (singleton)
export const showService = new ShowService()
