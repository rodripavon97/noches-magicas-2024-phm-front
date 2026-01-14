/**
 * Utilidad para formatear fechas
 * Responsabilidad única: formateo de fechas
 */

export class DateFormatter {
  static formatToShortDate(date: Date | string): string {
    const parsedDate = new Date(date)
    const day = parsedDate.getDate().toString().padStart(2, '0')
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0')
    return `${day}/${month}`
  }

  static formatToFullDate(date: Date | string): string {
    const parsedDate = new Date(date)
    const day = parsedDate.getDate().toString().padStart(2, '0')
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0')
    const year = parsedDate.getFullYear()
    return `${day}/${month}/${year}`
  }

  static formatToInputDate(date: Date | string): string {
    const parsedDate = new Date(date)
    return parsedDate.toISOString().split('T')[0]
  }
}
