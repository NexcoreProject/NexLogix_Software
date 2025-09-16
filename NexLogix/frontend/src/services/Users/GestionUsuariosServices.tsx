import { 
    IApiResponse, 
    IUsuario, 
    ICreateUsuarioDTO, 
    IUpdateUsuarioDTO,
    IRol,
    IEstado,
    IPuesto 
} from '../../models/Interfaces/IGestionUsuarios';
import axios from 'axios';
import { axiosInstance } from '../axiosConfig';

// Helper: normaliza errores de Axios a IApiResponse para no propagar any ni shape desconocidos
function formatAxiosError<T>(error: unknown, fallbackMessage: string, fallbackData: T, fallbackStatus?: number): IApiResponse<T> {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? fallbackStatus;
        let message = fallbackMessage;
        const data = error.response?.data as unknown;
        if (typeof data === 'object' && data !== null && 'message' in data) {
            const maybe = (data as { message?: unknown }).message;
            if (typeof maybe === 'string') {
                message = maybe;
            }
        }
        return {
            success: false,
            message,
            data: fallbackData,
            status
        } as IApiResponse<T>;
    }
    return {
        success: false,
        message: fallbackMessage,
        data: fallbackData,
        status: fallbackStatus
    } as IApiResponse<T>;
}

// Servicio de Usuarios: encapsula endpoints relacionados a usuarios
export const UsuariosService = {
    async getAll(): Promise<IApiResponse<IUsuario[]>> {
        try {
            const response = await axiosInstance.get('/gestion_usuarios');
            return response.data as IApiResponse<IUsuario[]>;
        } catch (error: unknown) {
            return formatAxiosError<IUsuario[]>(error, 'Error al listar usuarios', []);
        }
    },

    async getById(value: string): Promise<IApiResponse<IUsuario>> {
        try {
            const response = await axiosInstance.get(`/gestion_usuarios/${value}`);
            return response.data as IApiResponse<IUsuario>;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return {
                    success: false,
                    message: 'Usuario no encontrado',
                    data: null as unknown as IUsuario,
                    status: 404
                } as IApiResponse<IUsuario>;
            }
            return formatAxiosError<IUsuario>(error, 'Error al buscar usuario', null as unknown as IUsuario);
        }
    },

    async create(usuario: ICreateUsuarioDTO): Promise<IApiResponse<IUsuario>> {
        try {
            const response = await axiosInstance.post('/gestion_usuarios', usuario);
            return response.data as IApiResponse<IUsuario>;
        } catch (error: unknown) {
            return formatAxiosError<IUsuario>(error, 'Error al crear usuario', null as unknown as IUsuario);
        }
    },

    async update(id: number, usuario: IUpdateUsuarioDTO): Promise<IApiResponse<IUsuario>> {
        try {
            const response = await axiosInstance.patch(`/gestion_usuarios/${id}`, usuario);
            return response.data as IApiResponse<IUsuario>;
        } catch (error: unknown) {
            return formatAxiosError<IUsuario>(error, 'Error al actualizar usuario', null as unknown as IUsuario);
        }
    },

    async delete(id: number): Promise<IApiResponse<null>> {
        try {
            const response = await axiosInstance.delete(`/gestion_usuarios/${id}`);
            return response.data as IApiResponse<null>;
        } catch (error: unknown) {
            return formatAxiosError<null>(error, 'Error al eliminar usuario', null);
        }
    }
};

// Servicios de Catálogos: roles, puestos, estados
export const CatalogosService = {
    async getRoles(): Promise<IApiResponse<IRol[]>> {
        try {
            const response = await axiosInstance.get('/gestion_roles');
            return response.data as IApiResponse<IRol[]>;
        } catch (error: unknown) {
            return formatAxiosError<IRol[]>(error, 'Error al listar roles', []);
        }
    },

    async getPuestos(): Promise<IApiResponse<IPuesto[]>> {
        try {
            const response = await axiosInstance.get('/gestion_puestos');
            return response.data as IApiResponse<IPuesto[]>;
        } catch (error: unknown) {
            return formatAxiosError<IPuesto[]>(error, 'Error al listar puestos', []);
        }
    },

    async getEstados(): Promise<IApiResponse<IEstado[]>> {
        try {
            const response = await axiosInstance.get('/gestion_estados');
            return response.data as IApiResponse<IEstado[]>;
        } catch (error: unknown) {
            return formatAxiosError<IEstado[]>(error, 'Error al listar estados', []);
        }
    }
};