// ============================================
// UTILIDAD DE FORMATO DE HORA
// ============================================

import moment from 'moment'

/**
 * Formatea una hora usando moment.js
 * @param time - Hora a formatear
 * @param toFormat - Formato de salida (default: 'HH:mm')
 * @param fromFormat - Formato de entrada (default: 'HH:mm:ss')
 * @returns Hora formateada o null si es inválida
 */
export function formatTime(
  time: string | null | undefined,
  toFormat: string = 'HH:mm',
  fromFormat: string = 'HH:mm:ss'
): string | null {
  if (!time) return null

  const timeValue = moment(time, fromFormat)
  
  if (timeValue.isValid() && timeValue.format(toFormat) !== 'Invalid date') {
    return timeValue.format(toFormat)
  }

  return null
}

export default formatTime
