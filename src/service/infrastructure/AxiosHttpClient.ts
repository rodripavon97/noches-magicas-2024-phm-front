/**
 * Implementación concreta del cliente HTTP usando Axios
 * Siguiendo el principio DIP
 */

import axios, { AxiosInstance } from 'axios';
import { IHttpClient } from '../abstractions/IHttpClient';
import { REST_SERVER_URL } from '../constant';

export class AxiosHttpClient implements IHttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string = REST_SERVER_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para manejo de errores
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('HTTP Error:', error);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}
