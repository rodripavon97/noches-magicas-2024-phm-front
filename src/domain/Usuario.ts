import { UsuarioJSON } from "src/interface/interfaces";
import { Entrada } from "./entrada";

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
      new Date(json.fechaNacimiento),
      json.fotoPerfil,
      json.username,
      json.esAdm,
      json.edad,
      json.saldo,
      json.DNI,
      json.entradasCompradas.map(e => Entrada.fromJSON(e)),
      json.amigosDelUsuario
    );
  }

  toJSON(): UsuarioJSON {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      fechaNacimiento: this.fechaNacimiento.toISOString().split('T')[0],
      fotoPerfil: this.fotoPerfil,
      username: this.username,
      esAdm: this.esAdm,
      edad: this.edad,
      saldo: this.saldo,
      DNI: this.dni,
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