import { AxiosResponse } from "axios";
import { IRol, IRol_ApiResponse } from "../../models/Interfaces/IRoles";
import { axiosInstance } from '../axiosConfig';

// GET: Todos los roles
export const fetchRoles = async (): Promise<IRol_ApiResponse<IRol[]>> => {
  const response: AxiosResponse<IRol_ApiResponse<IRol[]>> = await axiosInstance.get('/gestion_roles');
  return response.data;
};

// POST: Crear rol
export const createRol = async (
  data: { nombreRole: string; descripcionRole: string }
): Promise<IRol_ApiResponse<IRol>> => {
  const response: AxiosResponse<IRol_ApiResponse<IRol>> = await axiosInstance.post('/gestion_roles', data);
  return response.data;
};

// PATCH: Editar rol
export const updateRol = async (
  id: number,
  data: { nombreRole: string; descripcionRole: string }
): Promise<IRol_ApiResponse<IRol>> => {
  const response: AxiosResponse<IRol_ApiResponse<IRol>> = await axiosInstance.patch(`/gestion_roles/${id}`, data);
  return response.data;
};

// DELETE: Eliminar rol
export const deleteRol = async (id: number): Promise<IRol_ApiResponse<null>> => {
  const response: AxiosResponse<IRol_ApiResponse<null>> = await axiosInstance.delete(`/gestion_roles/${id}`);
  return response.data;
};