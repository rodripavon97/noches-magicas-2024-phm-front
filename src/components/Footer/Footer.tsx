import { Box, Flex } from '@chakra-ui/react'
import { FaFacebook } from 'react-icons/fa6'
import { theme } from '../../styles/styles'

export const Footer = () => {
  return (
    <Flex
      as="footer"
      fontSize="1rem"
      bgColor={theme.colors.brand.colorThrird}
      color={theme.colors.brand.colorPrimary}
      justifyContent="center"
      alignItems="center"
      gap="1rem"
      w="100%"
      p="1rem"
      mt="auto"
      minH="60px"
    >
      <FaFacebook />
      <Box>
        <b>Noches Mágicas</b> / 2024
      </Box>
    </Flex>
  )
}

export default Footer
