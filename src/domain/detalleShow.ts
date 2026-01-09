import { ShowDetalleJSON, Ubicacion } from '../interface/interfaces';
import { Comentario } from "./Comentario";

export class ShowDetalle {
  constructor(
    public id: string,
    public fotoArtista: string,
    public nombreBanda: string,
    public nombreRecital: string,
    public ubicacion: string,
    public fecha: Date[],
    public hora: string[],
    public puntaje: number | null,
    public cantidadComentario: number,
    public comentarios: Comentario[],
    public souldOut: number,
    public allSouldOut: boolean,
    public funcionesDisponibles: boolean,
    public usuarioEnEspera: number,
    public totalRecaudado: number | null,
    public totalCosto: number | null,
    public entradasVendidasTotales: number,
    public longitud: string,
    public latitud: string,
    public ubicacionCosto: Map<Ubicacion, number>,
    public entradasVendidasPorUbicacion: Map<Ubicacion, number>
  ) {}

  static fromJSON(json: ShowDetalleJSON): ShowDetalle {
    const ubicacionCostoMap = new Map<Ubicacion, number>();
    Object.entries(json.ubicacionCosto).forEach(([key, value]) => {
      ubicacionCostoMap.set(key as Ubicacion, value);
    });

    const entradasVendidasMap = new Map<Ubicacion, number>();
    Object.entries(json.entradasVendidasPorUbicacion).forEach(([key, value]) => {
      entradasVendidasMap.set(key as Ubicacion, value);
    });

    return new ShowDetalle(
      json.id,
      json.fotoArtista,
      json.nombreBanda,
      json.nombreRecital,
      json.ubicacion,
      json.fecha.map(f => new Date(f)),
      json.hora,
      json.puntaje,
      json.cantidadComentario,
      json.comentarios.map(c => Comentario.fromJSON(c)),
      json.souldOut,
      json.allSouldOut,
      json.funcionesDisponibles,
      json.usuarioEnEspera,
      json.totalRecaudado,
      json.totalCosto,
      json.entradasVendidasTotales,
      json.logitud,
      json.latitud,
      ubicacionCostoMap,
      entradasVendidasMap
    );
  }

  toJSON(): ShowDetalleJSON {
    const ubicacionCostoObj: Record<string, number> = {};
    this.ubicacionCosto.forEach((value, key) => {
      ubicacionCostoObj[key] = value;
    });

    const entradasVendidasObj: Record<string, number> = {};
    this.entradasVendidasPorUbicacion.forEach((value, key) => {
      entradasVendidasObj[key] = value;
    });

    return {
      id: this.id,
      fotoArtista: this.fotoArtista,
      nombreBanda: this.nombreBanda,
      nombreRecital: this.nombreRecital,
      ubicacion: this.ubicacion,
      fecha: this.fecha.map(f => f.toISOString().split('T')[0]),
      hora: this.hora,
      puntaje: this.puntaje,
      cantidadComentario: this.cantidadComentario,
      comentarios: this.comentarios.map(c => c.toJSON()),
      souldOut: this.souldOut,
      allSouldOut: this.allSouldOut,
      funcionesDisponibles: this.funcionesDisponibles,
      usuarioEnEspera: this.usuarioEnEspera,
      totalRecaudado: this.totalRecaudado,
      totalCosto: this.totalCosto,
      entradasVendidasTotales: this.entradasVendidasTotales,
      logitud: this.longitud,
      latitud: this.latitud,
      ubicacionCosto: ubicacionCostoObj,
      entradasVendidasPorUbicacion: entradasVendidasObj
    };
  }

  get rentabilidad(): number | null {
    if (this.totalRecaudado !== null && this.totalCosto !== null) {
      return this.totalRecaudado - this.totalCosto;
    }
    return null;
  }

  get tieneComentarios(): boolean {
    return this.comentarios.length > 0;
  }
}