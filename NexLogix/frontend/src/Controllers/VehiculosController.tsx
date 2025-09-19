import { axiosInstance } from '../services/axiosConfig';
import { 
    IVehiculo, 
    IVehiculoApiResponse, 
    IAsignacionVehiculo, 
    IAsignacionVehiculoApiResponse 
} from '../models/Interfaces/IVehiculo';
import { IConductor, IConductorApiResponse, IConductorRaw } from '../models/Interfaces/IConductor';
import { ConductoresController } from './ConductoresController';

export class VehiculosController {
    // Obtener todos los vehículos
    static async getAllVehiculos(): Promise<IVehiculo[]> {
        try {
            const response = await axiosInstance.get<IVehiculoApiResponse>('http://127.0.0.1:8000/api/gestion_vehiculos');
            return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
            throw error;
        }
    }

    // Obtener vehículo por ID
    static async getVehiculoById(id: string): Promise<IVehiculo> {
        try {
            const response = await axiosInstance.get<IVehiculoApiResponse>(`http://127.0.0.1:8000/api/gestion_vehiculos/${id}`);
            return Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        } catch (error) {
            console.error('Error al obtener vehículo:', error);
            throw error;
        }
    }

    // Crear nuevo vehículo
    static async createVehiculo(vehiculo: Omit<IVehiculo, 'idVehiculo'>): Promise<IVehiculo> {
        try {
            const response = await axiosInstance.post<IVehiculoApiResponse>('http://127.0.0.1:8000/api/gestion_vehiculos', vehiculo);
            return Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        } catch (error) {
            console.error('Error al crear vehículo:', error);
            throw error;
        }
    }

    // Actualizar vehículo
    static async updateVehiculo(id: string, vehiculo: Partial<IVehiculo>): Promise<IVehiculo> {
        try {
            const response = await axiosInstance.patch<IVehiculoApiResponse>(`http://127.0.0.1:8000/api/gestion_vehiculos/${id}`, vehiculo);
            return Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        } catch (error) {
            console.error('Error al actualizar vehículo:', error);
            throw error;
        }
    }

    // Eliminar vehículo
    static async deleteVehiculo(id: string): Promise<boolean> {
        try {
            const response = await axiosInstance.delete<IVehiculoApiResponse>(`http://127.0.0.1:8000/api/gestion_vehiculos/${id}`);
            return response.data.success;
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
            throw error;
        }
    }

    // Obtener asignaciones de conductores por vehículo
    static async getAsignacionesConductores(): Promise<IAsignacionVehiculo[]> {
        try {
            const response = await axiosInstance.get<{ success: boolean; data: unknown[] }>('http://127.0.0.1:8000/api/gestion_asignacion_conductores_por_vehiculos');
            const raw = Array.isArray(response.data.data) ? response.data.data as unknown[] : [];
            // Normalize each assignment to ensure ids and conductor flat shape
            const normalized = raw.map(item => {
                const r = (item as Record<string, unknown>);
                // r may include conductor nested in raw backend shape (flat c_* or old usuario)
                const conductorCandidate = (r['conductor'] ?? r) as Record<string, unknown>;
                let conductorMapped: IConductor;
                try {
                    conductorMapped = ConductoresController.mapApiToIConductor(conductorCandidate as IConductorRaw);
                } catch (mapErr) {
                    // fallback: try to coerce minimal fields and log the mapping error
                    console.warn('ConductoresController.mapApiToIConductor failed, using fallback mapping:', mapErr);
                    conductorMapped = {
                        idConductor: Number(r['idConductor'] ?? conductorCandidate['idConductor'] ?? 0),
                        documentoIdentidad: String(conductorCandidate['c_documentoIdentidad'] ?? conductorCandidate['documentoIdentidad'] ?? ''),
                        nombreCompleto: String(conductorCandidate['c_nombreCompleto'] ?? (conductorCandidate['usuario'] && (conductorCandidate['usuario'] as Record<string, unknown>)['nombreCompleto']) ?? ''),
                        email: String(conductorCandidate['c_email'] ?? (conductorCandidate['usuario'] && (conductorCandidate['usuario'] as Record<string, unknown>)['email']) ?? ''),
                        licencia: String(conductorCandidate['licencia'] ?? ''),
                        tipoLicencia: String(conductorCandidate['tipoLicencia'] ?? ''),
                        vigenciaLicencia: String(conductorCandidate['vigenciaLicencia'] ?? ''),
                    } as IConductor;
                }

                return {
                    idAsignacion: Number(r['idAsignacion'] ?? r['id'] ?? 0),
                    fecha_asignacion_vehiculo: String(r['fecha_asignacion_vehiculo'] ?? r['fechaAsignacion'] ?? ''),
                    fecha_entrega_vehiculo: (r['fecha_entrega_vehiculo'] ?? r['fecha_entrega'] ?? null) as string | null,
                    idConductor: (r['idConductor'] ?? (conductorCandidate['idConductor'] ?? conductorMapped.idConductor)) as number | undefined,
                    idVehiculo: (r['idVehiculo'] ?? ((r['vehiculo'] as Record<string, unknown>)?.['idVehiculo'] ?? undefined)) as number | undefined,
                    conductor: conductorMapped,
                    vehiculo: (r['vehiculo'] as Record<string, unknown>) ?? { placa: String(r['placa'] ?? ''), marca: String(r['marcaVehiculo'] ?? r['marca'] ?? '') }
                } as IAsignacionVehiculo;
            });
            return normalized;
        } catch (error) {
            console.error('Error al obtener asignaciones:', error);
            throw error;
        }
    }

