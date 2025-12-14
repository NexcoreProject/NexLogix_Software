export interface ICategoriaReporte {
  idcategoria: number;
  nombreCategoria: string;
}

export interface ICategoriaReporte_ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status?: number;
  errors?: Record<string, string>;
}
