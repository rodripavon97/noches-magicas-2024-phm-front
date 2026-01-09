import { CarritoJSON } from "../interfaces/interfaces";
import { UsuarioAmigos } from "./UserAmigos";

export class Carrito {
  constructor(
    public id: number,
    public idShow: string,
    public precioEntrada: number,
    public precioTotalCarrito: number,
    public imagen: string,
    public nombreBanda: string,
    public nombreRecital: string,
    public ubicacion: string,
    public fecha: Date[],
    public puntaje: number | null,
    public comentariosTotales: number,
    public sizeCarrito: number,
    public amigosQueVanAlShow: UsuarioAmigos[],
    public estaAbierto: boolean
  ) {}

  static fromJSON(json: CarritoJSON): Carrito {
    return new Carrito(
      json.id,
      json.idShow,
      json.precioEntrada,
      json.precioTotalCarrito,
      json.imagen,
      json.nombreBanda,
      json.nombreRecital,
      json.ubicacion,
      json.fecha.map(f => new Date(f)),
      json.puntaje,
      json.comentariosTotales,
      json.sizeCarrito,
      json.amigosQueVanAlShow.map(a => UsuarioAmigos.fromJSON(a)),
      json.estaAbierto
    );
  }

  toJSON(): CarritoJSON {
    return {
      id: this.id,
      idShow: this.idShow,
      precioEntrada: this.precioEntrada,
      precioTotalCarrito: this.precioTotalCarrito,
      imagen: this.imagen,
      nombreBanda: this.nombreBanda,
      nombreRecital: this.nombreRecital,
      ubicacion: this.ubicacion,
      fecha: this.fecha.map(f => f.toISOString().split('T')[0]),
      puntaje: this.puntaje,
      comentariosTotales: this.comentariosTotales,
      sizeCarrito: this.sizeCarrito,
      amigosQueVanAlShow: this.amigosQueVanAlShow.map(a => a.toJSON()),
      estaAbierto: this.estaAbierto
    };
  }

  get tieneEntradas(): boolean {
    return this.sizeCarrito > 0;
  }
}