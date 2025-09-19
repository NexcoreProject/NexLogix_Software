import { axiosInstance } from '../services/axiosConfig';
import {
    IConductor,
    IConductorApiResponse,
    IConductorRaw,
    ConductorCreateDTO,
    ConductorUpdateDTO
} from '../models/Interfaces/IConductor';
import { EstadoConductorDTO, EstadoControlIdentidadesDTO } from '../models/Interfaces/IConductor';


// Use IConductorRaw defined in models for the backend raw shape

const BASE_URL = 'http://127.0.0.1:8000/api';
const CONDUCTORES_URL = `${BASE_URL}/gestion_conductores`;
const ESTADOS_USUARIOS_URL = `${BASE_URL}/gestion_estados`;
const ESTADOS_CONDUCTORES_URL = `${BASE_URL}/gestion_estado_conductores`;

export class ConductoresController {
    // Raw shape returned by backend (examples provided by backend)
    // Exposed as public static so other controllers can reuse the mapping
    static mapApiToIConductor(raw: IConductorRaw): IConductor {
        // safe extraction with runtime checks
        const documento = typeof raw['c_documentoIdentidad'] === 'string'
            ? (raw['c_documentoIdentidad'] as string)
            : (typeof raw['documentoIdentidad'] === 'string' ? (raw['documentoIdentidad'] as string) : '');

        // Defensive name extraction: try several possible keys the backend might use
        const possibleNameKeys = [
            'c_nombreCompleto', 'c_nombre', 'c_nombres', 'c_fullname',
            'nombreCompleto', 'nombre', 'nombres', 'fullName'
        ];

        let nombre = '';
        for (const k of possibleNameKeys) {
            const v = raw[k as keyof IConductorRaw];
            if (typeof v === 'string' && v.trim() !== '') {
                nombre = v.trim();
                break;
            }
        }

        const email = typeof raw['c_email'] === 'string'
            ? (raw['c_email'] as string)
            : (typeof raw['email'] === 'string' ? (raw['email'] as string) : '');

        // If no name found, use the email local-part as fallback (user-friendly)
        if (!nombre && email) {
            const local = email.split('@')[0] || '';
            nombre = local.replace(/[._-]/g, ' ');
        }

        const numContacto = typeof raw['c_numContacto'] === 'string'
            ? (raw['c_numContacto'] as string)
            : (typeof raw['numContacto'] === 'string' ? (raw['numContacto'] as string) : '');

        const direccion = typeof raw['c_direccionResidencia'] === 'string'
            ? (raw['c_direccionResidencia'] as string)
            : (typeof raw['direccionResidencia'] === 'string' ? (raw['direccionResidencia'] as string) : '');

        let estadoConductor = '';
        let estadoConductorRaw: EstadoConductorDTO | string | undefined = undefined;
        if (raw.estado_conductor && typeof raw.estado_conductor === 'object' && 'c_estado' in raw.estado_conductor) {
            const e = raw.estado_conductor as unknown as EstadoConductorDTO;
            estadoConductor = String(e.c_estado ?? '');
            estadoConductorRaw = e;
        } else if (typeof raw.estado_conductor === 'string') {
            estadoConductor = raw.estado_conductor;
            estadoConductorRaw = raw.estado_conductor;
        }

        const estadoUsuario = raw.estado_conductor__control__indentidades && typeof raw.estado_conductor__control__indentidades === 'object'
            ? String((raw.estado_conductor__control__indentidades as unknown as EstadoControlIdentidadesDTO).estado ?? '')
            : (typeof raw['estado'] === 'string' ? (raw['estado'] as string) : '');
        const estadoControlRaw: EstadoControlIdentidadesDTO | string | undefined = raw.estado_conductor__control__indentidades ?? undefined;

        // no longer extracting usuario-specific ids; conductor is flat

        return {
            idConductor: raw.idConductor,
            documentoIdentidad: documento,
            nombreCompleto: nombre,
            email: email,
            numContacto: numContacto,
            direccionResidencia: direccion,
            licencia: raw.licencia,
            tipoLicencia: raw.tipoLicencia,
            vigenciaLicencia: raw.vigenciaLicencia,
            idEstadoConductor: raw.idEstadoConductor ?? undefined,
            idestado_Usuario_control_indentidades: raw.idestado_Usuario_control_indentidades ?? undefined,
            estado: String(estadoConductor || estadoUsuario || '').toLowerCase(),
            estado_conductor_raw: estadoConductorRaw,
            estado_conductor_control_raw: estadoControlRaw,
            Role: raw.Role ?? undefined
        } as IConductor;
    }

