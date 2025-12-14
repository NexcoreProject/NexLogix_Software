import { axiosInstance } from '../../services/axiosConfig';
import { IReporte, IReporte_ApiResponse } from "../../models/Interfaces/IReportes";

const BASE_URL = "/gestion_reportes"; // relative to axiosInstance.baseURL (/api)

// GET: Reportes (paginated)
export const fetchReportes = async (page?: number): Promise<IReporte_ApiResponse<IReporte[]>> => {
  const url = page ? `${BASE_URL}/page/${page}` : BASE_URL;
  const response = await axiosInstance.get<IReporte_ApiResponse<IReporte[]>>(url);
  return response.data;
};

// POST: Crear reporte
export const createReporte = async (
  data: { tipoReporte: string; descripcion: string; idcategoriaReportes?: number }
): Promise<IReporte_ApiResponse<IReporte>> => {
  const response = await axiosInstance.post<IReporte_ApiResponse<IReporte>>(`${BASE_URL}`, data);
  return response.data;
};

// PATCH: Editar reporte
export const updateReporte = async (id: number, data: Partial<Omit<IReporte, "idReporte" | "users"> & { idcategoriaReportes?: number }>): Promise<IReporte_ApiResponse<IReporte>> => {
  const response = await axiosInstance.patch<IReporte_ApiResponse<IReporte>>(`${BASE_URL}/${id}`, data);
  return response.data;
};

// DELETE: Eliminar reporte
export const deleteReporte = async (id: number): Promise<IReporte_ApiResponse<null>> => {
  const response = await axiosInstance.delete<IReporte_ApiResponse<null>>(`${BASE_URL}/${id}`);
  return response.data;
};