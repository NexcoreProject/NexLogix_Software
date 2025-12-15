import axios, { AxiosResponse } from 'axios';
import { Envio, Ciudad, CategoriaEnvio, RecogidaData, EntregaData, EnvioData } from '../../models/Interfaces/IEnvios';
import { axiosInstance } from '../axiosConfig';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string>;
  status?: number;
}

// Obtener lista de ciudades
export const fetchCiudades = async (): Promise<ApiResponse<Ciudad[]>> => {
  try {
    console.log('fetchCiudades: Enviando solicitud a', '/gestion_ciudades');
    const response: AxiosResponse<
      ApiResponse<{
        idCiudad: number;
        nombreCiudad: string;
        costoPor_Ciudad: string;
      }[]>
    > = await axiosInstance.get('/gestion_ciudades');
    console.log('fetchCiudades: Respuesta recibida:', JSON.stringify(response.data, null, 2));
    // Transformar datos para que coincidan con la interfaz Ciudad
    const transformedData: Ciudad[] = response.data.data.map((item) => ({
      idCiudad: item.idCiudad,
      nombre: item.nombreCiudad,
      precioCiudad: item.costoPor_Ciudad,
    }));
    console.log('fetchCiudades: Datos transformados:', JSON.stringify(transformedData, null, 2));
    return { ...response.data, data: transformedData };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al cargar las ciudades';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      console.error(`fetchCiudades: Error ${status}: ${errorMessage}`, error.response?.data);
      if (status === 401) {
        window.location.href = '/login';
      }
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    console.error('fetchCiudades: Error desconocido:', error);
    throw new Error('Error desconocido al cargar las ciudades');
  }
};


// Obtener lista de categorías
export const fetchCategoriasEnvio = async (): Promise<ApiResponse<CategoriaEnvio[]>> => {
  try {
    const response: AxiosResponse<ApiResponse<CategoriaEnvio[]>> = await axiosInstance.get('/gestion_categoria_envios');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al cargar las categorías';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    throw new Error('Error desconocido al cargar las categorías');
  }
};

// Crear una recogida
export const createRecogida = async (data: RecogidaData): Promise<ApiResponse<{ idRecogida: number }>> => {
  try {
    const response: AxiosResponse<ApiResponse<{ idRecogida: number }>> = await axiosInstance.post(
      '/gestion_recogidas/crear_recogida',
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al crear la recogida';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    throw new Error('Error desconocido al crear la recogida');
  }
};

// Crear una entrega
export const createEntrega = async (data: EntregaData): Promise<ApiResponse<{ idEntrega: number }>> => {
  try {
    const response: AxiosResponse<ApiResponse<{ idEntrega: number }>> = await axiosInstance.post(
      '/gestion_entregas/crear_entrega',
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al crear la entrega';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    throw new Error('Error desconocido al crear la entrega');
  }
};

// Crear un envío
export const createEnvio = async (data: EnvioData): Promise<ApiResponse<Envio>> => {
  try {
    const response: AxiosResponse<ApiResponse<Envio>> = await axiosInstance.post('/gestion_envios/crear_envio', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al crear el envío';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    throw new Error('Error desconocido al crear el envío');
  }
};

// Métodos existentes
export const fetchEnvios = async (): Promise<ApiResponse<Envio[]>> => {
  try {
    const response: AxiosResponse<ApiResponse<Envio[]>> = await axiosInstance.get('/gestion_envios');
    console.log('Respuesta completa del servidor:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al cargar los envíos';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    throw new Error('Error desconocido al cargar los envíos');
  }
};

export const fetchEnvioPorId = async (idEnvio: number): Promise<ApiResponse<Envio>> => {
  try {
    const response: AxiosResponse<ApiResponse<Envio>> = await axiosInstance.get(`/gestion_envios/buscar_envio/${idEnvio}`);
    console.log('Respuesta completa del servidor (búsqueda por ID):', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al buscar el envío';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    throw new Error('Error desconocido al buscar el envío');
  }
};