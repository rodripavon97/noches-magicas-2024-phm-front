// ============================================
// COMPONENTE PUBLIC ROUTE - Ruta Pública
// ============================================

import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks'

export interface PublicRouteProps {
  children: React.ReactNode
}

/**
 * Componente de Ruta Pública
 * RESPONSABILIDAD: Proteger rutas que solo deben acceder usuarios no autenticados
 * Redirige a dashboard si ya está logueado
 */
const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isLoggedIn, isAdmin } = useAuth()

  // Si ya está logueado, redirigir según su rol
  if (isLoggedIn) {
    return <Navigate to={isAdmin ? '/dashboardAdm' : '/busqueda'} replace />
  }

  // Si no está logueado, permitir acceso
  return <>{children}</>
}

export default PublicRoute

