import { ICategoriaReporte } from './ICategoriaReportes';

export interface IUserReporte {
  idusuarios: number;
  documentoIdentidad: string;
  nombreCompleto: string;
  email: string;
  numContacto: string;
  direccionResidencia: string;
  fechaCreacion: string;
  idRole: number;
  idestado: number;
  idPuestos: number;
}

export interface IReporte {
  idReporte: number;
  tipoReporte: string;
  descripcion: string;
  fechaCreacion: string;
  idusuarios: number;
  users: IUserReporte;
  idcategoriaReportes?: number;
  categoria_reportes?: ICategoriaReporte;
}

export interface IReporte_ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
    lastPage?: number;
  };
  status?: number;
  errors?: Record<string, string>;
}