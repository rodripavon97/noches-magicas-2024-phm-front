import { Box, HStack, Text, Link, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Button, IconButton } from '@chakra-ui/react';
import { IoPerson } from 'react-icons/io5';
import { FaShoppingBasket } from 'react-icons/fa';
import { theme } from '../../styles/styles';

interface NavbarDesktopProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userName: string;
  userAvatar: string;
  onNavigateHome: () => void;
  onNavigateCart: () => void;
  onNavigateProfile: () => void;
  onLogout: () => void;
}

export const NavbarDesktop = ({
  isLoggedIn,
  isAdmin,
  userName,
  userAvatar,
  onNavigateHome,
  onNavigateCart,
  onNavigateProfile,
  onLogout,
}: NavbarDesktopProps) => {
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
          {!isAdmin && (
            <Link onClick={onNavigateHome}>Home</Link>
          )}
          
          {!isLoggedIn ? (
            <Link href="/login" display="flex" alignItems="center">
              <IoPerson fontWeight={10} />
              Ingresar
            </Link>
          ) : (
            <Menu>
              {!isAdmin && (
                <Link onClick={onNavigateCart}>
                  <IconButton 
                    colorScheme='white' 
                    variant='ghost' 
                    icon={<FaShoppingBasket />} 
                    aria-label='Carrito' 
                  />
                </Link>
              )}
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
                bgColor={theme.colors.brand.colorThrird}
              >
                <HStack>
                  <Avatar src={userAvatar} size="md" />
                  <Text color={'white'} fontSize='2xl'>
                    {userName}
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList bgColor={theme.colors.brand.colorThrird}>
                <MenuItem 
                  bgColor={theme.colors.brand.colorThrird} 
                  onClick={onNavigateProfile}
                >
                  {isAdmin ? "Dashboard" : "Perfil"}
                </MenuItem>
                <MenuDivider />
                <MenuItem 
                  bgColor={theme.colors.brand.colorThrird} 
                  onClick={onLogout}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};
