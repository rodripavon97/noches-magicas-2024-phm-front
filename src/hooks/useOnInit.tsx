// ============================================
// HOOK ON INIT
// ============================================

import { useEffect, useRef } from 'react'

/**
 * Hook que ejecuta una función solo una vez al montar el componente
 * Similar a componentDidMount en componentes de clase
 */
export function useOnInit(callback: () => void | Promise<void>): void {
  const hasRun = useRef(false)

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true
      const result = callback()
      
      // Si el callback es async, manejar la promesa
      if (result instanceof Promise) {
        result.catch((error) => {
          // Error silencioso - el componente debe manejar errores
        })
      }
    }
  }, [])
}
