import { UsuarioJSON } from "src/interface/interfaces";
import { Entrada } from "./entrada";
import { Validators } from "../utils/validators";

export class Usuario {
  constructor(
    public id: number,
    public nombre: string,
    public apellido: string,
    public fechaNacimiento: Date,
    public fotoPerfil: string,
    public username: string,
    public esAdm: boolean,
    public edad: number,
    public saldo: number,
    public dni: number,
    public entradasCompradas: Entrada[],
    public amigosDelUsuario: number[]
  ) {}

  static fromJSON(json: UsuarioJSON): Usuario {
    return new Usuario(
      json.id,
      json.nombre,
      json.apellido,
      Validators.ensureDate(json.fechaNacimiento),
      json.fotoPerfil,
      json.username,
      json.esAdm,
      json.edad,
      json.saldo,
      json.dni || json.DNI || 0, // El backend envía "dni" (minúsculas), no "DNI"
      json.entradasCompradas.map(e => Entrada.fromJSON(e)),
      json.amigosDelUsuario
    );
  }

  toJSON(): UsuarioJSON {
    const fechaValida = Validators.ensureDate(this.fechaNacimiento)
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      fechaNacimiento: fechaValida.toISOString().split('T')[0],
      fotoPerfil: this.fotoPerfil,
      username: this.username,
      esAdm: this.esAdm,
      edad: this.edad,
      saldo: this.saldo,
      dni: this.dni,  // Usar minúsculas para coincidir con el backend
      DNI: this.dni,  // Mantener mayúsculas para compatibilidad
      entradasCompradas: this.entradasCompradas.map(e => e.toJSON()),
      amigosDelUsuario: this.amigosDelUsuario
    };
  }

  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`;
  }

  get tieneEntradasCompradas(): boolean {
    return this.entradasCompradas.length > 0;
  }

  get tieneAmigos(): boolean {
    return this.amigosDelUsuario.length > 0;
  }

  tieneSaldoSuficiente(monto: number): boolean {
    return this.saldo >= monto;
  }
}