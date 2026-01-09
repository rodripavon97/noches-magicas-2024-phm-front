
// ============================================
// ENUMS Y TIPOS
// ============================================

export enum Ubicacion {
  PLATEA_ALTA = "PLATEA_ALTA",
  CAMPO = "CAMPO",
  PALCO = "PALCO",
  PULLMAN = "PULLMAN",
  PLATEA_BAJA = "PLATEA_BAJA"
}

// ============================================
// INTERFACES JSON (Lo que viene del back)
// ============================================

export interface AdminJSON {
  id: number;
  nombre: string;
  apellido: string;
  fotoPerfil: string;
  username: string;
  esAdm: boolean;
}

export interface UsuarioAmigosJSON {
  id: number;
  nombre: string;
  apellido: string;
  foto: string;
}

export interface ComentarioJSON {
  idShow: string;
  fotoUsuario: string;
  fotoBanda: string;
  nombreUsuario: string;
  nombreBanda: string;
  fecha: string; // LocalDate como string ISO
  contenido: string;
  puntuacion: number | null;
}

export interface ShowJSON {
  id: string;
  imagen: string;
  nombreBanda: string;
  nombreRecital: string;
  ubicacion: string;
  fecha: string[]; // LocalDate[] como string[]
  hora: string[]; // LocalTime[] como string[]
  precioLocacionBarata: number;
  precioLocacionCara: number;
  amigosQueVanAlShow: UsuarioAmigosJSON[];
  puntaje: number | null;
  comentariosTotales: number;
  precioEntrada: number;
  estaAbierto: boolean;
}

export interface ShowAdminJSON {
  id: string;
  imagen: string;
  nombreBanda: string;
  nombreRecital: string;
  ubicacion: string;
  fecha: string[];
  hora: string[];
  precioLocacionBarata: number;
  precioLocacionCara: number;
  souldOut: number;
  rentabilidad: number;
  personasEnEspera: number;
  ventas: number;
}

export interface ShowDetalleJSON {
  id: string;
  fotoArtista: string;
  nombreBanda: string;
  nombreRecital: string;
  ubicacion: string;
  fecha: string[];
  hora: string[];
  puntaje: number | null;
  cantidadComentario: number;
  comentarios: ComentarioJSON[];
  souldOut: number;
  allSouldOut: boolean;
  funcionesDisponibles: boolean;
  usuarioEnEspera: number;
  totalRecaudado: number | null;
  totalCosto: number | null;
  entradasVendidasTotales: number;
  logitud: string;
  latitud: string;
  ubicacionCosto: Record<string, number>;
  entradasVendidasPorUbicacion: Record<string, number>;
}

export interface EntradaJSON {
  id?: number;
  ubicacion: Ubicacion;
  fecha: string;
  precioFinal: number;
  idFuncion: number;
  idShow: string;
}

export interface CarritoJSON {
  id: number;
  idShow: string;
  precioEntrada: number;
  precioTotalCarrito: number;
  imagen: string;
  nombreBanda: string;
  nombreRecital: string;
  ubicacion: string;
  fecha: string[];
  puntaje: number | null;
  comentariosTotales: number;
  sizeCarrito: number;
  amigosQueVanAlShow: UsuarioAmigosJSON[];
  estaAbierto: boolean;
}

export interface UsuarioJSON {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  fotoPerfil: string;
  username: string;
  esAdm: boolean;
  edad: number;
  saldo: number;
  DNI: number;
  entradasCompradas: EntradaJSON[];
  amigosDelUsuario: number[];
}

export interface UsuarioDataJSON {
  id: number;
  nombre: string;
  apellido: string;
  esAdm: boolean;
  fotoPerfil: string;
}

export interface UsuarioDataLogsJSON {
  id: number;
  nombre: string;
  apellido: string;
}

export interface LogsJSON {
  fecha: string;
  hora: string;
  nombreAlojamiento: string;
  usuario: UsuarioDataLogsJSON[];
  id: string;
  idShow: string;
}

// ============================================
// DTOs PARA ENVIAR AL BACKEND
// ============================================

export interface LoginDTO {
  username: string;
  password: string;
}

export interface ComentarioNuevoDTO {
  contenido: string;
  puntuacion: number | null;
}

export interface CarritoGetDTO {
  idShow: string;
  idFuncion: number;
  cantidad: number;
  ubicacion: Ubicacion;
}

export interface UsuarioEditarDTO {
  nombre: string;
  apellido: string;
}