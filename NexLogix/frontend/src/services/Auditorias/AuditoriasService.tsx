import axios, { AxiosResponse } from 'axios';
import { IAuditoria, IAuditoriaApiResponse } from '../../models/Interfaces/IAuditorias';
import { axiosInstance } from '../axiosConfig';

export const fetchAuditorias = async (): Promise<IAuditoriaApiResponse<IAuditoria[]>> => {
  try {
    const response: AxiosResponse<IAuditoriaApiResponse<IAuditoria[]>> = await axiosInstance.get('/gestion_auditorias');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message ?? 'Error al cargar las auditorías';
      throw new Error(message);
    }
    throw new Error('Error desconocido al cargar las auditorías');
  }
};

export const fetchAuditoriaById = async (id: number): Promise<IAuditoriaApiResponse<IAuditoria>> => {
  try {
    const response: AxiosResponse<IAuditoriaApiResponse<IAuditoria>> = await axiosInstance.get(`/gestion_auditorias/buscar_auditoria/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message ?? 'Error al cargar la auditoría';
      throw new Error(message);
    }
    throw new Error('Error desconocido al cargar la auditoría');
  }
};

export const updatePartialAuditoria = async (id: number, data: Partial<IAuditoria>): Promise<IAuditoriaApiResponse<IAuditoria>> => {
  try {
    const response: AxiosResponse<IAuditoriaApiResponse<IAuditoria>> = await axiosInstance.patch(`/gestion_auditorias/editar_auditoria/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message ?? 'Error al actualizar la auditoría';
      throw new Error(message);
    }
    throw new Error('Error desconocido al actualizar la auditoría');
  }
};

export const deleteAuditoria = async (id: number): Promise<IAuditoriaApiResponse<null>> => {
  try {
    const response: AxiosResponse<IAuditoriaApiResponse<null>> = await axiosInstance.delete(`/gestion_auditorias/eliminar_auditoria/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message ?? 'Error al eliminar la auditoría';
      throw new Error(message);
    }
    throw new Error('Error desconocido al eliminar la auditoría');
  }
};