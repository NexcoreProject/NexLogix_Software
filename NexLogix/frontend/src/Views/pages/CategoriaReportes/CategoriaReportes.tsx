import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import './../../Styles/NavBar/Administracion/GeneralStyle.css';
import './../../Styles/Home/TablesStyle.css'
import './../../Styles/NavBar/Logistica/ListaVehiculos.css';
import '../../Styles/Home/TablesStyle.css'
import { useCategoriaReportesController } from '../../../Controllers/CategoriaReportes/CategoriaReportesController';
import { ICategoriaReporte } from '../../../models/Interfaces/ICategoriaReportes';

const CategoriaReportes: React.FC = () => {
  const { categorias, setCategorias, cargarCategorias, createCategoria, updateCategoria, deleteCategoria, currentPage, setPage, hasNext } = useCategoriaReportesController();
  const [searchId, setSearchId] = useState("");
  const [filteredCategorias, setFilteredCategorias] = useState<ICategoriaReporte[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategoria, setEditCategoria] = useState<ICategoriaReporte | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<ICategoriaReporte | null>(null);

  // Formularios controlados
  const [formNombreCategoria, setFormNombreCategoria] = useState('');

  // cargarCategorias se dispara desde el controller hook al montar, pero
  // dejamos un efecto de respaldo por si se necesita recargar manualmente.
  useEffect(() => {
    // ensure filtered list sync on first render
    setFilteredCategorias(categorias);
  }, []);

  useEffect(() => {
    setFilteredCategorias(categorias);
  }, [categorias]);

  const handleSearch = () => {
    if (searchId.trim() === "") {
      setFilteredCategorias(categorias);
    } else {
      setFilteredCategorias(categorias.filter(c => c.idcategoria.toString() === searchId.trim()));
    }
  };

  const resetSearch = () => {
    setSearchId("");
    setFilteredCategorias(categorias);
  };

  // Crear categoría
  const handleCreate = async () => {
    try {
      const res = await createCategoria({ nombreCategoria: formNombreCategoria });
      if (res && res.success && res.data) {
        // añadir a lista local y recargar para consistencia
        setCategorias(prev => [...prev, res.data]);
        await cargarCategorias();
      }
    } catch (error) {
      console.error('Error creando categoria:', error);
    } finally {
      setFormNombreCategoria('');
      setShowCreateModal(false);
    }
  };

  // Editar categoría
  const handleEdit = (categoria: ICategoriaReporte) => {
    setEditCategoria(categoria);
    setFormNombreCategoria(categoria.nombreCategoria);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editCategoria) return;
    try {
      const res = await updateCategoria(editCategoria.idcategoria, { nombreCategoria: formNombreCategoria });
      if (res && res.success && res.data) {
        setCategorias(prev => prev.map(c => c.idcategoria === editCategoria.idcategoria ? res.data : c));
        await cargarCategorias();
      }
    } catch (error) {
      console.error('Error actualizando categoria:', error);
    } finally {
      setShowEditModal(false);
      setEditCategoria(null);
    }
  };

  // Eliminar categoría
  const handleDelete = (categoria: ICategoriaReporte) => {
    setSelectedCategoria(categoria);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategoria) return;
    try {
      const res = await deleteCategoria(selectedCategoria.idcategoria);
      if (res && res.success) {
        setCategorias(prev => prev.filter(c => c.idcategoria !== selectedCategoria.idcategoria));
        await cargarCategorias();
      }
    } catch (error) {
      console.error('Error eliminando categoria:', error);
    } finally {
      setShowDeleteModal(false);
      setSelectedCategoria(null);
    }
  };

  return (
    <div className='areas_container'>
      <div className="container mt-4">
        {/* Header azul */}
        <div className="header-azul mb-3">
          <div className="d-flex align-items-center p-3">
            <i className="bi bi-tags-fill me-2" style={{ fontSize: 24 }} />
            <h2 className="mb-0 text-white">Gestión de Categorías de Reportes</h2>
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
                    placeholder="Buscar categoría por ID..."
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
                    style={{ minWidth: 0, borderRadius: '0.5rem' }}
                  />
              </div>
              <div className="d-flex gap-2 ms-2">
                <button className="btn btn-primary" style={{ minWidth: 140 }} onClick={handleSearch}>
                  Buscar por ID
                </button>
                <button className="btn btn-success" style={{ minWidth: 140 }} onClick={resetSearch}>
                  Mostrar todos
                </button>
                <button className="btn btn-warning" style={{ minWidth: 140, width: "100%" }} onClick={() => setShowCreateModal(true)}>
                  Crear categoría
                </button>
              </div>
            </div>

            {/* Tabla de categorías */}
            <div className="custom-table-wrapper">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th>ID Categoría</th>
                    <th>Nombre de Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategorias.length > 0 ? (
                    filteredCategorias.map(categoria => (
                      <tr key={categoria.idcategoria}>
                        <td>{categoria.idcategoria}</td>
                        <td>{categoria.nombreCategoria}</td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                              <button className="btn btn-sm btn-primary" onClick={() => handleEdit(categoria)}>
                                <i className="bi bi-pencil"></i>
                              </button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(categoria)}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-4">
                        <div className="text-muted">No se encontraron categorías</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación simple */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div />
              <div className="d-flex gap-2 align-items-center">
                <button className="btn btn-outline-secondary" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
                  Anterior
                </button>
                <div className="text-white">Página {currentPage}</div>
                <button className="btn btn-outline-secondary" disabled={!hasNext} onClick={() => setPage(currentPage + 1)}>
                  Siguiente
                </button>
              </div>
              <div />
            </div>
          </div>
        </div>

        {/* Modal para crear categoría */}
        {showCreateModal && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal">
              <h5 className="modal-title">Crear Categoría de Reporte</h5>
              <form onSubmit={e => { e.preventDefault(); handleCreate(); }}>
                <div className="crear-conductor-form">
                  <div className="mb-2">
                    <label className="form-label">Nombre de Categoría</label>
                    <input 
                      className="form-control" 
                      value={formNombreCategoria} 
                      onChange={e => setFormNombreCategoria(e.target.value)} 
                      required 
                      placeholder="Ingrese el nombre de la categoría"
                    />
                  </div>
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

        {/* Modal para editar categoría */}
        {showEditModal && editCategoria && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal">
              <h5 className="modal-title">Editar Categoría de Reporte</h5>
              <form onSubmit={e => { e.preventDefault(); handleUpdate(); }}>
                <div className="crear-conductor-form">
                  <div className="mb-2">
                    <label className="form-label">Nombre de Categoría</label>
                    <input 
                      className="form-control" 
                      value={formNombreCategoria} 
                      onChange={e => setFormNombreCategoria(e.target.value)} 
                      required 
                    />
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

        {/* Modal para eliminar categoría */}
        {showDeleteModal && selectedCategoria && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal" style={{ maxWidth: 380 }}>
              <h5 className="modal-title mb-3 text-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Confirmar Eliminación
              </h5>
              <div className="mb-3">
                ¿Estás seguro que deseas eliminar la categoría "{selectedCategoria.nombreCategoria}"? Esta acción no se puede deshacer.
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

export default CategoriaReportes;