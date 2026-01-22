import { showServiceNew as showService } from './showServiceNew'

/**
 * Servicio para manejar el registro de logs
 * Responsabilidad única: registro de eventos de usuario
 */
export class LoggingService {
  static async registrarClickEnShow(showId: string, ubicacion: string): Promise<void> {
    const usuarioString = localStorage.getItem('user')
    if (!usuarioString) {
      return
    }
    
    const usuario = JSON.parse(usuarioString)
    const logData = {
      fecha: new Date().toISOString(),
      nombreAlojamiento: ubicacion,
      hora: new Date().toLocaleTimeString(),
      usuario: usuario,
    }
    
    await showService.registrarLogClick(showId, usuario.id, logData)
  }
}
