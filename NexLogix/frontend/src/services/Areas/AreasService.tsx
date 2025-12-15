import axios, { AxiosResponse } from 'axios';
import { IArea, IArea_ApiResponse } from '../../models/Interfaces/IAreas';
import { axiosInstance } from '../axiosConfig';

// GET: Obtener todas las áreas
export const fetchAreas = async (): Promise<IArea_ApiResponse<IArea[]>> => {
  try {
    console.log('fetchAreas: Enviando solicitud');
    const response: AxiosResponse<IArea_ApiResponse<IArea[]>> = await axiosInstance.get('/gestion_areas');
    console.log('fetchAreas: Respuesta recibida:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    const status = error.response?.status ?? 500;
    const message = error.response?.data?.message ?? 'Error al cargar las áreas';
    const errors = error.response?.data?.errors ?? {};
    const errorMessage = Object.values(errors).length > 0 
      ? `${message}: ${Object.values(errors).join(', ')}`
      : message;
    console.error(`fetchAreas: Error ${status}: ${errorMessage}`, error.response?.data);
    if (status === 401) {
      window.location.href = '/login';
    }
    throw new Error(`Error ${status}: ${errorMessage}`);
  }
};

// POST: Crear un área
export const createArea = async (data: { nombreArea: string; descripcionArea?: string }): Promise<IArea_ApiResponse<IArea>> => {
  try {
    console.log('createArea: Enviando solicitud a', '/gestion_areas', 'con datos:', data);
    const response: AxiosResponse<IArea_ApiResponse<IArea>> = await axiosInstance.post('/gestion_areas', data);
    console.log('createArea: Respuesta recibida:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al crear el área';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      console.error(`createArea: Error ${status}: ${errorMessage}`, error.response?.data);
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    console.error('createArea: Error desconocido:', error);
    throw new Error('Error desconocido al crear el área');
  }
};

// PUT: Editar un área completa
export const updateArea = async (id: number, data: { nombreArea: string; descripcionArea: string }): Promise<IArea_ApiResponse<IArea>> => {
  try {
    console.log('updateArea: Enviando solicitud a', `/gestion_areas/${id}`, 'con datos:', data);
    const response: AxiosResponse<IArea_ApiResponse<IArea>> = await axiosInstance.put(`/gestion_areas/${id}`, data);
    console.log('updateArea: Respuesta recibida:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al editar el área';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      console.error(`updateArea: Error ${status}: ${errorMessage}`, error.response?.data);
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    console.error('updateArea: Error desconocido:', error);
    throw new Error('Error desconocido al editar el área');
  }
};

// PATCH: Editar parcialmente un área
export const updatePartialArea = async (id: number, data: Partial<{ nombreArea: string; descripcionArea: string }>): Promise<IArea_ApiResponse<IArea>> => {
  try {
    console.log('updatePartialArea: Enviando solicitud a', `/gestion_areas/${id}`, 'con datos:', data);
    const response: AxiosResponse<IArea_ApiResponse<IArea>> = await axiosInstance.patch(`/gestion_areas/${id}`, data);
    console.log('updatePartialArea: Respuesta recibida:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al actualizar el área';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      console.error(`updatePartialArea: Error ${status}: ${errorMessage}`, error.response?.data);
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    console.error('updatePartialArea: Error desconocido:', error);
    throw new Error('Error desconocido al actualizar el área');
  }
};

// DELETE: Eliminar un área
export const deleteArea = async (id: number): Promise<IArea_ApiResponse<null>> => {
  try {
    console.log('deleteArea: Enviando solicitud a', `/gestion_areas/${id}`);
    const response: AxiosResponse<IArea_ApiResponse<null>> = await axiosInstance.delete(`/gestion_areas/${id}`);
    console.log('deleteArea: Respuesta recibida:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al eliminar el área';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      console.error(`deleteArea: Error ${status}: ${errorMessage}`, error.response?.data);
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    console.error('deleteArea: Error desconocido:', error);
    throw new Error('Error desconocido al eliminar el área');
  }
};

// GET: Obtener un área por ID
export const fetchAreaById = async (id: number): Promise<IArea_ApiResponse<IArea>> => {
  try {
    const response: AxiosResponse<IArea_ApiResponse<IArea>> = await axiosInstance.get(`/gestion_areas/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al buscar el área';
      throw new Error(`Error ${status}: ${message}`);
    }
    throw new Error('Error desconocido al buscar el área');
  }
};