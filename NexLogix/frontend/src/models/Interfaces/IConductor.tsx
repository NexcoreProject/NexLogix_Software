// Nuevo modelo: conductor independiente (campos planos)
export interface IConductor {
  idConductor: number;
  documentoIdentidad: string;
  nombreCompleto: string;
  email: string;
  numContacto?: string;
  direccionResidencia?: string;
  licencia: string;
  tipoLicencia: string;
  vigenciaLicencia: string;
  idEstadoConductor?: number;
  idestado_Usuario_control_indentidades?: number;
  // estado proveniente de estado_conductor.c_estado o estado_conductor__control__indentidades.estado
  estado?: string; // valor legible como 'en_bodega' | 'disponible' | ...
  // raw object copies for diagnostics (optional)
  estado_conductor_raw?: EstadoConductorDTO | string;
  estado_conductor_control_raw?: EstadoControlIdentidadesDTO | string;
  // opcional: role/enum si en la misma tabla
  Role?: string;
}

// Raw API conductor shape (some fields are flattened and prefixed with 'c_' in backend)
// Raw API conductor shape (backend)
export interface IConductorRaw {
  idConductor: number;
  Role?: string;
  c_documentoIdentidad?: string;
  c_nombreCompleto?: string;
  c_email?: string;
  c_numContacto?: string;
  c_direccionResidencia?: string;
  licencia: string;
  tipoLicencia: string;
  vigenciaLicencia: string;
  idEstadoConductor?: number;
  idestado_Usuario_control_indentidades?: number;
  estado_conductor?: { idEstadoConductor?: number; c_estado?: string } | string;
  estado_conductor__control__indentidades?: { idestado?: number; estado?: string };
  fechaCreacion?: string;
  [key: string]: unknown;
}

// DTOs para crear/actualizar
export interface EstadoConductorDTO {
  idEstadoConductor?: number;
  c_estado: string;
}

export interface EstadoControlIdentidadesDTO {
  idestado?: number;
  estado?: string;
}

export interface ConductorCreateDTO {
  c_documentoIdentidad: string;
  c_nombreCompleto?: string;
  c_email: string;
  c_numContacto?: string;
  c_direccionResidencia?: string;
  contrasena?: string;

  licencia: string;
  tipoLicencia: TipoLicencia;
  vigenciaLicencia: string;

  // opcionalmente ids o subobjetos
  idEstadoConductor?: number;
  idestado_Usuario_control_indentidades?: number;
  estado_conductor?: EstadoConductorDTO;
  estado_conductor__control__indentidades?: EstadoControlIdentidadesDTO;
  Role?: string;
}

export type ConductorUpdateDTO = Partial<ConductorCreateDTO>;

export interface IConductorCreate {
    licencia: string;
    tipoLicencia: TipoLicencia;
    vigenciaLicencia: string;
    estado?: string;
    idUsuario: number;
}

export interface IConductorApiResponse {
    success: boolean;
    title?: string;
    message?: string;
    data: IConductor | IConductor[];
    status: number;
    errors?: Record<string, string[]>;
}

export type TipoLicencia = 'A1' | 'A2' | 'B1' | 'B2' | 'B3' | 'C1' | 'C2' | 'C3';