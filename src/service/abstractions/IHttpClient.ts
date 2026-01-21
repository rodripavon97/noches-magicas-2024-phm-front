/**
 * Abstracción del cliente HTTP
 * Permite cambiar de axios a fetch u otra librería sin afectar a los servicios
 */

export interface IHttpClient {
  get<T>(url: string, config?: any): Promise<T>;
  post<T>(url: string, data?: any, config?: any): Promise<T>;
  put<T>(url: string, data?: any, config?: any): Promise<T>;
  patch<T>(url: string, data?: any, config?: any): Promise<T>;
  delete<T>(url: string, config?: any): Promise<T>;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  statusText: string;
}
