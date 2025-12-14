import { useEffect, useState } from "react";
import { ReportesUseCase } from "../../UseCases/Reportes/ReportesUseCase";
import { IReporte, IReporte_ApiResponse } from "../../models/Interfaces/IReportes";

export const useReportesController = () => {
  const [reportes, setReportes] = useState<IReporte[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(12);
  const [total, setTotal] = useState<number | null>(null);
  const useCase = new ReportesUseCase();

  const parseAndSet = (res: IReporte_ApiResponse<IReporte[]>) => {
    if (res.success) {
      setReportes(res.data || []);
      if (res.meta) {
        setCurrentPage(res.meta.page || 1);
        setPerPage(res.meta.perPage || perPage);
        setTotal(res.meta.total ?? null);
      }
    } else {
      setReportes([]);
    }
  };

  const cargarReportes = async (page = 1) => {
    setLoading(true);
    try {
      const res = await useCase.getAllReportes(page);
      parseAndSet(res as IReporte_ApiResponse<IReporte[]>);
    } catch (error) {
      console.error('Error cargando reportes:', error);
      setReportes([]);
    } finally {
      setLoading(false);
    }
  };

  const setPage = async (page: number) => {
    if (page < 1) return;
    await cargarReportes(page);
  };

  const createReport = async (data: { tipoReporte: string; descripcion: string; idcategoriaReportes?: number }) => {
    setLoading(true);
    try {
      const res = await useCase.create(data);
      if (res.success) {
        await cargarReportes(currentPage);
      }
      return res;
    } catch (error) {
      console.error('Error creando reporte:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateReport = async (id: number, data: Partial<Omit<IReporte, 'idReporte' | 'users' | 'categoria_reportes'>> & { idcategoriaReportes?: number }) => {
    setLoading(true);
    try {
      const res = await useCase.update(id, data);
      if (res.success) {
        await cargarReportes(currentPage);
      }
      return res;
    } catch (error) {
      console.error('Error actualizando reporte:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id: number) => {
    setLoading(true);
    try {
      const res = await useCase.delete(id);
      if (res.success) {
        await cargarReportes(currentPage);
      }
      return res;
    } catch (error) {
      console.error('Error eliminando reporte:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReportes(1);
  }, []);

  const hasNext = total === null ? (reportes.length === perPage) : (currentPage < (Math.ceil((total || 0) / perPage)));

  return { reportes, setReportes, loading, cargarReportes, currentPage, setPage, hasNext, perPage, total, createReport, updateReport, deleteReport };
};