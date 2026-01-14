import { EntradaJSON, Ubicacion } from "../interfaces/interfaces";

export class Entrada {
  constructor(
    public id: number | undefined,
    public ubicacion: Ubicacion,
    public fecha: Date,
    public precioFinal: number,
    public idFuncion: number,
    public idShow: string,
    public cantidad: number = 1
  ) {}

  static fromJSON(json: EntradaJSON): Entrada {
    return new Entrada(
      json.id,
      json.ubicacion,
      new Date(json.fecha),
      json.precioFinal,
      json.idFuncion,
      json.idShow,
      json.cantidad || 1
    );
  }

  toJSON(): EntradaJSON {
    return {
      id: this.id,
      ubicacion: this.ubicacion,
      fecha: this.fecha.toISOString().split('T')[0],
      precioFinal: this.precioFinal,
      idFuncion: this.idFuncion,
      idShow: this.idShow,
      cantidad: this.cantidad
    };
  }

  get fechaPasada(): boolean {
    return this.fecha < new Date();
  }
}