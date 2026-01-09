import { UsuarioAmigosJSON } from "../interfaces/interfaces";

export class UsuarioAmigos {
  constructor(
    public id: number,
    public nombre: string,
    public apellido: string,
    public foto: string
  ) {}

  static fromJSON(json: UsuarioAmigosJSON): UsuarioAmigos {
    return new UsuarioAmigos(
      json.id,
      json.nombre,
      json.apellido,
      json.foto
    );
  }

  toJSON(): UsuarioAmigosJSON {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      foto: this.foto
    };
  }

  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`;
  }
}