import { Navigate } from 'react-router-dom'
import UseUser from '../../hooks/useUser'

export interface PublicRouteProps {
  children: React.ReactNode
}
const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isLoggedIn, isAdmin } = UseUser()

  // Si ya está logueado, redirigir según su rol
  if (isLoggedIn) {
    return <Navigate to={isAdmin ? "/dashboardAdm" : "/busqueda"} replace />
  }

  // Si no está logueado, permitir acceso
  return children
}

export default PublicRoute

