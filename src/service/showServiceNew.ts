/**
 * Servicio de gestión de shows
 */

import axios from 'axios';
import { REST_SERVER_URL } from './constant';
import { ShowJSON } from '../interface/interfaces';
import { ShowDetalle } from '../domain/detalleShow';

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

class ShowServiceNew {
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

    const response = await axios.get<ShowJSON[]>(`${REST_SERVER_URL}/shows?${queryParams}`);
    return response.data;
  }

  async getShowById(id: string): Promise<ShowJSON> {
    const response = await axios.get<any>(`${REST_SERVER_URL}/show-detalle/${id}`);
    return response.data;
  }

  async getShowDetail(id: string): Promise<ShowDetalle> {
    const response = await axios.get<any>(`${REST_SERVER_URL}/show-detalle/${id}`);
    return ShowDetalle.fromJSON(response.data);
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

    const response = await axios.get<ShowJSON[]>(`${REST_SERVER_URL}/admin/shows?${queryParams}`);
    const shows = response.data;
    
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
    const response = await axios.post<ShowJSON>(`${REST_SERVER_URL}/admin/shows`, showData);
    return response.data;
  }

  async updateShow(id: string, updates: EditarShowData): Promise<void> {
    const payload = {
      nombreBanda: updates.nombreBanda,
      nombreRecital: updates.nombreShow,
    };
    await axios.patch(`${REST_SERVER_URL}/show/${id}`, payload);
  }

  async deleteShow(id: string): Promise<void> {
    await axios.delete(`${REST_SERVER_URL}/show/${id}`);
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
    await axios.post(`${REST_SERVER_URL}/show/${showId}/nueva-funcion`, payload);
  }

  // ============================================
  // MÉTODOS DE LISTA DE ESPERA
  // ============================================

  async addToWaitingList(showId: string, userId: number): Promise<void> {
    await axios.post(`${REST_SERVER_URL}/show/${showId}/fila-espera/${userId}`);
  }

  // ============================================
  // MÉTODOS DE LOGGING
  // ============================================

  async registerClickLog(showId: string, userId: string, payload: any): Promise<void> {
    await axios.post(`${REST_SERVER_URL}/show/${showId}/log/${userId}`, payload);
  }
}

export const showServiceNew = new ShowServiceNew();
