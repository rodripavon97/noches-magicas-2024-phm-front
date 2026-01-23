import { useState, useEffect } from 'react'
import { Box, HStack, Text, Link, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Button, IconButton, useBreakpointValue } from '@chakra-ui/react'
import { theme } from '../../styles/styles'
import { IoPerson } from 'react-icons/io5'
import { FaShoppingBasket, FaHome } from 'react-icons/fa'
import UseUser from '../../hooks/useUser'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { isLoggedIn, user, logout, isAdmin } = UseUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  
  // Suscripción explícita al store para forzar re-render
  const [userDisplayName, setUserDisplayName] = useState('')
  
  useEffect(() => {
    if (user && user.nombre && user.apellido) {
      const displayName = `${user.nombre} ${user.apellido}`
      setUserDisplayName(displayName)
    }
  }, [user, user?.nombre, user?.apellido, user?._updated])

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

  const isMobile = useBreakpointValue({ base: true, md: false })

  // Vista mobile: barra de navegación inferior
  if (isMobile) {
    return (
      <Box
        bgColor={theme.colors.brand.colorThrird}
        color="white"
        w="100%"
        boxShadow="0 -2px 10px rgba(0,0,0,0.3)"
      >
        <HStack 
          spacing={0} 
          justifyContent="space-around" 
          alignItems="stretch"
          h="70px"
        >
          {/* Home */}
          {!isAdmin && (
            <Box 
              onClick={handleNavigateBusqueda} 
              cursor="pointer"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              flex="1"
              h="100%"
              py={2}
              _hover={{ bg: 'rgba(255,255,255,0.1)' }}
            >
              <Box mb={1}>
                <FaHome size={24} />
              </Box>
              <Text fontSize="xs">Home</Text>
            </Box>
          )}

          {/* Carrito */}
          {!isAdmin && isLoggedIn && (
            <Box 
              onClick={handleNavigateCarrito} 
              cursor="pointer"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              flex="1"
              h="100%"
              py={2}
              _hover={{ bg: 'rgba(255,255,255,0.1)' }}
            >
              <Box mb={1}>
                <FaShoppingBasket size={24} />
              </Box>
              <Text fontSize="xs">Carrito</Text>
            </Box>
          )}

          {/* Perfil / Dashboard / Login */}
          {isLoggedIn ? (
            <Menu>
              <MenuButton
                as={Box}
                cursor="pointer"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                flex="1"
                h="100%"
                py={2}
                _hover={{ bg: 'rgba(255,255,255,0.1)' }}
              >
                <Avatar
                  src={user.fotoPerfil}
                  size="sm"
                  mb={1}
                />
                <Text fontSize="xs">{isAdmin ? "Panel" : "Perfil"}</Text>
              </MenuButton>
              <MenuList bgColor={theme.colors.brand.colorThrird}>
                <MenuItem bgColor={theme.colors.brand.colorThrird} onClick={handleNavigate}>
                  {isAdmin ? "Dashboard" : "Perfil"}
                </MenuItem>
                <MenuDivider />
                <MenuItem bgColor={theme.colors.brand.colorThrird} onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Box 
              onClick={() => navigate('/login')} 
              cursor="pointer"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              flex="1"
              h="100%"
              py={2}
              _hover={{ bg: 'rgba(255,255,255,0.1)' }}
            >
              <Box mb={1}>
                <IoPerson size={24} />
              </Box>
              <Text fontSize="xs">Ingresar</Text>
            </Box>
          )}
        </HStack>
      </Box>
    )
  }

  // Vista desktop: barra superior original
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
                  <Text color={'white'} fontSize='2xl'>
                    {userDisplayName || `${user.nombre || ''} ${user.apellido || ''}`}
                  </Text>
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
