import { ComentarioJSON } from "src/interface/interfaces";

export class Comentario {
  constructor(
    public idShow: string,
    public fotoUsuario: string,
    public fotoBanda: string,
    public nombreUsuario: string,
    public nombreBanda: string,
    public fecha: string,
    public contenido: string,
    public puntuacion: number | null
  ) {}

  static fromJSON(json: ComentarioJSON): Comentario {
    return new Comentario(
      json.idShow,
      json.fotoUsuario,
      json.fotoBanda,
      json.nombreUsuario,
      json.nombreBanda,
      json.fecha,
      json.contenido,
      json.puntuacion
    );
  }

  toJSON(): ComentarioJSON {
    return {
      idShow: this.idShow,
      fotoUsuario: this.fotoUsuario,
      fotoBanda: this.fotoBanda,
      nombreUsuario: this.nombreUsuario,
      nombreBanda: this.nombreBanda,
      fecha: this.fecha,
      contenido: this.contenido,
      puntuacion: this.puntuacion
    };
  }

  get tienePuntuacion(): boolean {
    return this.puntuacion !== null;
  }
}