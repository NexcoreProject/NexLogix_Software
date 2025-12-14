import { fetchReportes, createReporte, updateReporte, deleteReporte } from "../../services/Reportes/ReportesService";
import { IReporte, IReporte_ApiResponse } from "../../models/Interfaces/IReportes";

export class ReportesUseCase {
  async getAllReportes(page?: number): Promise<IReporte_ApiResponse<IReporte[]>> {
    return await fetchReportes(page);
  }

  async create(data: { tipoReporte: string; descripcion: string; idcategoriaReportes?: number }): Promise<IReporte_ApiResponse<IReporte>> {
    return await createReporte(data);
  }

  async update(id: number, data: Partial<Omit<IReporte, "idReporte" | "users">>): Promise<IReporte_ApiResponse<IReporte>> {
    return await updateReporte(id, data);
  }

  async delete(id: number): Promise<IReporte_ApiResponse<null>> {
    return await deleteReporte(id);
  }
}