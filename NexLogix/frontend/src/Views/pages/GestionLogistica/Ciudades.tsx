import React, { useEffect } from 'react';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import '../../Styles/Home/TablesStyle.css';
import { useCiudadesController, useCreateCiudadController } from '../../../Controllers/Ciudades/CiudadesController';
import { CreateCiudadState } from '../../../Controllers/Ciudades/CiudadesController';
import { ICiudad } from '../../../models/Interfaces/ICiudades';

const Ciudades: React.FC = () => {
  // Controller para listar, buscar y eliminar
  const {
    state: ciudadesState,
    fetchCiudadesData,
    handleSearchChange,
    handleSearch,
    resetSearch,
    deleteCiudadById
  } = useCiudadesController();

  // Controller para crear y editar
  const {
    state: createState,
    handleInputChange,
    handleCreateSubmit,
    handleUpdateSubmit,
    setState: setCreateState
  } = useCreateCiudadController() as ReturnType<typeof useCreateCiudadController> & { setState: React.Dispatch<React.SetStateAction<CreateCiudadState>> };

  // Estados para modales locales
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editCiudad, setEditCiudad] = React.useState<ICiudad | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedCiudad, setSelectedCiudad] = React.useState<ICiudad | null>(null);

  // Cargar ciudades al montar
  useEffect(() => {
    fetchCiudadesData();
  }, [fetchCiudadesData]);

  // Abrir modal de editar
  const handleEdit = (ciudad: ICiudad) => {
    setEditCiudad(ciudad);
    setCreateState((prev: CreateCiudadState) => ({
      ...prev,
      formData: {
        nombreCiudad: ciudad.nombreCiudad,
        costoPor_Ciudad: ciudad.costoPor_Ciudad
      },
      errors: {},
      errorMessage: '',
      successMessage: ''
    }));
    setShowEditModal(true);
  };

  // Abrir modal de eliminar
  const handleDelete = (ciudad: ICiudad) => {
    setSelectedCiudad(ciudad);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!selectedCiudad) return;
    await deleteCiudadById(selectedCiudad.idCiudad);
    setShowDeleteModal(false);
    setSelectedCiudad(null);
    fetchCiudadesData();
  };

  return (
    <div className='areas_container'>
      

      <div className="container mt-4">
        {/* Barra de búsqueda y botones */}
        <div className="header-azul mb-3">
          <div className="d-flex align-items-center p-3">
            <i className="bi bi-diagram-3-fill me-2" style={{ fontSize: 24 }} />
            <h2 className="mb-0 text-white">Gestión de Ciudades</h2>
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
                    placeholder="Buscar ciudad por ID..."
                    value={ciudadesState.searchId}
                    onChange={handleSearchChange}
                    style={{ minWidth: 0, borderRadius: '0.5rem' }}
                  />
                <div className="d-flex gap-2 ms-2">
                  <button
                    className="btn btn-primary"
                    style={{ minWidth: 120, height: "38px", whiteSpace: "nowrap", padding: "0 1rem", fontSize: "1rem", lineHeight: "1.5", borderRadius: ".375rem" }}
                    onClick={handleSearch}
                  >
                    Buscar por ID
                  </button>
                  <button
                    className="btn btn-success"
                    style={{ minWidth: 120, height: "38px", whiteSpace: "nowrap", padding: "0 1rem", fontSize: "1rem", lineHeight: "1.5", borderRadius: ".375rem" }}
                    onClick={resetSearch}
                  >
                    Mostrar todos
                  </button>
                  <button
                    className="btn btn-warning"
                    style={{ minWidth: 120, height: "38px", whiteSpace: "nowrap", padding: "0 1rem", fontSize: "1rem", lineHeight: "1.5", borderRadius: ".375rem" }}
                    onClick={() => setShowCreateModal(true)}
                  >
                    Crear ciudad
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla de ciudades */}
            <div className="custom-table-wrapper">
              {ciudadesState.loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 120 }}>
                  <span className="spinner-border text-primary me-2" role="status" aria-hidden="true"></span>
                  <span className="fw-bold" style={{ color: 'white' }}>Cargando...</span>
                </div>
              ) : (
                <table className="table custom-table">
                  <thead>
                    <tr>
                      <th>Nombre de la Ciudad</th>
                      <th>Costo por Ciudad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ciudadesState.ciudades.length > 0 ? (
                      ciudadesState.ciudades.map((ciudad) => (
                        <tr key={ciudad.idCiudad}>
                          <td>{ciudad.nombreCiudad}</td>
                          <td>{Number(ciudad.costoPor_Ciudad).toFixed(2)}</td>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleEdit(ciudad)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(ciudad)}
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
                        <td colSpan={4} className="text-center py-4">
                          <div className="text-muted">No se encontraron ciudades</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Modal para crear ciudad */}
        {showCreateModal && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal">
              <h5 className="modal-title">Crear Ciudad</h5>
              <form onSubmit={async (e) => {
                await handleCreateSubmit(e);
                setShowCreateModal(false);
                fetchCiudadesData();
              }}>
                <div className="crear-conductor-form">
                  <div className="mb-2">
                    <label className="form-label">Nombre de la Ciudad</label>
                    <input
                      className="form-control"
                      name="nombreCiudad"
                      placeholder="Nombre de la Ciudad"
                      value={createState.formData.nombreCiudad}
                      onChange={handleInputChange}
                      required
                    />
                    {createState.errors.nombreCiudad && <div className="text-danger small">{createState.errors.nombreCiudad}</div>}
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Costo por Ciudad</label>
                    <input
                      className="form-control"
                      name="costoPor_Ciudad"
                      placeholder="Costo por Ciudad"
                      type="number"
                      value={createState.formData.costoPor_Ciudad}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                    {createState.errors.costoPor_Ciudad && <div className="text-danger small">{createState.errors.costoPor_Ciudad}</div>}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={createState.loading}
                  >
                    Guardar
                  </button>
                </div>
                {createState.errorMessage && <div className="text-danger small mt-2">{createState.errorMessage}</div>}
                {createState.successMessage && <div className="text-success small mt-2">{createState.successMessage}</div>}
              </form>
            </div>
          </div>
        )}

        {/* Modal para editar ciudad */}
        {showEditModal && editCiudad && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal">
              <h5 className="modal-title">Editar Ciudad</h5>
              <form onSubmit={async (e) => {
                e.preventDefault();
                await handleUpdateSubmit(editCiudad.idCiudad);
                // Solo cerrar y limpiar si NO hay error
                setTimeout(() => {
                  setCreateState((prev: CreateCiudadState) => ({
                    ...prev,
                    formData: { nombreCiudad: '', costoPor_Ciudad: 0 },
                    errors: {},
                    errorMessage: '',
                    successMessage: ''
                  }));
                  setShowEditModal(false);
                  fetchCiudadesData();
                }, 300);
              }}>
                <div className="crear-conductor-form">
                  <div className="mb-2">
                    <label className="form-label">Nombre de la Ciudad</label>
                    <input
                      className="form-control"
                      name="nombreCiudad"
                      value={createState.formData.nombreCiudad}
                      onChange={handleInputChange}
                      required
                    />
                    {createState.errors.nombreCiudad && <div className="text-danger small">{createState.errors.nombreCiudad}</div>}
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Costo por Ciudad</label>
                    <input
                      className="form-control"
                      name="costoPor_Ciudad"
                      value={createState.formData.costoPor_Ciudad}
                      onChange={handleInputChange}
                      type="number"
                      required
                      min="0"
                    />
                    {createState.errors.costoPor_Ciudad && <div className="text-danger small">{createState.errors.costoPor_Ciudad}</div>}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setCreateState((prev: CreateCiudadState) => ({
                        ...prev,
                        formData: { nombreCiudad: '', costoPor_Ciudad: 0 },
                        errors: {},
                        errorMessage: '',
                        successMessage: ''
                      }));
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={createState.loading}
                  >
                    Guardar
                  </button>
                </div>
                {createState.errorMessage && <div className="text-danger small mt-2">{createState.errorMessage}</div>}
                {createState.successMessage && <div className="text-success small mt-2">{createState.successMessage}</div>}
              </form>
            </div>
          </div>
        )}

        {/* Modal para eliminar ciudad */}
        {showDeleteModal && selectedCiudad && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal" style={{ maxWidth: 380 }}>
              <h5 className="modal-title mb-3 text-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Confirmar Eliminación
              </h5>
              <div className="mb-3">
                ¿Estás seguro que deseas eliminar esta ciudad? Esta acción no se puede deshacer.
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
                  onClick={confirmDelete}
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

export default Ciudades;