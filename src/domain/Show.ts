
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
    public estaAbierto: boolean = false,
    // Campos solo para admin
    public ventas: number = 0,
    public rentabilidad: number = 0,
    public personasEnEspera: number = 0,
    public souldOut: number = 0,
    public puedeAgregarFuncion: boolean = true
  ) {}

  static fromJSON(json: ShowJSON): Show {
    return new Show(
      json.id,
      json.imagen,
      json.nombreBanda,
      json.nombreRecital,
      json.ubicacion,
      json.fecha?.map(f => new Date(f)) || [],
      json.hora || [],
      json.precioLocacionBarata,
      json.precioLocacionCara,
      json.amigosQueVanAlShow?.map(a => UsuarioAmigos.fromJSON(a)) || [],
      json.puntaje,
      json.comentariosTotales,
      json.precioEntrada ?? 0,
      json.estaAbierto ?? false,
      // Campos de admin
      json.ventas ?? 0,
      json.rentabilidad ?? 0,
      json.personasEnEspera ?? 0,
      json.souldOut ?? 0,
      json.puedeAgregarFuncion ?? true
    );
  }

  toJSON(): ShowJSON {
    return {
      id: this.id,
      imagen: this.imagen,
      nombreBanda: this.nombreBanda,
      nombreRecital: this.nombreRecital,
      ubicacion: this.ubicacion,
      fecha: this.fecha?.map(f => f.toISOString().split('T')[0]),
      hora: this.hora,
      precioLocacionBarata: this.precioLocacionBarata,
      precioLocacionCara: this.precioLocacionCara,
      amigosQueVanAlShow: this.amigosQueVanAlShow?.map(a => a.toJSON()),
      puntaje: this.puntaje,
      comentariosTotales: this.comentariosTotales,
      precioEntrada: this.precioEntrada,
      estaAbierto: this.estaAbierto
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