// @ts-nocheck
import { Box, Button, Container, Image, Text } from '@chakra-ui/react'
import { IoArrowBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import img404 from '../../assets/errors/error-404.png'
import img500 from '../../assets/errors/error-500.png'
import img401 from '../../assets/errors/error-401.png'
import { useTranslation } from 'react-i18next'

const IMAGE_MAP = {
  401: img401,
  404: img404,
  500: img500,
}

interface ErrorPageProps {
  status: string
}

function ErrorPage({ status }: ErrorPageProps) {
  const navigate = useNavigate()
  const img = IMAGE_MAP[status]
  const { t } = useTranslation('errors', { keyPrefix: status })

  const goToLogin = () => {
    if (status === '401') {
      navigate('/')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      display="flex"
      flexGrow={1}
      minHeight="100vh"
      my={2}
    >
      <Container maxW="md">
        <Box alignItems="center" display="flex" flexDirection="column">
          <Box mb={3} textAlign="center">
            <Image alt="Under development" src={img} maxW="100%" w={400} />
          </Box>
          <Text align="center" mb={3} fontSize="3xl">
            {t('title')}
          </Text>
          <Text align="center" color="gray.600" fontSize="md">
            {t('description')}
          </Text>
          <Button onClick={goToLogin} leftIcon={<IoArrowBack />} mt={3}>
            {t('goBackButton')}
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default ErrorPage
