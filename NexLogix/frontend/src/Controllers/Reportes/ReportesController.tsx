import { useEffect, useState, useCallback, useRef } from "react";
import { ReportesUseCase } from "../../UseCases/Reportes/ReportesUseCase";
import { IReporte, IReporte_ApiResponse } from "../../models/Interfaces/IReportes";

export const useReportesController = () => {
  const [reportes, setReportes] = useState<IReporte[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(12);
  const [total, setTotal] = useState<number | null>(null);
  const useCaseRef = useRef<ReportesUseCase>(new ReportesUseCase());

  const parseAndSet = useCallback((res: IReporte_ApiResponse<IReporte[]>) => {
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
  }, [perPage]);

  const cargarReportes = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await useCaseRef.current.getAllReportes(page);
      parseAndSet(res as IReporte_ApiResponse<IReporte[]>);
    } catch (error) {
      console.error('Error cargando reportes:', error);
      setReportes([]);
    } finally {
      setLoading(false);
    }
  }, [parseAndSet]);

  const setPage = useCallback(async (page: number) => {
    if (page < 1) return;
    await cargarReportes(page);
  }, [cargarReportes]);

  const createReport = useCallback(async (data: { tipoReporte: string; descripcion: string; idcategoriaReportes?: number }) => {
    setLoading(true);
    try {
      const res = await useCaseRef.current.create(data);
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
  }, [cargarReportes, currentPage]);

  const updateReport = useCallback(async (id: number, data: Partial<Omit<IReporte, 'idReporte' | 'users' | 'categoria_reportes'>> & { idcategoriaReportes?: number }) => {
    setLoading(true);
    try {
      const res = await useCaseRef.current.update(id, data);
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
  }, [cargarReportes, currentPage]);

  const deleteReport = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const res = await useCaseRef.current.delete(id);
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
  }, [cargarReportes, currentPage]);

  useEffect(() => {
    cargarReportes(1);
  }, [cargarReportes]);

  const hasNext = total === null ? (reportes.length === perPage) : (currentPage < (Math.ceil((total || 0) / perPage)));

  return { reportes, setReportes, loading, cargarReportes, currentPage, setPage, hasNext, perPage, total, createReport, updateReport, deleteReport };
};