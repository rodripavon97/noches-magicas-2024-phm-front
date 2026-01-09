import { Navigate, useRoutes } from 'react-router-dom'
import DashboardAdm from '../Pages/Dashboard/AdminPage'
// @ts-ignore
import Errores from '../Pages/Errores'
import BusquedaPage from '../Pages/Busqueda/Busqueda'
import LoginPage from "../Pages/Login/Login.js"
import UsuarioPage from '../Pages/Usuario/Usuario'
import CarritoPage from "../Pages/Carrito/Carrito"
import DetalleShowCompra from '../Pages/DetalleShowCompra/DetalleShowCompra'
import DetalleShowAdmin from '../Pages/DetalleAdminShow/DetalleShowAdmin'
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute'
import PublicRoute from '../components/PublicRoute/PublicRoute'


const PublicRoutes = [


  {
    path: '404',
    element: <Errores status="404" />,
  },
  {
    path: '401',
    element: <Errores status="401" />,
  },
  {
    path: '500',
    element: <Errores status="500" />,
  },
  {
    path: '*',
    element: <Navigate to="401" />,
  },

  {
    path: '/dashboardAdm',
    element: (
      <ProtectedRoute requireAdmin>
        <DashboardAdm />
      </ProtectedRoute>
    ),
  },

  {
    path: 'detalle-show/:id',
    element: (
      <ProtectedRoute>
        <DetalleShowCompra />
      </ProtectedRoute>
    ),
  },

  {
    path: 'detalle-show/admin/:id',
    element: (
      <ProtectedRoute requireAdmin>
        <DetalleShowAdmin />
      </ProtectedRoute>
    ),
  },



  {
    path: '/busqueda',
    element: <BusquedaPage />,
  },

  {
    path: '/',
    element: <Navigate to="/busqueda" />,
  },

  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },

  {
    path: '/usuario',
    element: (
      <ProtectedRoute>
        <UsuarioPage />
      </ProtectedRoute>
    ),
  },

  {
    path: '/carrito',
    element: (
      <ProtectedRoute>
        <CarritoPage />
      </ProtectedRoute>
    ),
  }
]

export default function Routes() {
  return useRoutes(PublicRoutes)
}
