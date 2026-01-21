import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import UseUser from '../../hooks/useUser'

export interface ProtectedRouteProps {
  children: React.ReactNode,
  requireAdmin?: boolean
}
const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isLoggedIn, isAdmin } = UseUser()

  // Si requiere admin y no es admin, redirigir a 401
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/401" replace />
  }

  // Si requiere login y no está logueado, redirigir a login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  // Si pasa todas las validaciones, renderizar el componente
  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool,
}

export default ProtectedRoute

