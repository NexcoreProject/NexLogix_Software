import { useEffect, useState } from 'react';
import { axiosInstance } from '../../services/axiosConfig';
import { ICategoriaReporte, ICategoriaReporte_ApiResponse } from '../../models/Interfaces/ICategoriaReportes';

const BASE_URL = 'http://127.0.0.1:8000/api';
const CATEGORIAS_URL = `${BASE_URL}/gestion_categoria_reportes`;

export const useCategoriaReportesController = () => {
	const [categorias, setCategorias] = useState<ICategoriaReporte[]>([]); // paginated current page
	const [allCategorias, setAllCategorias] = useState<ICategoriaReporte[]>([]); // full list for selects
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [lastPageSize, setLastPageSize] = useState<number>(0);
	const PER_PAGE = 15; // coincide con el backend

	const cargarCategorias = async (page = 1, order = 2) => {
		setLoading(true);
		try {
			// order is optional on backend; use provided API route
			const url = `${CATEGORIAS_URL}/page/${page}/${order}`;
			const response = await axiosInstance.get<ICategoriaReporte_ApiResponse<ICategoriaReporte[]>>(url);
			if (response.data && response.data.success) {
				const data = response.data.data || [];
				setCategorias(data);
				setLastPageSize(Array.isArray(data) ? data.length : 0);
				setCurrentPage(page);
			} else {
				setCategorias([]);
			}
		} catch (error) {
			console.error('Error cargando categorias de reportes:', error);
			setCategorias([]);
		} finally {
			setLoading(false);
		}
	};

	const setPage = async (page: number, order = 2) => {
		await cargarCategorias(page, order);
	};

	const getById = async (id: number) => {
		try {
			const response = await axiosInstance.get<ICategoriaReporte_ApiResponse<ICategoriaReporte>>(`${CATEGORIAS_URL}/${id}`);
			return response.data;
		} catch (error) {
			console.error(`Error getById categoria ${id}:`, error);
			throw error;
		}
	};

	// Fetch all categories across pages and accumulate them for selects
	const fetchAllCategorias = async () => {
		setLoading(true);
		try {
			const accumulated: ICategoriaReporte[] = [];
			let page = 1;
			while (true) {
				const url = `${CATEGORIAS_URL}/page/${page}/2`;
				const response = await axiosInstance.get<ICategoriaReporte_ApiResponse<ICategoriaReporte[]>>(url);
				if (!response.data || !response.data.success) break;
				const data = response.data.data || [];
				if (!Array.isArray(data) || data.length === 0) break;
				accumulated.push(...data);
				if (data.length < PER_PAGE) break; // last page
				page += 1;
			}
			// deduplicate by idcategoria (safety)
			const map = new Map<number, ICategoriaReporte>();
			for (const c of accumulated) map.set(c.idcategoria, c);
			setAllCategorias(Array.from(map.values()));
		} catch (error) {
			console.error('Error fetchAllCategorias:', error);
			setAllCategorias([]);
		} finally {
			setLoading(false);
		}
	};

	const createCategoria = async (data: { nombreCategoria: string }) => {
		try {
			const response = await axiosInstance.post<ICategoriaReporte_ApiResponse<ICategoriaReporte>>(CATEGORIAS_URL, data);
			return response.data;
		} catch (error) {
			console.error('Error creando categoria reporte:', error);
			throw error;
		}
	};

	const updateCategoria = async (id: number, data: { nombreCategoria?: string }) => {
		try {
			const response = await axiosInstance.patch<ICategoriaReporte_ApiResponse<ICategoriaReporte>>(`${CATEGORIAS_URL}/${id}`, data);
			return response.data;
		} catch (error) {
			console.error('Error actualizando categoria reporte:', error);
			throw error;
		}
	};

	const deleteCategoria = async (id: number) => {
		try {
			const response = await axiosInstance.delete<ICategoriaReporte_ApiResponse<null>>(`${CATEGORIAS_URL}/${id}`);
			return response.data;
		} catch (error) {
			console.error('Error eliminando categoria reporte:', error);
			throw error;
		}
	};

	useEffect(() => {
		// load paginated list for admin list view
		cargarCategorias(1);
		// also prefetch all categories in background for select controls
		fetchAllCategorias();
	}, []);

	return {
		categorias,
		setCategorias,
		loading,
		cargarCategorias,
		currentPage,
		setPage,
		hasNext: lastPageSize === PER_PAGE,
		getById,
		fetchAllCategorias,
		allCategorias,
		createCategoria,
		updateCategoria,
		deleteCategoria,
	};
};