    static async getAllConductores(): Promise<IConductor[]> {
        try {
            const response = await axiosInstance.get<IConductorApiResponse>(CONDUCTORES_URL);
            if (response.data.success) {
                // The backend now returns a flattened/raw shape. Map it to IConductor.
                const raw = response.data.data as unknown as IConductorRaw | IConductorRaw[];
                const rawArray = Array.isArray(raw) ? raw : [raw];
                return rawArray.map(rc => this.mapApiToIConductor(rc));
            }
            throw new Error(response.data.message || 'Error al obtener conductores');
        } catch (error) {
            console.error('Error al obtener conductores:', error);
            throw error;
        }
    }

    static async getConductorById(id: string): Promise<IConductor> {
        try {
            const response = await axiosInstance.get<IConductorApiResponse>(`${CONDUCTORES_URL}/${id}`);
            if (response.data.success) {
                const raw = response.data.data as unknown as IConductorRaw | IConductorRaw[];
                const rc = Array.isArray(raw) ? raw[0] : raw;
                return this.mapApiToIConductor(rc);
            }
            throw new Error(response.data.message || 'Error al obtener conductor');
        } catch (error) {
            console.error(`Error al obtener conductor ${id}:`, error);
            throw error;
        }
    }

    static async createConductor(conductor: ConductorCreateDTO): Promise<IConductor> {
        try {
            // Direct POST to gestion_conductores with backend DTO
            const response = await axiosInstance.post<IConductorApiResponse>(CONDUCTORES_URL, conductor);
            if (response.data.success) {
                const raw = response.data.data as unknown as IConductorRaw | IConductorRaw[];
                const rc = Array.isArray(raw) ? raw[0] : raw;
                return this.mapApiToIConductor(rc);
            }
            throw new Error(response.data.message || 'Error al crear conductor');
        } catch (error) {
            console.error('Error en createConductor:', error);
            throw error;
        }
    }

    static async getEstadosUsuarios(): Promise<EstadoControlIdentidadesDTO[]> {
        try {
            const response = await axiosInstance.get<{ success: boolean; data: EstadoControlIdentidadesDTO[] }>(ESTADOS_USUARIOS_URL);
            if (response.data && Array.isArray(response.data.data)) return response.data.data;
            return [];
        } catch (error) {
            console.error('Error al obtener estados usuarios:', error);
            return [];
        }
    }

    static async getEstadosConductores(): Promise<EstadoConductorDTO[]> {
        try {
            const response = await axiosInstance.get<{ success: boolean; data: EstadoConductorDTO[] }>(ESTADOS_CONDUCTORES_URL);
            if (response.data && Array.isArray(response.data.data)) return response.data.data;
            return [];
        } catch (error) {
            console.error('Error al obtener estados conductores:', error);
            return [];
        }
    }

    static async updateConductor(id: number, data: ConductorUpdateDTO): Promise<IConductor> {
        try {
            const response = await axiosInstance.patch<IConductorApiResponse>(`${CONDUCTORES_URL}/${id}`, data);
            if (response.data.success) {
                const raw = response.data.data as unknown as IConductorRaw | IConductorRaw[];
                const rc = Array.isArray(raw) ? raw[0] : raw;
                return this.mapApiToIConductor(rc);
            }
            throw new Error(response.data.message || 'Error al actualizar conductor');
        } catch (error) {
            console.error(`Error al actualizar conductor ${id}:`, error);
            throw error;
        }
    }

    static async deleteConductor(id: number): Promise<boolean> {
        try {
            const response = await axiosInstance.delete<IConductorApiResponse>(`${CONDUCTORES_URL}/${id}`);
            return response.data.success;
        } catch (error) {
            console.error(`Error al eliminar conductor ${id}:`, error);
            throw error;
        }
    }
}
