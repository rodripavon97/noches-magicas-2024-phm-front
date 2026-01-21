import { Box, Spinner, Text, VStack } from '@chakra-ui/react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullScreen?: boolean
}

export function LoadingSpinner({ 
  message = 'Cargando...', 
  size = 'xl',
  fullScreen = false
}: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="blackAlpha.600"
        zIndex={9999}
      >
        <VStack spacing={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size={size}
          />
          {message && (
            <Text color="white" fontSize="lg" fontWeight="medium">
              {message}
            </Text>
          )}
        </VStack>
      </Box>
    )
  }

  return (
    <VStack spacing={3} py={8}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size={size}
      />
      {message && (
        <Text color="gray.600" fontSize="md">
          {message}
        </Text>
      )}
    </VStack>
  )
}
