import axios, { AxiosResponse } from 'axios';
import { ICiudad, ICiudad_ApiResponse } from '../../models/Interfaces/ICiudades';
import { axiosInstance } from '../axiosConfig';

// GET: Obtener todas las ciudades
export const fetchCiudades = async (): Promise<ICiudad_ApiResponse<ICiudad[]>> => {
  try {
    console.log('fetchCiudades: Enviando solicitud a', '/gestion_ciudades');
    const response: AxiosResponse<ICiudad_ApiResponse<ICiudad[]>> = await axiosInstance.get('/gestion_ciudades');
    console.log('fetchCiudades: Respuesta recibida:', JSON.stringify(response.data, null, 2));
    return response.data;
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
        window.location.href = '/';
      }
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    console.error('fetchCiudades: Error desconocido:', error);
    throw new Error('Error desconocido al cargar las ciudades');
  }
};

// GET: Obtener una ciudad por ID
export const fetchCiudadById = async (id: string | number): Promise<ICiudad_ApiResponse<ICiudad>> => {
  try {
    console.log('fetchCiudadById: Enviando solicitud a', `/gestion_ciudades/${id}`);
    const response: AxiosResponse<ICiudad_ApiResponse<ICiudad>> = await axiosInstance.get(`/gestion_ciudades/${id}`);
    console.log('fetchCiudadById: Respuesta recibida:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al cargar la ciudad';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      console.error(`fetchCiudadById: Error ${status}: ${errorMessage}`, error.response?.data);
      if (status === 401) {
        window.location.href = '/login';
      }
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    console.error('fetchCiudadById: Error desconocido:', error);
    throw new Error('Error desconocido al cargar la ciudad');
  }
};

// POST: Crear una ciudad
export const createCiudad = async (data: { nombreCiudad: string; costoPor_Ciudad: number }): Promise<ICiudad_ApiResponse<ICiudad>> => {
  try {
    console.log('createCiudad: Enviando solicitud a', '/gestion_ciudades', 'con datos:', data);
    const response: AxiosResponse<ICiudad_ApiResponse<ICiudad>> = await axiosInstance.post('/gestion_ciudades', data);
    console.log('createCiudad: Respuesta recibida:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al crear la ciudad';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      console.error(`createCiudad: Error ${status}: ${errorMessage}`, error.response?.data);
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    console.error('createCiudad: Error desconocido:', error);
    throw new Error('Error desconocido al crear la ciudad');
  }
};

// PUT: Editar una ciudad completamente
export const updateCiudad = async (id: number, data: { nombreCiudad: string; costoPor_Ciudad: number }): Promise<ICiudad_ApiResponse<ICiudad>> => {
  try {
    console.log('updateCiudad: Enviando solicitud a', `/gestion_ciudades/${id}`, 'con datos:', data);
    const response: AxiosResponse<ICiudad_ApiResponse<ICiudad>> = await axiosInstance.put(`/gestion_ciudades/${id}`, data);
    console.log('updateCiudad: Respuesta recibida:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al editar la ciudad';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      console.error(`updateCiudad: Error ${status}: ${errorMessage}`, error.response?.data);
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    console.error('updateCiudad: Error desconocido:', error);
    throw new Error('Error desconocido al editar la ciudad');
  }
};

// PATCH: Editar parcialmente una ciudad
export const updatePartialCiudad = async (id: number, data: Partial<{ nombreCiudad: string; costoPor_Ciudad: number }>): Promise<ICiudad_ApiResponse<ICiudad>> => {
  try {
    console.log('updatePartialCiudad: Enviando solicitud a', `/gestion_ciudades/${id}`, 'con datos:', data);
    const response: AxiosResponse<ICiudad_ApiResponse<ICiudad>> = await axiosInstance.patch(`/gestion_ciudades/${id}`, data);
    console.log('updatePartialCiudad: Respuesta recibida:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al actualizar la ciudad';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      console.error(`updatePartialCiudad: Error ${status}: ${errorMessage}`, error.response?.data);
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    console.error('updatePartialCiudad: Error desconocido:', error);
    throw new Error('Error desconocido al actualizar la ciudad');
  }
};

// DELETE: Eliminar una ciudad
export const deleteCiudad = async (id: number): Promise<ICiudad_ApiResponse<null>> => {
  try {
    console.log('deleteCiudad: Enviando solicitud a', `/gestion_ciudades/${id}`);
    const response: AxiosResponse<ICiudad_ApiResponse<null>> = await axiosInstance.delete(`/gestion_ciudades/${id}`);
    console.log('deleteCiudad: Respuesta recibida:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data?.message ?? 'Error al eliminar la ciudad';
      const errors = error.response?.data?.errors ?? {};
      const errorMessage = Object.values(errors).length > 0 
        ? `${message}: ${Object.values(errors).join(', ')}`
        : message;
      console.error(`deleteCiudad: Error ${status}: ${errorMessage}`, error.response?.data);
      throw new Error(`Error ${status}: ${errorMessage}`);
    }
    console.error('deleteCiudad: Error desconocido:', error);
    throw new Error('Error desconocido al eliminar la ciudad');
  }
};