    // Crear asignación conductor-vehículo
    static async createAsignacion(data: { idConductor: number; idVehiculo: number }): Promise<IAsignacionVehiculo> {
        try {
            const response = await axiosInstance.post<IAsignacionVehiculoApiResponse>('http://127.0.0.1:8000/api/gestion_asignacion_conductores_por_vehiculos', data);
            return response.data.data[0];
        } catch (error) {
            console.error('Error al crear asignación:', error);
            throw error;
        }
    }

    // Actualizar asignación
    static async updateAsignacion(id: number, data: { fecha_entrega_vehiculo: string }): Promise<IAsignacionVehiculo> {
        try {
            const response = await axiosInstance.patch<IAsignacionVehiculoApiResponse>(`http://127.0.0.1:8000/api/gestion_asignacion_conductores_por_vehiculos/${id}`, data);
            return response.data.data[0];
        } catch (error) {
            console.error('Error al actualizar asignación:', error);
            throw error;
        }
    }

    // Eliminar asignación
    static async deleteAsignacion(id: number): Promise<boolean> {
        try {
            const response = await axiosInstance.delete<IAsignacionVehiculoApiResponse>(`http://127.0.0.1:8000/api/gestion_asignacion_conductores_por_vehiculos/${id}`);
            return response.data.success;
        } catch (error) {
            console.error('Error al eliminar asignación:', error);
            throw error;
        }
    }

    // Obtener conductores activos
    static async getActiveConductors(): Promise<IConductor[]> {
        try {
            const response = await axiosInstance.get<IConductorApiResponse>('http://127.0.0.1:8000/api/gestion_conductores/filtro_conductores_activos');
            const raw = Array.isArray(response.data.data) ? response.data.data as unknown[] : [response.data.data];
            // Map raw backend items to IConductor using ConductoresController mapper with safe fallback
            const mapped: IConductor[] = raw.map(r => {
                const rec = r as unknown as Record<string, unknown>;
                try {
                    return ConductoresController.mapApiToIConductor(rec as IConductorRaw);
                } catch (err) {
                    console.warn('Failed to map active conductor, applying fallback:', err);
                    return {
                        idConductor: Number(rec['idConductor'] ?? rec['id'] ?? 0),
                        documentoIdentidad: String(rec['c_documentoIdentidad'] ?? rec['documentoIdentidad'] ?? ''),
                        nombreCompleto: String(rec['c_nombreCompleto'] ?? rec['nombreCompleto'] ?? rec['email'] ?? ''),
                        email: String(rec['c_email'] ?? rec['email'] ?? ''),
                        licencia: String(rec['licencia'] ?? ''),
                        tipoLicencia: String(rec['tipoLicencia'] ?? ''),
                        vigenciaLicencia: String(rec['vigenciaLicencia'] ?? ''),
                        estado: String((rec['estado_conductor'] && (rec['estado_conductor'] as Record<string, unknown>)['c_estado']) ?? rec['estado'] ?? '').toLowerCase()
                    } as IConductor;
                }
            });
            return mapped;
        } catch (error) {
            console.error('Error al obtener conductores activos:', error);
            throw error;
        }
    }
}
