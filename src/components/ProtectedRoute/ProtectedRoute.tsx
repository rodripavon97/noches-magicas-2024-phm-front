// ============================================
// COMPONENTE PROTECTED ROUTE - Ruta Protegida
// ============================================

import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks'

export interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

/**
 * Componente de Ruta Protegida
 * RESPONSABILIDAD: Proteger rutas que requieren autenticación
 * Opcionalmente requiere permisos de administrador
 */
const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isLoggedIn, isAdmin } = useAuth()

  // Si requiere admin y no es admin, redirigir a 401
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/401" replace />
  }

  // Si requiere login y no está logueado, redirigir a login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  // Si pasa todas las validaciones, renderizar el componente
  return <>{children}</>
}

export default ProtectedRoute

