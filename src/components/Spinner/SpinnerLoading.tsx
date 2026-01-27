// ============================================
// COMPONENTE SPINNER LOADING
// ============================================

import { useState, ReactNode } from 'react'
import { Box, SimpleGrid, Spinner, Text } from '@chakra-ui/react'
import { useOnInit } from '../../hooks/useOnInit'
import { theme } from '../../styles/styles'

interface SpinnerLoadingProps {
  children: ReactNode
  delay?: number
}

/**
 * Componente de carga con spinner
 * RESPONSABILIDAD: Mostrar spinner mientras carga el contenido
 */
export const SpinnerLoading = ({ children, delay = 250 }: SpinnerLoadingProps) => {
  const [isLoading, setIsLoading] = useState(true)

  useOnInit(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, delay)

    return () => clearTimeout(timer)
  })

  if (isLoading) {
    return (
      <SimpleGrid height="100vh" placeItems="center">
        <Box alignItems="center" textAlign="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor={theme.colors.brand.colorFourth}
            color={theme.colors.brand.colorSecundary}
            size="xl"
          />
          <Text>Cargando...</Text>
        </Box>
      </SimpleGrid>
    )
  }

  return <>{children}</>
}
