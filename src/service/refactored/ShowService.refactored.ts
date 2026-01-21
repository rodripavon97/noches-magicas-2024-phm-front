/**
 * Servicio de shows refactorizado siguiendo principios SOLID:
 * - SRP: Responsabilidad única (gestión de shows)
 * - DIP: Depende de abstracciones (IHttpClient, IShowService)
 */

import { IHttpClient } from '../abstractions/IHttpClient';
import { IShowService } from '../../types/services';
import { ShowJSON, Ubicacion } from '../../interface/interfaces';
import { Show } from '../../domain/Show';
import { ShowDetalle } from '../../domain/detalleShow';

export interface GetShowsParams {
  artista?: string;
  location?: string;
  conAmigos?: boolean;
  userId?: number;
}

export interface GetShowsAdminParams {
  artista?: string;
  location?: string;
  userId?: number;
}

export interface NuevaFuncionData {
  fecha: string;
  hora: string;
}

export interface EditarShowData {
  nombreBanda: string;
  nombreShow: string;
}

export class ShowService implements IShowService {
  constructor(private httpClient: IHttpClient) {}

  // ============================================
  // MÉTODOS DE CONSULTA
  // ============================================

  async getShows(params: GetShowsParams = {}): Promise<ShowJSON[]> {
    const { artista = '', location = '', conAmigos = false, userId } = params;
    const queryParams = new URLSearchParams({
      artista,
      locacion: location,
      id: String(userId || ''),
      conAmigos: String(conAmigos),
    });

    return this.httpClient.get<ShowJSON[]>(`/shows?${queryParams}`);
  }

  async getShowById(id: string): Promise<ShowJSON> {
    const showDetalle = await this.httpClient.get<any>(`/show-detalle/${id}`);
    return showDetalle;
  }

  async getShowDetail(id: string): Promise<ShowDetalle> {
    const showJSON = await this.httpClient.get<any>(`/show-detalle/${id}`);
    return ShowDetalle.fromJSON(showJSON);
  }

  async searchShows(query: string): Promise<ShowJSON[]> {
    return this.getShows({ artista: query });
  }

  async getShowsByLocation(location: string): Promise<ShowJSON[]> {
    return this.getShows({ location });
  }

  // ============================================
  // MÉTODOS DE ADMINISTRACIÓN
  // ============================================

  async getShowsAdmin(params: GetShowsAdminParams = {}): Promise<ShowJSON[]> {
    const { artista = '', location = '', userId } = params;
    const queryParams = new URLSearchParams({
      artista,
      locacion: location,
      id: String(userId || ''),
    });

    const shows = await this.httpClient.get<ShowJSON[]>(`/admin/shows?${queryParams}`);
    
    // Asegurar que los campos opcionales existan para evitar errores
    return shows.map(show => ({
      ...show,
      fecha: show.fecha || [],
      hora: show.hora || [],
      amigosQueVanAlShow: show.amigosQueVanAlShow || [],
      precioEntrada: show.precioEntrada ?? 0,
      estaAbierto: show.estaAbierto ?? false,
      // Campos de admin
      ventas: show.ventas ?? 0,
      rentabilidad: show.rentabilidad ?? 0,
      personasEnEspera: show.personasEnEspera ?? 0,
      souldOut: show.souldOut ?? 0,
      puedeAgregarFuncion: show.puedeAgregarFuncion ?? true,
    }));
  }

  async createShow(showData: Partial<ShowJSON>): Promise<ShowJSON> {
    return this.httpClient.post<ShowJSON>('/admin/shows', showData);
  }

  async updateShow(id: string, updates: EditarShowData): Promise<void> {
    const payload = {
      nombreBanda: updates.nombreBanda,
      nombreRecital: updates.nombreShow,
    };
    await this.httpClient.patch(`/show/${id}`, payload);
  }

  async deleteShow(id: string): Promise<void> {
    await this.httpClient.delete(`/show/${id}`);
  }

  // ============================================
  // MÉTODOS DE FUNCIONES
  // ============================================

  async addNewFunction(showId: string, functionData: NuevaFuncionData): Promise<void> {
    const payload = {
      fecha: functionData.fecha,
      hora: functionData.hora + ':00',
      estado: 'PrecioBase',
    };
    await this.httpClient.post(`/show/${showId}/nueva-funcion`, payload);
  }

  // ============================================
  // MÉTODOS DE LISTA DE ESPERA
  // ============================================

  async addToWaitingList(showId: string, userId: number): Promise<void> {
    await this.httpClient.post(`/show/${showId}/fila-espera/${userId}`);
  }

  // ============================================
  // MÉTODOS DE LOGGING
  // ============================================

  async registerClickLog(showId: string, userId: string, payload: any): Promise<void> {
    await this.httpClient.post(`/show/${showId}/log/${userId}`, payload);
  }
}
