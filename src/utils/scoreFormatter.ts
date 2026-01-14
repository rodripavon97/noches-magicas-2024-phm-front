/**
 * Utilidad para formatear puntuaciones
 * Responsabilidad única: formateo de puntuaciones
 */

export class ScoreFormatter {
  static formatScore(score: number | null, decimals: number = 2): string {
    if (score === null || score === undefined) {
      return 'N/A'
    }
    if (typeof score !== 'number') {
      return 'N/A'
    }
    return score.toFixed(decimals)
  }
}
