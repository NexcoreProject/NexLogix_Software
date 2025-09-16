import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import './../../Styles/NavBar/Administracion/GeneralStyle.css';
import './../../Styles/Home/TablesStyle.css'
import './../../Styles/NavBar/Logistica/ListaVehiculos.css';
import '../../Styles/Home/TablesStyle.css'
import { useRolesController } from "../../../Controllers/Roles/RolesController";
import { IRol } from "../../../models/Interfaces/IRoles";

const Roles: React.FC = () => {
  const { roles, setRoles, cargarRoles, useCase } = useRolesController();
  const [searchId, setSearchId] = useState("");
  const [filteredRoles, setFilteredRoles] = useState<IRol[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRol, setEditRol] = useState<IRol | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRol, setSelectedRol] = useState<IRol | null>(null);

  // Formularios controlados
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');

  useEffect(() => {
    cargarRoles();
  }, []);

  useEffect(() => {
    setFilteredRoles(roles);
  }, [roles]);

  // Buscar por ID
  const handleSearch = () => {
    if (searchId.trim() === "") {
      setFilteredRoles(roles);
    } else {
      setFilteredRoles(roles.filter(r => r.idRole.toString() === searchId.trim()));
    }
  };

  // Mostrar todos
  const resetSearch = () => {
    setSearchId("");
    setFilteredRoles(roles);
  };

  // Crear rol
  const handleCreate = async () => {
    const data = {
      nombreRole: formNombre,
      descripcionRole: formDescripcion
    };
    const res = await useCase.create(data);
    if (res.success && res.data) {
      setShowCreateModal(false);
      setFormNombre('');
      setFormDescripcion('');
      await cargarRoles(); // <-- recarga la lista completa
    }
  };

  // Abrir modal de editar
  const handleEdit = (rol: IRol) => {
    setEditRol(rol);
    setFormNombre(rol.nombreRole);
    setFormDescripcion(rol.descripcionRole);
    setShowEditModal(true);
  };

  // Actualizar rol
  const handleUpdate = async () => {
    if (!editRol) return;
    const data = {
      nombreRole: formNombre,
      descripcionRole: formDescripcion
    };
    const res = await useCase.update(editRol.idRole, data);
    if (res.success && res.data) {
      setShowEditModal(false);
      setEditRol(null);
      await cargarRoles(); // <-- recarga la lista completa
    }
  };

  // Eliminar rol
  const handleDelete = (rol: IRol) => {
    setSelectedRol(rol);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedRol) return;
    const res = await useCase.delete(selectedRol.idRole);
    if (res.success) {
      setRoles(roles.filter(r => r.idRole !== selectedRol.idRole));
      setShowDeleteModal(false);
      setSelectedRol(null);
    }
  };

  return (
    <div className='areas_container'>
      <div className="container mt-4">
        {/* Barra de búsqueda y botones */}
        <div className="header-azul mb-3">
          <div className="d-flex align-items-center p-3">
            <i className="bi bi-person-badge-fill me-2" style={{ fontSize: 24 }} />
            <h2 className="mb-0 text-white">Gestión de Roles</h2>
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
                    placeholder="Buscar rol por ID..."
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
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
                  <button
                    className="btn btn-warning"
                    style={{ minWidth: 140, width: "100%" }}
                    onClick={() => setShowCreateModal(true)}
                  >
                    Crear rol
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla de roles */}
            <div className="custom-table-wrapper">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th>ID Rol</th>
                    <th>Nombre del Rol</th>
                    <th>Descripción</th>
                    <th>Fecha creacion Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((rol) => (
                      <tr key={rol.idRole}>
                        <td>{rol.idRole}</td>
                        <td>{rol.nombreRole}</td>
                        <td>{rol.descripcionRole}</td>
                        <td>{rol.fechaAsignacionRole}</td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleEdit(rol)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(rol)}
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
                        <div className="text-muted">No se encontraron roles</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal para crear rol */}
        {showCreateModal && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal" style={{ maxWidth: 600, width: "100%" }}>
              <h5 className="modal-title">Crear Rol</h5>
              <form>
                <div className="crear-conductor-form">
                  <div className="mb-3">
                    <label className="form-label">Nombre del Rol</label>
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Nombre del Rol"
                      value={formNombre}
                      onChange={e => setFormNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control form-control-lg"
                      style={{ minHeight: 100 }}
                      placeholder="Descripción"
                      value={formDescripcion}
                      onChange={e => setFormDescripcion(e.target.value)}
                    />
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
                    type="button"
                    className="btn btn-success"
                    onClick={handleCreate}
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal para editar rol */}
        {showEditModal && editRol && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal" style={{ maxWidth: 600, width: "100%" }}>
              <h5 className="modal-title">Editar Rol</h5>
              <form>
                <div className="crear-conductor-form">
                  <div className="mb-3">
                    <label className="form-label">Nombre del Rol</label>
                    <select
                      className="form-control form-control-lg"
                      value={formNombre}
                      onChange={e => setFormNombre(e.target.value)}
                      required
                    >
                      <option value="">Selecciona un rol...</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Manager">Manager</option>
                      <option value="Empleado">Empleado</option>
                      <option value="Conductor">Conductor</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control form-control-lg"
                      style={{ minHeight: 100 }}
                      value={formDescripcion}
                      onChange={e => setFormDescripcion(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleUpdate}
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal para eliminar rol */}
        {showDeleteModal && selectedRol && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal" style={{ maxWidth: 380 }}>
              <h5 className="modal-title mb-3 text-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Confirmar Eliminación
              </h5>
              <div className="mb-3">
                ¿Estás seguro que deseas eliminar este rol? Esta acción no se puede deshacer.
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

export default Roles;