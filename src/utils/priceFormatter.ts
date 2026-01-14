/**
 * Utilidad para formatear precios
 * Responsabilidad única: formateo de precios y montos
 */

export class PriceFormatter {
  static formatPrice(price: number): string {
    return `$${price.toLocaleString()}`
  }

  static formatPriceRange(min: number, max: number): string {
    return `${this.formatPrice(min)} - ${this.formatPrice(max)}`
  }
}
