import { useBreakpointValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useUserStore, selectIsLoggedIn, selectIsAdmin, selectUserName, selectUserAvatar } from '../../hooks/useUserStore';
import { NavbarMobile } from './NavbarMobile';
import { NavbarDesktop } from './NavbarDesktop';

/**
 * Navbar refactorizado siguiendo principios SOLID:
 * - SRP: Separado en NavbarMobile y NavbarDesktop
 * - OCP: Extensible mediante props
 * - DIP: Depende de abstracciones (hooks)
 */
const Navbar = () => {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Selectores específicos para evitar re-renders innecesarios
  const isLoggedIn = useUserStore(selectIsLoggedIn);
  const isAdmin = useUserStore(selectIsAdmin);
  const userName = useUserStore(selectUserName);
  const userAvatar = useUserStore(selectUserAvatar);
  const logout = useUserStore(state => state.logout);

  // Handlers de navegación
  const handleNavigateHome = () => navigate('/');
  const handleNavigateCart = () => navigate('/carrito');
  const handleNavigateLogin = () => navigate('/login');
  const handleNavigateProfile = () => {
    navigate(isAdmin ? '/dashboardAdm' : '/usuario');
  };
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navbarProps = {
    isLoggedIn,
    isAdmin,
    userName,
    userAvatar,
    onNavigateHome: handleNavigateHome,
    onNavigateCart: handleNavigateCart,
    onNavigateProfile: handleNavigateProfile,
    onNavigateLogin: handleNavigateLogin,
    onLogout: handleLogout,
  };

  // Renderizado condicional según viewport
  return isMobile ? (
    <NavbarMobile {...navbarProps} />
  ) : (
    <NavbarDesktop {...navbarProps} />
  );
};

export default Navbar;
