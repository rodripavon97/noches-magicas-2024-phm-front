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
import Layout from '../components/Layout/Layout'


const PublicRoutes = [


  {
    path: '404',
    element: (
      <Layout>
        <Errores status="404" />
      </Layout>
    ),
  },
  {
    path: '401',
    element: (
      <Layout>
        <Errores status="401" />
      </Layout>
    ),
  },
  {
    path: '500',
    element: (
      <Layout>
        <Errores status="500" />
      </Layout>
    ),
  },
  {
    path: '*',
    element: <Navigate to="401" />,
  },

  {
    path: '/dashboardAdm',
    element: (
      <Layout>
        <ProtectedRoute requireAdmin>
          <DashboardAdm />
        </ProtectedRoute>
      </Layout>
    ),
  },

  {
    path: 'detalle-show/:id',
    element: (
      <Layout>
        <ProtectedRoute>
          <DetalleShowCompra />
        </ProtectedRoute>
      </Layout>
    ),
  },

  {
    path: 'detalle-show/admin/:id',
    element: (
      <Layout>
        <ProtectedRoute requireAdmin>
          <DetalleShowAdmin />
        </ProtectedRoute>
      </Layout>
    ),
  },



  {
    path: '/busqueda',
    element: (
      <Layout>
        <BusquedaPage />
      </Layout>
    ),
  },

  {
    path: '/',
    element: <Navigate to="/busqueda" />,
  },

  {
    path: '/login',
    element: (
      <Layout showNavbar={false}>
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      </Layout>
    ),
  },

  {
    path: '/usuario',
    element: (
      <Layout>
        <ProtectedRoute>
          <UsuarioPage />
        </ProtectedRoute>
      </Layout>
    ),
  },

  {
    path: '/carrito',
    element: (
      <Layout>
        <ProtectedRoute>
          <CarritoPage />
        </ProtectedRoute>
      </Layout>
    ),
  }
]

export default function Routes() {
  return useRoutes(PublicRoutes)
}
