import React, { useEffect, useState } from 'react';
import { useAuditoriasController, useEditAuditoriaController } from '../../../Controllers/Auditorias/AuditoriasController';
import { IAuditoria } from '../../../models/Interfaces/IAuditorias';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import './../../Styles/NavBar/Administracion/GeneralStyle.css';
//import './../../Styles/NavBar/ManagerProfile/ListaVehiculos.css';
//import '../../Styles/Home/TablesStyle.css';

const Auditorias: React.FC = () => {
  const {
    state,
    fetchAuditoriasData,
    handleSearchChange,
    handleSearch,
    resetSearch,
    deleteAuditoriaById,
  } = useAuditoriasController();

  // Estados para modales de editar y eliminar
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = useState<IAuditoria | null>(null);
  const [editForm, setEditForm] = useState<{ action: string; resource_type: string }>({ action: '', resource_type: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const { handleUpdateSubmit } = useEditAuditoriaController();

  useEffect(() => {
    fetchAuditoriasData();
  }, [fetchAuditoriasData]);

  const renderDetails = (details: IAuditoria['details']) => {
    if (typeof details === 'string') return details;
    if (Array.isArray(details)) return details.join(', ');
    return Object.entries(details)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  // Abrir modal de editar
  const handleEdit = (auditoria: IAuditoria) => {
    setSelectedAuditoria(auditoria);
    setEditForm({ action: auditoria.action, resource_type: auditoria.resource_type });
    setEditError(null);
    // Actualiza el formData del controller para el PATCH
    // @ts-expect-error: Patch formData on controller for edit modal integration
    handleUpdateSubmit.formData = { action: auditoria.action, resource_type: auditoria.resource_type };
    setShowEditModal(true);
  };

  // Abrir modal de eliminar
  const handleDelete = (auditoria: IAuditoria) => {
    setSelectedAuditoria(auditoria);
    setShowDeleteModal(true);
  };

  // Guardar cambios de edición
  const handleEditSave = async () => {
    if (!selectedAuditoria) return;
    setEditLoading(true);
    setEditError(null);
    try {
      // Actualiza usando el controller y el usecase
      await handleUpdateSubmit(selectedAuditoria.id);
      setShowEditModal(false);
      fetchAuditoriasData();
    } catch {
      setEditError('Error al actualizar la auditoría');
    }
    setEditLoading(false);
  };

  // Confirmar eliminación
  const handleDeleteConfirm = async () => {
    if (!selectedAuditoria) return;
    await deleteAuditoriaById(selectedAuditoria.id);
    setShowDeleteModal(false);
    fetchAuditoriasData();
  };

  return (
    <div className='areas_container'>
      <div className="container mt-4">
        {/* Header azul con icono y título */}
        <div className="header-azul mb-3">
          <div className="d-flex align-items-center p-3">
            <i className="bi bi-clipboard-data me-2" style={{ fontSize: 24 }} />
            <h2 className="mb-0 text-white">Historial de Auditorías</h2>
          </div>
        </div>
        {/* Barra de búsqueda y botones */}
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-4 align-items-center">
              <div className="d-flex align-items-center" style={{ flex: 1, minWidth: 0 }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar auditoría por ID..."
                    value={state.searchId}
                    onChange={handleSearchChange}
                    style={{ minWidth: 0, borderRadius: '0.5rem' }}
                  />
                <div className="d-flex gap-2 ms-2">
                  <button
                    className="btn btn-primary"
                    style={{ minWidth: 140 }}
                    onClick={handleSearch}
                  >
                    Buscar por ID
                  </button>
                  <button
                    className="btn btn-success"
                    style={{ minWidth: 140 }}
                    onClick={resetSearch}
                  >
                    Mostrar todos
                  </button>
                </div>
              </div>
            </div>

            {/* Mensajes de error/carga */}
            {state.error && <div className="alert alert-danger">{state.error}</div>}
            {state.loading && <div className="alert alert-info">Cargando...</div>}

            {/* Tabla de auditorías */}
            <div className="custom-table-wrapper">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Acción</th>
                    <th>Tipo de Recurso</th>
                    <th>Detalles</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {state.auditorias.length > 0 ? (
                    state.auditorias.map((auditoria) => (
                      <tr key={auditoria.id}>
                        <td>{auditoria.id}</td>
                        <td>{auditoria.action}</td>
                        <td>{auditoria.resource_type}</td>
                        <td>{renderDetails(auditoria.details)}</td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleEdit(auditoria)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(auditoria)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        <div className="text-muted">No se encontraron auditorías</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Editar Auditoría */}
        {showEditModal && selectedAuditoria && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal" style={{ minWidth: 900 }}>
              <h5 className="modal-title mb-3">Editar Auditoría</h5>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleEditSave();
                }}
              >
                <div className="custom-table-wrapper mb-3">
                  <table className="table custom-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Acción</th>
                        <th>Usuario</th>
                        <th>Tipo de Recurso</th>
                        <th>Detalles</th>
                        <th>Fecha Creación</th>
                        <th>Fecha Actualización</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{selectedAuditoria.id}</td>
                        <td>
                          <input
                            className="form-control"
                            value={editForm.action}
                            name="action"
                            onChange={e => {
                              setEditForm(f => ({ ...f, action: e.target.value }));
                        // @ts-expect-error: Patch formData on controller for edit modal integration
                              handleUpdateSubmit.formData = { ...handleUpdateSubmit.formData, action: e.target.value };
                            }}
                          />
                        </td>
                        <td>{selectedAuditoria.user_id}</td>
                        <td>
                          <input
                            className="form-control"
                            value={editForm.resource_type}
                            name="resource_type"
                            onChange={e => {
                              setEditForm(f => ({ ...f, resource_type: e.target.value }));
                        // @ts-expect-error: Patch formData on controller for edit modal integration
                              handleUpdateSubmit.formData = { ...handleUpdateSubmit.formData, resource_type: e.target.value };
                            }}
                          />
                        </td>
                        <td>{renderDetails(selectedAuditoria.details)}</td>
                        <td>{selectedAuditoria.created_at}</td>
                        <td>{selectedAuditoria.updated_at}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="submit"
                              className="btn btn-success btn-sm"
                              disabled={editLoading}
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => setShowEditModal(false)}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {editError && <div className="alert alert-danger">{editError}</div>}
              </form>
            </div>
          </div>
        )}

        {/* Modal Eliminar Auditoría */}
        {showDeleteModal && selectedAuditoria && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal" style={{ maxWidth: 380 }}>
              <h5 className="modal-title mb-3 text-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Confirmar Eliminación
              </h5>
              <div className="mb-3">
                ¿Estás seguro que deseas eliminar esta auditoría? Esta acción no se puede deshacer.
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                >
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

export default Auditorias;