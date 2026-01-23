import { axiosInstance } from '../../services/axiosConfig';
import { IReporte } from '../../models/Interfaces/IReportes';

const BASE_URL = '/gestion_reportes_conductores';

export const createReporteConductor = async (data: { idCategoriaReportes: number; descripcion: string; idConductor: number }) => {
  const response = await axiosInstance.post(`${BASE_URL}`, data);
  return response.data as { success: boolean; message?: string; data?: IReporte };
};

export const fetchReportesConductoresPage = async (page = 1) => {
  const response = await axiosInstance.get(`/gestion_reportes_conductores/page/${page}`);
  return response.data;
};
