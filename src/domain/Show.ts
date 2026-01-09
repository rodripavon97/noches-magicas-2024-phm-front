
import { ShowJSON } from "src/interface/interfaces";
import { UsuarioAmigos } from "./UserAmigos";

export class Show {
  constructor(
    public id: string = '',
    public imagen: string = '',
    public nombreBanda: string = '',
    public nombreRecital: string = '',
    public ubicacion: string = '',
    public fecha: Date[] = [],
    public hora: string[] = [],
    public precioLocacionBarata: number = 0,
    public precioLocacionCara: number = 0,
    public amigosQueVanAlShow: UsuarioAmigos[] = [],
    public puntaje: number | null = null,
    public comentariosTotales: number = 0,
    public precioEntrada: number = 0,
    public estaAbierto: boolean = false
  ) {}

  static fromJSON(json: ShowJSON ): Show {
    return Object.assign(new Show(), json)
  }

  toJSON(): ShowJSON {
    return {
      ...this.toJSON()
    };
  }

  get tieneAmigosAsistiendo(): boolean {
    return this.amigosQueVanAlShow.length > 0;
  }

  get rangoPrecios(): string {
    return `$${this.precioLocacionBarata.toLocaleString()} - $${this.precioLocacionCara.toLocaleString()}`;
  }

  get tienePuntaje(): boolean {
    return this.puntaje !== null;
  }
}