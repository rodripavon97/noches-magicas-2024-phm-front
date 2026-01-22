/**
 * Servicio de autenticación
 */

import axios from 'axios';
import { REST_SERVER_URL } from './constant';
import { LoginDTO, UsuarioJSON } from '../interface/interfaces';

class AuthService {
  private readonly USER_ID_KEY = 'userId';
  private readonly IS_ADMIN_KEY = 'isAdmin';
  private readonly USER_FOTO_KEY = 'userFotoPerfil';
  private readonly NOMBRE_APELLIDO_KEY = 'nombreApellido';
  private readonly USER_KEY = 'user';

  // ============================================
  // MÉTODOS DE AUTENTICACIÓN
  // ============================================

  async login(credentials: LoginDTO): Promise<UsuarioJSON> {
    const response = await axios.post<UsuarioJSON>(`${REST_SERVER_URL}/usuario-logueado`, credentials);
    const user = response.data;
    
    // Guardar información del usuario en localStorage
    this.saveUserToStorage(user);
    
    return user;
  }

  async logout(): Promise<void> {
    this.clearUserFromStorage();
  }

  async getCurrentUser(): Promise<UsuarioJSON | null> {
    const userId = this.getUserId();
    
    if (!userId) {
      return null;
    }

    // Sin try-catch: el error se propaga al componente/hook
    const response = await axios.get<UsuarioJSON>(`${REST_SERVER_URL}/user/${userId}`);
    return response.data;
  }

  isAuthenticated(): boolean {
    return !!this.getUserId();
  }

  // ============================================
  // MÉTODOS DE STORAGE (privados)
  // ============================================

  private saveUserToStorage(user: UsuarioJSON): void {
    try {
      const userClean = {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        fechaNacimiento: user.fechaNacimiento,
        fotoPerfil: user.fotoPerfil,
        username: user.username,
        esAdm: user.esAdm,
        edad: user.edad,
        saldo: user.saldo,
        dni: user.dni || user.DNI || 0,
      };

      localStorage.setItem(this.USER_ID_KEY, String(userClean.id));
      localStorage.setItem(this.IS_ADMIN_KEY, String(userClean.esAdm));
      localStorage.setItem(this.USER_FOTO_KEY, userClean.fotoPerfil);
      localStorage.setItem(this.NOMBRE_APELLIDO_KEY, `${userClean.nombre} ${userClean.apellido}`);
      localStorage.setItem(this.USER_KEY, JSON.stringify(userClean));
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  }

  private clearUserFromStorage(): void {
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.IS_ADMIN_KEY);
    localStorage.removeItem(this.USER_FOTO_KEY);
    localStorage.removeItem(this.NOMBRE_APELLIDO_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // ============================================
  // MÉTODOS AUXILIARES
  // ============================================

  getUserId(): number | null {
    const userId = localStorage.getItem(this.USER_ID_KEY);
    return userId ? Number(userId) : null;
  }

  isAdmin(): boolean {
    return localStorage.getItem(this.IS_ADMIN_KEY) === 'true';
  }

  getUserFromStorage(): UsuarioJSON | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as UsuarioJSON;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
