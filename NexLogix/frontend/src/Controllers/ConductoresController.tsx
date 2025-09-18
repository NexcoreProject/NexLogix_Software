import { axiosInstance } from '../services/axiosConfig';
import { IConductor, IConductorCreate, IConductorApiResponse, IUsuarioCreate, IConductorRaw } from '../models/Interfaces/IConductor';

interface IUserResponse {
    success: boolean;
    data: {
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
    };
    message?: string;
    status: number;
}

// Use IConductorRaw defined in models for the backend raw shape

const BASE_URL = 'http://127.0.0.1:8000/api';
const CONDUCTORES_URL = `${BASE_URL}/gestion_conductores`;
const USUARIOS_URL = `${BASE_URL}/gestion_usuarios`;

export class ConductoresController {
    // Raw shape returned by backend (examples provided by backend)
    private static mapApiToIConductor(raw: IConductorRaw): IConductor {
        // safe extraction with runtime checks
        const usuarioId = typeof raw['idusuarios'] === 'number'
            ? (raw['idusuarios'] as number)
            : (typeof raw['idUsuario'] === 'number' ? (raw['idUsuario'] as number) : 0);

        const documento = typeof raw['c_documentoIdentidad'] === 'string'
            ? (raw['c_documentoIdentidad'] as string)
            : (typeof raw['documentoIdentidad'] === 'string' ? (raw['documentoIdentidad'] as string) : '');

        const nombre = typeof raw['c_nombreCompleto'] === 'string'
            ? (raw['c_nombreCompleto'] as string)
            : (typeof raw['nombreCompleto'] === 'string' ? (raw['nombreCompleto'] as string) : '');

        const email = typeof raw['c_email'] === 'string'
            ? (raw['c_email'] as string)
            : (typeof raw['email'] === 'string' ? (raw['email'] as string) : '');

        const numContacto = typeof raw['c_numContacto'] === 'string'
            ? (raw['c_numContacto'] as string)
            : (typeof raw['numContacto'] === 'string' ? (raw['numContacto'] as string) : '');

        const direccion = typeof raw['c_direccionResidencia'] === 'string'
            ? (raw['c_direccionResidencia'] as string)
            : (typeof raw['direccionResidencia'] === 'string' ? (raw['direccionResidencia'] as string) : '');

        let estadoConductor = '';
        if (raw.estado_conductor && typeof raw.estado_conductor === 'object' && 'c_estado' in raw.estado_conductor) {
            estadoConductor = String(raw.estado_conductor.c_estado ?? '');
        } else if (typeof raw.estado_conductor === 'string') {
            estadoConductor = raw.estado_conductor;
        }

        const estadoUsuario = raw.estado_conductor__control__indentidades && typeof raw.estado_conductor__control__indentidades === 'object'
            ? String(raw.estado_conductor__control__indentidades.estado ?? '')
            : (typeof raw['estado'] === 'string' ? (raw['estado'] as string) : '');

        const idRole = typeof raw['idRole'] === 'number' ? (raw['idRole'] as number) : 0;
        const idestadoUser = typeof raw['idestado_Usuario_control_indentidades'] === 'number'
            ? (raw['idestado_Usuario_control_indentidades'] as number)
            : (typeof raw['idestado'] === 'number' ? (raw['idestado'] as number) : 0);
        const idPuestos = typeof raw['idPuestos'] === 'number' ? (raw['idPuestos'] as number) : 0;

        return {
            idConductor: raw.idConductor,
            licencia: raw.licencia,
            tipoLicencia: raw.tipoLicencia,
            vigenciaLicencia: raw.vigenciaLicencia,
            estado: String(estadoConductor || estadoUsuario || '').toLowerCase(),
            usuario: {
                idusuarios: usuarioId,
                documentoIdentidad: documento,
                nombreCompleto: nombre,
                email: email,
                numContacto: numContacto,
                direccionResidencia: direccion,
                fechaCreacion: raw.fechaCreacion ?? '',
                idRole: idRole,
                idestado: idestadoUser,
                idPuestos: idPuestos,
            }
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

    static async createConductorWithUser(userData: IUsuarioCreate & Partial<IConductorCreate>): Promise<IConductor> {
        try {
            // 1. Crear usuario primero con los datos predefinidos
            // Build API payload using backend field names (c_*), backend expects these keys
            const apiUserPayload = {
                c_documentoIdentidad: userData.documentoIdentidad,
                c_nombreCompleto: userData.nombreCompleto,
                c_email: userData.email,
                c_numContacto: userData.numContacto,
                c_direccionResidencia: userData.direccionResidencia,
                contrasena: userData.contrasena,
                idRole: 13, // Role ID para conductores
                idestado: 1, // Estado activo
                idPuestos: 2 // Puesto predefinido para conductores
            };

            const userResponse = await axiosInstance.post<IUserResponse>(USUARIOS_URL, apiUserPayload);
            
            if (!userResponse.data.success) {
                throw new Error(userResponse.data.message || 'Error al crear usuario');
            }

            // 2. Crear conductor con el ID de usuario obtenido
            const conductorData: IConductorCreate = {
                licencia: userData.licencia!,
                tipoLicencia: userData.tipoLicencia!,
                vigenciaLicencia: userData.vigenciaLicencia!,
                estado: 'disponible',
                idUsuario: userResponse.data.data.idusuarios
            };

            const conductorResponse = await axiosInstance.post<IConductorApiResponse>(CONDUCTORES_URL, conductorData);

            if (!conductorResponse.data.success) {
                // Si falla la creación del conductor, intentar eliminar el usuario creado
                await axiosInstance.delete(`${USUARIOS_URL}/${userResponse.data.data.idusuarios}`);
                throw new Error(conductorResponse.data.message || 'Error al crear conductor');
            }

            // Map backend raw response to IConductor
            const raw = conductorResponse.data.data as unknown as IConductorRaw | IConductorRaw[];
            const rc = Array.isArray(raw) ? raw[0] : raw;
            return this.mapApiToIConductor(rc);

        } catch (error) {
            console.error('Error en el proceso de creación:', error);
            throw error;
        }
    }

    static async updateConductor(id: number, data: Partial<IConductorCreate>): Promise<IConductor> {
        try {
            const response = await axiosInstance.patch<IConductorApiResponse>(`${CONDUCTORES_URL}/${id}`, data);
            if (response.data.success) {
                // backend returns a raw flattened conductor; map it to IConductor
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

    static async getAllUsuarios() {
        try {
            const response = await axiosInstance.get<IUserResponse>(USUARIOS_URL);
            return response.data;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }
}
