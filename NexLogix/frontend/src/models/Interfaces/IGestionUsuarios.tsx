// Interfaces para las relaciones
export interface IArea {
    idArea: number;
    nombreArea: string;
    descripcionArea: string;
}

export interface IPuesto {
    idPuestos: number;
    nombrePuesto: string;
    fechaAsignacionPuesto: string;
    descripcionPuesto: string;
    idArea: number;
    areas: IArea;
}

export interface IRol {
    idRole: number;
    nombreRole: string;
    descripcionRole: string;
}

export interface IEstado {
    idestado: number;
    estado: string;
    descripcionEstado: string;
}

// Interfaz principal para Usuario que coincide exactamente con el backend
export interface IUsuario {
    idusuarios: number;
    documentoIdentidad: string;
    nombreCompleto: string;
    email: string;
    numContacto: string;
    direccionResidencia: string;
    fechaCreacion: string;
    idestado: number;
    idRole: number;
    idPuestos: number;
    estado: IEstado;
    roles: IRol;
    puestos: IPuesto;
}

// Respuesta de la API para operaciones de usuarios
export interface IUsuarioApiResponse {
    success: boolean;
    title?: string;
    message?: string;
    data: IUsuario[] | IUsuario;
    status: number;
}

// DTO para crear usuarios
export interface ICreateUsuarioDTO {
    documentoIdentidad: string;
    nombreCompleto: string;
    email: string;
    numContacto: string;
    direccionResidencia: string;
    contrasena: string;
    idestado: number;
    idRole: number;
    idPuestos: number;
}

// DTO para actualizar usuarios
export interface IUpdateUsuarioDTO {
    documentoIdentidad: string;
    nombreCompleto: string;
    email: string;
    numContacto: string;
    direccionResidencia: string;
    idestado: number;
    idRole: number;
    idPuestos: number;
}

// Respuesta genérica de la API
export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    status?: number;
}