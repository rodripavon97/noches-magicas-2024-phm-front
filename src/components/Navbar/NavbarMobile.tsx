import { Box, HStack, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { FaShoppingBasket, FaHome } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5';
import { theme } from '../../styles/styles';

interface NavbarMobileProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userAvatar: string;
  onNavigateHome: () => void;
  onNavigateCart: () => void;
  onNavigateProfile: () => void;
  onNavigateLogin: () => void;
  onLogout: () => void;
}

export const NavbarMobile = ({
  isLoggedIn,
  isAdmin,
  userAvatar,
  onNavigateHome,
  onNavigateCart,
  onNavigateProfile,
  onNavigateLogin,
  onLogout,
}: NavbarMobileProps) => {
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
          <NavbarMobileItem
            icon={<FaHome size={24} />}
            label="Home"
            onClick={onNavigateHome}
          />
        )}

        {/* Carrito */}
        {!isAdmin && isLoggedIn && (
          <NavbarMobileItem
            icon={<FaShoppingBasket size={24} />}
            label="Carrito"
            onClick={onNavigateCart}
          />
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
              <Avatar src={userAvatar} size="sm" mb={1} />
              <Text fontSize="xs">{isAdmin ? "Panel" : "Perfil"}</Text>
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
        ) : (
          <NavbarMobileItem
            icon={<IoPerson size={24} />}
            label="Ingresar"
            onClick={onNavigateLogin}
          />
        )}
      </HStack>
    </Box>
  );
};

// Componente auxiliar para items del navbar mobile
interface NavbarMobileItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const NavbarMobileItem = ({ icon, label, onClick }: NavbarMobileItemProps) => {
  return (
    <Box 
      onClick={onClick} 
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
      <Box mb={1}>{icon}</Box>
      <Text fontSize="xs">{label}</Text>
    </Box>
  );
};
