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
      position="fixed"
      bottom="0"
      w="100%"
      zIndex="100"
      p="1rem"
      h="6vh"
    >
      <FaFacebook />
      <Box>
        <b>Noches Mágicas</b> / 2024
      </Box>
    </Flex>
  )
}

export default Footer
