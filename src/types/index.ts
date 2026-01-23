/**
 * Barrel export para todos los types
 * Facilita la importación en otros archivos
 */

// Components
export type {
  ButtonVariant,
  ButtonSize,
  BaseButtonProps,
  CardShowProps,
  CardImageProps,
  CardHeaderProps,
  CardLocationProps,
  CardFriendsProps,
  CardActionsProps,
  FormFieldProps,
  TextInputProps,
  NumberInputProps,
  BaseModalProps,
  ConfirmModalProps,
  LayoutProps,
  ProtectedRouteProps,
} from './components';

// Services
export type {
  ApiResponse,
  ApiError,
  IAuthService,
  IUserService,
  IShowService,
  ICartService,
  ICommentService,
  ILoggingService,
} from './services';

export { QueryKeys } from './services';

// Hooks
export type { ApiError as HooksApiError, UseApiResult } from './hooks';
