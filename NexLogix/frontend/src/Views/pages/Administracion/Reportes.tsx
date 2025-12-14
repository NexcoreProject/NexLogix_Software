import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import './../../Styles/NavBar/Administracion/GeneralStyle.css';
import './../../Styles/Home/TablesStyle.css'
import './../../Styles/NavBar/Logistica/ListaVehiculos.css';
import '../../Styles/Home/TablesStyle.css'
import { useReportesController } from '../../../Controllers/Reportes/ReportesController';
import { IReporte } from '../../../models/Interfaces/IReportes';
import { useCategoriaReportesController } from '../../../Controllers/CategoriaReportes/CategoriaReportesController';

const Reportes: React.FC = () => {
  const { reportes, setReportes, cargarReportes, currentPage, setPage, hasNext, loading, createReport, updateReport, deleteReport } = useReportesController();
  const { categorias, allCategorias, fetchAllCategorias, loading: categoriasLoading } = useCategoriaReportesController();
  const [searchId, setSearchId] = useState("");
  const [filteredReportes, setFilteredReportes] = useState<IReporte[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editReporte, setEditReporte] = useState<IReporte | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReporte, setSelectedReporte] = useState<IReporte | null>(null);

  // Formularios controlados
  const [formDescripcion, setFormDescripcion] = useState('');
  const [selectedCategoryForForm, setSelectedCategoriaForForm] = useState<number | undefined>(undefined);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    cargarReportes();
  }, []);

  useEffect(() => {
    setFilteredReportes(reportes);
  }, [reportes]);

  const handleSearch = () => {
    if (searchId.trim() === "") {
      setFilteredReportes(reportes);
    } else {
      setFilteredReportes(reportes.filter(r => r.idReporte.toString() === searchId.trim()));
    }
  };

  const resetSearch = () => {
    setSearchId("");
    setFilteredReportes(reportes);
  };

  // Crear reporte (envía sólo descripción + categoría)
  const handleCreate = async () => {
    const tipo = selectedCategoryForForm ? (allCategorias.find(c => c.idcategoria === selectedCategoryForForm)?.nombreCategoria || 'Otro') : 'Otro';
    const data = {
      tipoReporte: tipo,
      descripcion: formDescripcion,
      idcategoriaReportes: Number(selectedCategoryForForm) || undefined
    };
    setFormErrors([]);
    console.log('Crear reporte - payload:', data);
    try {
      const res = await createReport(data);
      console.log('Crear reporte - respuesta:', res);
      if (res.success && res.data) {
        setShowCreateModal(false);
        setFormDescripcion('');
        setSelectedCategoriaForForm(undefined);
      } else {
        const msgs: string[] = [];
        if (res.message) msgs.push(res.message);
        if (res.errors) {
          // res.errors may be Record<string,string> or Record<string,string[]>
          for (const k of Object.keys(res.errors)) {
            const v: any = (res.errors as any)[k];
            if (Array.isArray(v)) msgs.push(...v.map((s: any) => String(s)));
            else msgs.push(String(v));
          }
        }
        setFormErrors(msgs.length ? msgs : ['No se pudo crear el reporte: respuesta inválida']);
      }
    } catch (error: any) {
      console.error('Error al crear reporte:', error);
      const resp = error?.response?.data;
      if (resp?.errors) {
        const msgs: string[] = [];
        for (const k of Object.keys(resp.errors)) {
          const v = resp.errors[k];
          if (Array.isArray(v)) msgs.push(...v.map((s: any) => String(s)));
          else msgs.push(String(v));
        }
        setFormErrors(msgs);
      } else {
        setFormErrors([resp?.message || error.message || 'Error desconocido al crear reporte']);
      }
    }
  };

  // Editar reporte
  const handleEdit = (reporte: IReporte) => {
    setEditReporte(reporte);
    setFormDescripcion(reporte.descripcion);
    setSelectedCategoriaForForm(reporte.idcategoriaReportes ?? undefined);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editReporte) return;
    const data: Partial<Omit<IReporte, 'idReporte' | 'users' | 'categoria_reportes'>> & { idcategoriaReportes?: number } = {
      descripcion: formDescripcion,
      idcategoriaReportes: Number(selectedCategoryForForm) || undefined
    };
    setFormErrors([]);
    console.log('Actualizar reporte - payload:', data);
    try {
      const res = await updateReport(editReporte.idReporte, data);
      console.log('Actualizar reporte - respuesta:', res);
      if (res.success && res.data) {
        setShowEditModal(false);
        setEditReporte(null);
        setSelectedCategoriaForForm(undefined);
      } else {
        const msgs: string[] = [];
        if (res.message) msgs.push(res.message);
        if (res.errors) {
          for (const k of Object.keys(res.errors)) {
            const v: any = (res.errors as any)[k];
            if (Array.isArray(v)) msgs.push(...v.map((s: any) => String(s)));
            else msgs.push(String(v));
          }
        }
        setFormErrors(msgs.length ? msgs : ['No se pudo actualizar el reporte: respuesta inválida']);
      }
    } catch (error: unknown) {
      console.error('Error al actualizar reporte:', error);
      const axiosErr = error as import('axios').AxiosError<Record<string, unknown>>;
      const resp = axiosErr?.response?.data as { errors?: Record<string, string | string[]>; message?: string } | undefined;
      console.error('Server response body:', resp);
      if (resp?.errors) {
        const msgs: string[] = [];
        for (const k of Object.keys(resp.errors)) {
          const v = resp.errors[k];
          if (Array.isArray(v)) msgs.push(...v.map((s: unknown) => String(s)));
          else msgs.push(String(v));
        }
        setFormErrors(msgs);
      } else {
        setFormErrors([resp?.message || String(axiosErr?.message) || 'Error desconocido al actualizar reporte']);
      }
    }
  };

  // Eliminar reporte
  const handleDelete = (reporte: IReporte) => {
    setSelectedReporte(reporte);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedReporte) return;
    const res = await deleteReport(selectedReporte.idReporte);
    if (res.success) {
      setShowDeleteModal(false);
      setSelectedReporte(null);
    }
  };

  return (
    <div className='areas_container'>
      <div className="container mt-4">
        {/* Barra de búsqueda y botones */}
        <div className="header-azul mb-3">
          <div className="d-flex align-items-center p-3">
            <i className="bi bi-file-earmark-bar-graph-fill me-2" style={{ fontSize: 24 }} />
            <h2 className="mb-0 text-white">Gestión de Reportes</h2>
          </div>
        </div>
        {/* Barra de búsqueda con 3 botones */}
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-4 align-items-center">
              <div className="d-flex align-items-center" style={{ flex: 1, minWidth: 0 }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar reporte por ID..."
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
                    style={{ minWidth: 0, borderRadius: '0.5rem' }}
                  />
                  <div className="d-flex gap-2 ms-2">
                  <button className="btn btn-primary" style={{ minWidth: 140 }} onClick={handleSearch}>
                    Buscar por ID
                  </button>
                  <button className="btn btn-success" style={{ minWidth: 140 }} onClick={resetSearch}>
                    Mostrar todos
                  </button>
                  <button className="btn btn-warning" style={{ minWidth: 140, width: "100%" }} onClick={async () => { if (allCategorias.length === 0) await fetchAllCategorias(); setFormErrors([]); setShowCreateModal(true); }}>
                    Crear reporte
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla de reportes */}
            <div className="custom-table-wrapper">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th>ID Reporte</th>
                    <th>Tipo de Reporte</th>
                    <th>Descripción</th>
                    <th>Fecha de Creación</th>
                    <th>Usuario</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReportes.length > 0 ? (
                    filteredReportes.map((reporte) => (
                      <tr key={reporte.idReporte}>
                        <td>{reporte.idReporte}</td>
                        <td>{reporte.tipoReporte ?? (reporte.categoria_reportes ? reporte.categoria_reportes.nombreCategoria : '')}</td>
                        <td>{reporte.descripcion}</td>
                        <td>{reporte.fechaCreacion}</td>
                        <td>{reporte.users ? reporte.users.nombreCompleto : ''}</td>
                        <td>{reporte.categoria_reportes ? reporte.categoria_reportes.nombreCategoria : ''}</td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                              <button className="btn btn-sm btn-primary" onClick={() => handleEdit(reporte)}>
                                <i className="bi bi-pencil"></i>
                              </button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(reporte)}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                      <tr>
                      <td colSpan={7} className="text-center py-4">
                        <div className="text-muted">No se encontraron reportes</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div />
              <div className="d-flex gap-2 align-items-center">
                <button className="btn btn-outline-secondary" disabled={currentPage <= 1 || loading} onClick={() => setPage(currentPage - 1)}>
                  Anterior
                </button>
                <div className="text-white">Página {currentPage}</div>
                <button className="btn btn-outline-secondary" disabled={!hasNext || loading} onClick={() => setPage(currentPage + 1)}>
                  Siguiente
                </button>
              </div>
              <div />
            </div>
          </div>
        </div>

        {/* Modal para crear reporte */}
        {showCreateModal && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal">
              <h5 className="modal-title">Crear Reporte</h5>
              <form onSubmit={e => { e.preventDefault(); handleCreate(); }}>
                <div className="crear-conductor-form">
                  {/* Tipo de Reporte eliminado: backend usa sólo categoría + descripción */}
                  <div className="mb-2">
                    <label className="form-label">Descripción</label>
                    <input className="form-control" value={formDescripcion} onChange={e => setFormDescripcion(e.target.value)} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Categoría</label>
                    <select className="form-select" value={selectedCategoryForForm ?? ''} onChange={e => setSelectedCategoriaForForm(e.target.value ? Number(e.target.value) : undefined)}>
                      <option value="">-- Seleccionar categoría --</option>
                      {allCategorias.map(c => (
                        <option key={c.idcategoria} value={c.idcategoria}>{c.nombreCategoria}</option>
                      ))}
                    </select>
                  </div>
                  {formErrors.length > 0 && (
                    <div className="mb-2">
                      {formErrors.map((err, i) => (
                        <div key={i} className="text-danger">{err}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal para editar reporte */}
        {showEditModal && editReporte && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal">
              <h5 className="modal-title">Editar Reporte</h5>
              <form onSubmit={e => { e.preventDefault(); handleUpdate(); }}>
                <div className="crear-conductor-form">
                  {/* Tipo de Reporte eliminado: backend usa sólo categoría + descripción */}
                  <div className="mb-2">
                    <label className="form-label">Descripción</label>
                    <input className="form-control" value={formDescripcion} onChange={e => setFormDescripcion(e.target.value)} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Categoría</label>
                    <select className="form-select" value={selectedCategoryForForm ?? ''} onChange={e => setSelectedCategoriaForForm(e.target.value ? Number(e.target.value) : undefined)}>
                      <option value="">-- Seleccionar categoría --</option>
                      {allCategorias.map(c => (
                        <option key={c.idcategoria} value={c.idcategoria}>{c.nombreCategoria}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal para eliminar reporte */}
        {showDeleteModal && selectedReporte && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal" style={{ maxWidth: 380 }}>
              <h5 className="modal-title mb-3 text-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Confirmar Eliminación
              </h5>
              <div className="mb-3">
                ¿Estás seguro que deseas eliminar este reporte? Esta acción no se puede deshacer.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reportes;