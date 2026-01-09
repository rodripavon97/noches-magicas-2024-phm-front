import { ShowAdminJSON } from "../interfaces/interfaces";

export class ShowAdmin {
  constructor(
    public id: string,
    public imagen: string,
    public nombreBanda: string,
    public nombreRecital: string,
    public ubicacion: string,
    public fecha: Date[],
    public hora: string[],
    public precioLocacionBarata: number,
    public precioLocacionCara: number,
    public souldOut: number,
    public rentabilidad: number,
    public personasEnEspera: number,
    public ventas: number
  ) {}

  static fromJSON(json: ShowAdminJSON): ShowAdmin {
    return new ShowAdmin(
      json.id,
      json.imagen,
      json.nombreBanda,
      json.nombreRecital,
      json.ubicacion,
      json.fecha.map(f => new Date(f)),
      json.hora,
      json.precioLocacionBarata,
      json.precioLocacionCara,
      json.souldOut,
      json.rentabilidad,
      json.personasEnEspera,
      json.ventas
    );
  }

  toJSON(): ShowAdminJSON {
    return {
      id: this.id,
      imagen: this.imagen,
      nombreBanda: this.nombreBanda,
      nombreRecital: this.nombreRecital,
      ubicacion: this.ubicacion,
      fecha: this.fecha.map(f => f.toISOString().split('T')[0]),
      hora: this.hora,
      precioLocacionBarata: this.precioLocacionBarata,
      precioLocacionCara: this.precioLocacionCara,
      souldOut: this.souldOut,
      rentabilidad: this.rentabilidad,
      personasEnEspera: this.personasEnEspera,
      ventas: this.ventas
    };
  }

  get colorVentas(): 'red' | 'yellow' | 'green' {
    if (this.ventas < 1000000) return 'red';
    if (this.ventas < 2000000) return 'yellow';
    return 'green';
  }

  get colorRentabilidad(): 'red' | 'yellow' | 'green' {
    const costoEstimado = this.ventas - this.rentabilidad;
    if (this.rentabilidad < 0) return 'red';
    if (this.rentabilidad < costoEstimado * 0.5) return 'yellow';
    return 'green';
  }

  get porcentajeSoldOut(): number {
    const totalFunciones = this.fecha.length;
    return totalFunciones > 0 ? (this.souldOut / totalFunciones) * 100 : 0;
  }

  get colorSoldOut(): 'red' | 'yellow' | 'green' {
    const porcentaje = this.porcentajeSoldOut;
    if (porcentaje < 50) return 'red';
    if (porcentaje < 75) return 'yellow';
    return 'green';
  }
}