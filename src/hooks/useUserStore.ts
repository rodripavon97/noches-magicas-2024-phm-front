import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UsuarioJSON } from '../interface/interfaces';

// ============================================
// INTERFACES
// ============================================

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  fotoPerfil: string;
  username: string;
  esAdm: boolean;
  edad: number;
  saldo: number;
  dni: number;
}

export interface UserState {
  // Estado
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  userId: number | null;
  
  // Acciones
  login: (userData: UsuarioJSON) => void;
  logout: () => void;
  setUser: (userData: UsuarioJSON) => void;
  updateUser: (updates: Partial<User>) => void;
  updateSaldo: (nuevoSaldo: number) => void;
}

// ============================================
// HELPERS PRIVADOS
// ============================================

const parseUserFromLocalStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

const getUserIdFromLocalStorage = (): number | null => {
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId, 10) : null;
};

const isUserAdmin = (user: User | null): boolean => {
  if (!user) {
    const isAdmin = localStorage.getItem('isAdmin');
    return isAdmin === 'true';
  }
  return user.esAdm;
};

const mapUsuarioJSONToUser = (userData: UsuarioJSON): User => {
  return {
    id: userData.id,
    nombre: userData.nombre,
    apellido: userData.apellido,
    fechaNacimiento: userData.fechaNacimiento,
    fotoPerfil: userData.fotoPerfil,
    username: userData.username,
    esAdm: userData.esAdm,
    edad: userData.edad,
    saldo: userData.saldo,
    dni: userData.dni || userData.DNI || 0,
  };
};

// ============================================
// STORE
// ============================================

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        user: parseUserFromLocalStorage(),
        userId: getUserIdFromLocalStorage(),
        isLoggedIn: !!getUserIdFromLocalStorage(),
        isAdmin: isUserAdmin(parseUserFromLocalStorage()),
        
        // Login
        login: (userData: UsuarioJSON) => {
          const user = mapUsuarioJSONToUser(userData);
          
          localStorage.setItem('userId', String(user.id));
          localStorage.setItem('isAdmin', String(user.esAdm));
          localStorage.setItem('user', JSON.stringify(user));
          
          set({
            user,
            userId: user.id,
            isLoggedIn: true,
            isAdmin: user.esAdm,
          });
        },
        
        // Logout
        logout: () => {
          localStorage.removeItem('userId');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('user');
          
          set({
            user: null,
            userId: null,
            isLoggedIn: false,
            isAdmin: false,
          });
        },
        
        // Set User (actualización completa)
        setUser: (userData: UsuarioJSON) => {
          const user = mapUsuarioJSONToUser(userData);
          
          localStorage.setItem('userId', String(user.id));
          localStorage.setItem('isAdmin', String(user.esAdm));
          localStorage.setItem('user', JSON.stringify(user));
          
          set({
            user,
            isAdmin: user.esAdm,
          });
        },
        
        // Update User (actualización parcial)
        updateUser: (updates: Partial<User>) => {
          const currentUser = get().user;
          if (!currentUser) return;
          
          const updatedUser = { ...currentUser, ...updates };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          set({ user: updatedUser });
        },
        
        // Update Saldo
        updateSaldo: (nuevoSaldo: number) => {
          const currentUser = get().user;
          if (!currentUser) return;
          
          const updatedUser = { ...currentUser, saldo: nuevoSaldo };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          set({ user: updatedUser });
        },
      }),
      {
        name: 'user-storage',
        // Solo persistir datos necesarios
        partialize: (state) => ({
          user: state.user,
          userId: state.userId,
          isAdmin: state.isAdmin,
        }),
      }
    ),
    { name: 'UserStore' }
  )
);

// ============================================
// SELECTORES REUTILIZABLES
// ============================================

export const selectUser = (state: UserState) => state.user;
export const selectIsLoggedIn = (state: UserState) => state.isLoggedIn;
export const selectIsAdmin = (state: UserState) => state.isAdmin;
export const selectUserId = (state: UserState) => state.userId;
export const selectUserName = (state: UserState) => 
  state.user ? `${state.user.nombre} ${state.user.apellido}` : '';
export const selectUserAvatar = (state: UserState) => state.user?.fotoPerfil || '';
export const selectUserSaldo = (state: UserState) => state.user?.saldo || 0;

// ============================================
// DEFAULT EXPORT (para compatibilidad)
// ============================================

export default useUserStore;
