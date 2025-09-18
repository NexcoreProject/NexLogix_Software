export interface IEstado {
    idestado: number;
    estado: string;
}

export interface IRol {
    idRole: number;
    nombreRole: string;
    descripcionRole: string;
    fechaAsignacionRole: string;
}

export interface IUsuario {
  idusuarios: number;
  documentoIdentidad: string;
  nombreCompleto: string;
  email: string;
  numContacto: string;
  direccionResidencia: string;
  fechaCreacion?: string;
  idRole: number;
  idestado: number;
  idPuestos: number;
}

export interface IUsuarioCreate extends Omit<IUsuario, 'idusuarios' | 'fechaCreacion'> {
  contrasena: string;
}

export interface IConductor {
  idConductor: number;
  licencia: string;
  tipoLicencia: string;
  vigenciaLicencia: string;
  estado: string;
  usuario: IUsuario;
}

// Raw API conductor shape (some fields are flattened and prefixed with 'c_' in backend)
export interface IConductorRaw {
  idConductor: number;
  Role?: string;
  c_documentoIdentidad?: string;
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