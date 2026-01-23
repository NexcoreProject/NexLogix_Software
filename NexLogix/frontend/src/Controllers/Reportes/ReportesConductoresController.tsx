import { useState } from 'react';
import { createReporteConductor, fetchReportesConductoresPage } from '../../services/Reportes/ReportesConductoresService';
import { IReporte } from '../../models/Interfaces/IReportes';

export const useReportesConductoresController = () => {
  const [loading, setLoading] = useState(false);
  const [reportesConductores, setReportesConductores] = useState<IReporte[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(12);
  const [total, setTotal] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [meta, setMeta] = useState<Record<string, unknown> | null>(null);

  const cargarReportesConductores = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchReportesConductoresPage(page);
      if (res && res.data) {
        setReportesConductores(res.data as IReporte[]);
        const m = res.meta as Record<string, unknown> | undefined;
        setMeta(m ?? null);
        const p = (m && typeof m['page'] === 'number') ? Number(m['page']) : page;
        const per = (m && typeof m['perPage'] === 'number') ? Number(m['perPage']) : perPage;
        const tot = (m && (typeof m['total'] === 'number' || typeof m['total'] === 'string')) ? Number(m['total']) : null;
        setCurrentPage(p);
        setPerPage(per);
        setTotal(tot);
        // compute hasNext consistently using the freshly-parsed meta
        const hasNextComputed = tot === null ? ((res && res.data && (res.data as IReporte[]).length) === per) : (p < (Math.ceil((tot || 0) / per)));
        setHasNext(Boolean(hasNextComputed));
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: { idCategoriaReportes: number; descripcion: string; idConductor: number }) => {
    setLoading(true);
    try {
      const res = await createReporteConductor(data);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const setPage = async (page: number) => {
    if (page < 1) return;
    await cargarReportesConductores(page);
  };

  return { create, loading, reportesConductores, cargarReportesConductores, currentPage, setCurrentPage, setPage, hasNext, meta, perPage, total };
};
