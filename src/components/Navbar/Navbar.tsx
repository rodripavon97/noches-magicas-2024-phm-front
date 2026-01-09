import { useState, useEffect } from 'react'
import { Box, HStack, Text, Link, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Button, IconButton } from '@chakra-ui/react'
import { theme } from '../../styles/styles'
import { IoPerson } from 'react-icons/io5'
import { FaShoppingBasket } from 'react-icons/fa'
import UseUser from '../../hooks/useUser.jsx'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { isLoggedIn, user, logout, isAdmin } = UseUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [user])


  const handleNavigateCarrito = () => {
    navigate('/carrito')
  }

  const handleNavigateBusqueda = () => {
    navigate('/')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleNavigate = () => {
    if (isAdmin) {
      navigate('/dashboardAdm')
    } else {
      navigate('/usuario')
    }
  }

  return (
    <Box
      bgColor={theme.colors.brand.colorThrird}
      style={{ boxShadow: '1px 1px 5px 0px rgba(0,0,0,0.75)' }}
      color="white"
      w="100%"
      p={4}
    >
      <HStack>
        <Text fontFamily={theme.fonts.body} fontSize="35" fontWeight={600}>
          Noches Mágicas
        </Text>
        <HStack spacing={4} ml="auto" alignItems="center">
          {!isAdmin ? (<Link onClick={handleNavigateBusqueda}>Home</Link>) : (<> </>)}
          {!isLoggedIn ? (
            <Link href="/login" display="flex" alignItems="center">
              <IoPerson fontWeight={10} />
              Ingresar
            </Link>
          ) : (
            <Menu>
              {!isAdmin ? (<Link onClick={handleNavigateCarrito}>{<IconButton colorScheme='white' variant='ghost' icon={<FaShoppingBasket />} aria-label='Carrito' />}</Link>) : (<></>)}
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
                bgColor={theme.colors.brand.colorThrird}>
                <HStack>
                  <Avatar
                    src={user.fotoPerfil}
                    size="md"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  />
                  <Text color={'white'} fontSize='2xl'>{user.nombre} {user.apellido}</Text>
                </HStack>
              </MenuButton>
              <MenuList bgColor={theme.colors.brand.colorThrird}>
                <MenuItem bgColor={theme.colors.brand.colorThrird} onClick={handleNavigate}>
                  {isAdmin ? "Dashboard" : "Perfil"}
                </MenuItem>
                <MenuDivider />
                <MenuItem bgColor={theme.colors.brand.colorThrird} onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </HStack>
    </Box>
  )
}

export default Navbar
