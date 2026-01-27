// ============================================
// COMPONENTE CARD LOGIN - UI Pura
// ============================================

import { useState } from 'react'
import { Center, Text, Input, Button, VStack, Container } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useUsuario } from '../../hooks/useUsuario'
import { useToast } from '../../hooks/useToast'
import { validateLoginForm, LoginForm } from '../../validations'
import { getErrorMessage } from '../../errors'
import { theme } from '../../styles/styles'

/**
 * Card de Login
 * RESPONSABILIDAD: Solo UI - renderizar formulario de login
 * NO tiene lógica de negocio, usa hooks para todo
 */
const CardLoginShow = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const { login } = useAuth()
  const { usuario } = useUsuario()
  const toast = useToast()

  /**
   * Handler del login
   * Validaciones y lógica delegadas a hooks
   */
  const handleLogin = async () => {
    // Validar formulario
    const form: LoginForm = { username, password }
    const validation = validateLoginForm(form)

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0]
      toast.error(firstError)
      return
    }

    // Realizar login
    setLoading(true)
    try {
      await login(username, password)
      toast.success('Login exitoso')
      
      // Navegar según rol (se obtiene del store después del login)
      setTimeout(() => {
        navigate(usuario?.esAdm ? '/dashboardAdm' : '/busqueda')
      }, 100)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handler para Enter key
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <Center h="80vh">
      <Container bg={theme.colors.brand.colorPrimary} p={8} borderRadius="md">
        <VStack spacing={4} alignItems="left">
          <Text
            alignSelf="center"
            fontSize="50"
            fontWeight="bold"
            fontStyle="italic"
            textShadow="5px 5px black"
          >
            Noches Mágicas
          </Text>

          <Text>Usuario</Text>
          <Input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            isDisabled={loading}
          />

          <Text>Contraseña</Text>
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            isDisabled={loading}
          />

          <Button
            w="15%"
            alignSelf="center"
            mt="5"
            p="5"
            bg={theme.colors.brand.colorFourth}
            onClick={handleLogin}
            isLoading={loading}
            loadingText="Ingresando..."
          >
            Ingresar
          </Button>
        </VStack>
      </Container>
    </Center>
  )
}

export default CardLoginShow
