// ============================================
// SERVICIO DE LOGGING - Capa de Negocio
// ============================================

import { showService } from './showService'

/**
 * Servicio de Logging
 * RESPONSABILIDAD: Registro de eventos de usuario
 */
class LoggingService {
  async registrarClickEnShow(showId: string, ubicacion: string): Promise<void> {
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

// Exportar instancia única (singleton)
export const loggingService = new LoggingService()
