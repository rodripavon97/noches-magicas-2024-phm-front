/**
 * Utilidades de validación
 * Responsabilidad única: validación de datos
 */

export class Validators {
  static isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime())
  }

  static isPositiveNumber(value: any): boolean {
    return typeof value === 'number' && value > 0 && !isNaN(value)
  }

  static isNonEmptyString(value: any): boolean {
    return typeof value === 'string' && value.trim().length > 0
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static isValidArray<T>(arr: any): arr is T[] {
    return Array.isArray(arr) && arr.length > 0
  }

  static ensureDate(value: Date | string | null | undefined): Date {
    if (value instanceof Date) {
      return value
    }
    if (typeof value === 'string') {
      const date = new Date(value)
      if (this.isValidDate(date)) {
        return date
      }
    }
    throw new Error(`Invalid date value: ${value}`)
  }
}
