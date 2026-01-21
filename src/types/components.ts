/**
 * Types para componentes reutilizables
 * Siguiendo el principio ISP (Interface Segregation Principle)
 */

import { Show } from '../domain/Show';
import { UsuarioAmigos } from '../domain/UserAmigos';

// ============================================
// BUTTON TYPES
// ============================================

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// ============================================
// CARD TYPES
// ============================================

export interface CardShowProps {
  show: Show;
  mostrarCantidadEntrada?: boolean;
  estaEnPerfil?: boolean;
  onComentarioPublicado?: () => void;
}

export interface CardImageProps {
  src: string;
  alt: string;
  showQuantityBadge?: boolean;
  quantity?: number;
}

export interface CardHeaderProps {
  bandName: string;
  showName: string;
  score: number | null;
  totalComments: number;
}

export interface CardLocationProps {
  location: string;
  dates: Date[];
}

export interface CardFriendsProps {
  friends: UsuarioAmigos[];
}

export interface CardActionsProps {
  isProfileView: boolean;
  isShowOpen: boolean;
  pricePaid?: number;
  priceMin?: number;
  priceMax?: number;
  onBuyClick?: () => void;
  commentButton?: React.ReactNode;
}

// ============================================
// NAVBAR TYPES
// ============================================

export interface NavbarProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userName: string;
  userAvatar: string;
  onNavigateHome: () => void;
  onNavigateCart: () => void;
  onNavigateProfile: () => void;
  onNavigateLogin?: () => void;
  onLogout: () => void;
}

export interface NavbarMobileProps extends NavbarProps {
  onNavigateLogin: () => void;
}

export interface NavbarDesktopProps extends Omit<NavbarProps, 'onNavigateLogin'> {}

export interface NavbarMobileItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

// ============================================
// FORM TYPES
// ============================================

export interface FormFieldProps<T> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface TextInputProps extends FormFieldProps<string> {
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
}

export interface NumberInputProps extends FormFieldProps<number> {
  min?: number;
  max?: number;
  step?: number;
}

// ============================================
// MODAL TYPES
// ============================================

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface ConfirmModalProps extends BaseModalProps {
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

// ============================================
// LAYOUT TYPES
// ============================================

export interface LayoutProps {
  children: React.ReactNode;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}
