/**
 * Factory para crear instancias de servicios
 * Implementa el patrón Factory y Singleton
 * Facilita la inyección de dependencias
 */

import { AxiosHttpClient } from './infrastructure/AxiosHttpClient';
import { UserService } from './refactored/UserService.refactored';
import { ShowService } from './refactored/ShowService.refactored';
import { IHttpClient } from './abstractions/IHttpClient';

class ServiceFactory {
  private static instance: ServiceFactory;
  private httpClient: IHttpClient;
  private _userService: UserService | null = null;
  private _showService: ShowService | null = null;

  private constructor() {
    // Crear instancia única del cliente HTTP
    this.httpClient = new AxiosHttpClient();
  }

  public static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  // Getters para servicios (Singleton)
  get userService(): UserService {
    if (!this._userService) {
      this._userService = new UserService(this.httpClient);
    }
    return this._userService;
  }

  get showService(): ShowService {
    if (!this._showService) {
      this._showService = new ShowService(this.httpClient);
    }
    return this._showService;
  }

  // Método para crear un cliente HTTP personalizado (útil para testing)
  public setHttpClient(client: IHttpClient): void {
    this.httpClient = client;
    // Resetear servicios para que usen el nuevo cliente
    this._userService = null;
    this._showService = null;
  }
}

// Exportar instancia única
export const serviceFactory = ServiceFactory.getInstance();

// Exportar servicios para uso directo
export const userServiceRefactored = serviceFactory.userService;
export const showServiceRefactored = serviceFactory.showService;
