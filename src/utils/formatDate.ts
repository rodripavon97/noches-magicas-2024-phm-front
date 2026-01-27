// ============================================
// UTILIDAD DE FORMATO DE FECHA
// ============================================

import moment from 'moment'

/**
 * Formatea una fecha usando moment.js
 * @param date - Fecha a formatear
 * @param toFormat - Formato de salida (default: 'DD/MM/YYYY')
 * @param fromFormat - Formato de entrada (opcional)
 * @returns Fecha formateada o null si es inválida
 */
export function formatDate(
  date: string | Date | null | undefined,
  toFormat: string = 'DD/MM/YYYY',
  fromFormat?: string
): string | null {
  if (!date) return null

  const dateValue = moment(date, fromFormat)
  
  if (dateValue.isValid() && dateValue.format(toFormat) !== 'Invalid date') {
    return dateValue.format(toFormat)
  }

  return null
}

export default formatDate
