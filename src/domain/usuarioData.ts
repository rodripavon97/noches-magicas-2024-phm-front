import { LogsJSON, UsuarioDataJSON, UsuarioDataLogsJSON } from "../interfaces/interfaces";

export class UsuarioData {
  constructor(
    public id: number,
    public nombre: string,
    public apellido: string,
    public esAdm: boolean,
    public fotoPerfil: string
  ) {}

  static fromJSON(json: UsuarioDataJSON): UsuarioData {
    return new UsuarioData(
      json.id,
      json.nombre,
      json.apellido,
      json.esAdm,
      json.fotoPerfil
    );
  }

  toJSON(): UsuarioDataJSON {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      esAdm: this.esAdm,
      fotoPerfil: this.fotoPerfil
    };
  }

  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`;
  }
}

export class UsuarioDataLogs {
  constructor(
    public id: number,
    public nombre: string,
    public apellido: string
  ) {}

  static fromJSON(json: UsuarioDataLogsJSON): UsuarioDataLogs {
    return new UsuarioDataLogs(
      json.id,
      json.nombre,
      json.apellido
    );
  }

  toJSON(): UsuarioDataLogsJSON {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido
    };
  }
}

export class Logs {
  constructor(
    public fecha: Date,
    public hora: string,
    public nombreAlojamiento: string,
    public usuario: UsuarioDataLogs[],
    public id: string,
    public idShow: string
  ) {}

  static fromJSON(json: LogsJSON): Logs {
    return new Logs(
      new Date(json.fecha),
      json.hora,
      json.nombreAlojamiento,
      json.usuario.map(u => UsuarioDataLogs.fromJSON(u)),
      json.id,
      json.idShow
    );
  }

  toJSON(): LogsJSON {
    return {
      fecha: this.fecha.toISOString().split('T')[0],
      hora: this.hora,
      nombreAlojamiento: this.nombreAlojamiento,
      usuario: this.usuario.map(u => u.toJSON()),
      id: this.id,
      idShow: this.idShow
    };
  }
}