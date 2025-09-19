export interface IVehiculo {
    idVehiculo: number;
    placa: string;
    marcaVehiculo: string;
    tipoVehiculo: 'A1' | 'A2' | 'B1' | 'B2' | 'B3' | 'C1' | 'C2' | 'C3';
    capacidad: string;
    estadoVehiculo: 'disponible' | 'asignado' | 'en_ruta' | 'mantenimiento' | 'fuera_de_servicio';
    ultimoMantenimiento: string;
}

export interface IVehiculoApiResponse {
    success: boolean;
    message: string;
    data: IVehiculo[] | IVehiculo;
    status: number;
}
import { IConductor } from './IConductor';

// Assignment may include either a lightweight conductor payload or the full IConductor
export interface IAsignacionVehiculo {
    idAsignacion: number;
    fecha_asignacion_vehiculo: string;
    fecha_entrega_vehiculo: string | null;
    idConductor?: number;
    idVehiculo?: number;
    conductor: IConductor | {
        licencia: string;
        tipoLicencia: string;
        vigenciaLicencia: string;
        estado: string;
        // older payloads included a nested usuario; keep optional for compatibility
        usuario?: {
            email?: string;
            nombreCompleto?: string;
            documentoIdentidad?: string;
        }
    };
    vehiculo: {
        placa: string;
        marca: string;
    }
}

export interface IAsignacionVehiculoApiResponse {
    success: boolean;
    message?: string;
    data: IAsignacionVehiculo[];
    status: number;
}
