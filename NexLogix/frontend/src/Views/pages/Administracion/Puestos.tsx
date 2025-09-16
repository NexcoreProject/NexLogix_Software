import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import './../../Styles/NavBar/Administracion/GeneralStyle.css';
import './../../Styles/Home/TablesStyle.css'
import './../../Styles/NavBar/Logistica/ListaVehiculos.css';
import { IPuesto } from '../../../models/Interfaces/IPuestos';
import { IArea } from '../../../models/Interfaces/IPuestos';
import { fetchPuestos, createPuesto, updatePartialPuesto, deletePuesto, fetchAreas } from '../../../services/Puestos/PuestosService';

const Puestos: React.FC = () => {
  const [puestos, setPuestos] = useState<IPuesto[]>([]);
  const [searchId, setSearchId] = useState("");
  const [filteredPuestos, setFilteredPuestos] = useState<IPuesto[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPuesto, setEditPuesto] = useState<IPuesto | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState<IPuesto | null>(null);
  const [areas, setAreas] = useState<IArea[]>([]);

  // Formularios
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formIdArea, setFormIdArea] = useState<number>(0);

  // Cargar puestos reales
  useEffect(() => {
    fetchPuestos().then(res => {
      if (res.success) {
        setPuestos(res.data);
        setFilteredPuestos(res.data);
      }
    });
  }, []);

  // Cargar áreas reales
  useEffect(() => {
    fetchAreas().then(res => {
      if (res.success) setAreas(res.data);
    });
  }, []);

  // Buscar por ID
  const handleSearch = () => {
    if (searchId.trim() === "") {
      setFilteredPuestos(puestos);
    } else {
      setFilteredPuestos(puestos.filter(p => p.idPuestos.toString() === searchId.trim()));
    }
  };

  // Mostrar todos
  const resetSearch = () => {
    setSearchId("");
    setFilteredPuestos(puestos);
  };

  // Crear puesto
  const handleCreate = async () => {
    try {
      const res = await createPuesto({ nombrePuesto: formNombre, descripcionPuesto: formDescripcion, idArea: formIdArea });
      if (res.success && res.data) {
        const newPuestos = [...puestos, res.data];
        setPuestos(newPuestos);
        setFilteredPuestos(newPuestos);
        setShowCreateModal(false);
        setFormNombre('');
        setFormDescripcion('');
        setFormIdArea(0);
        await fetchPuestos(); // Recargar puestos para asegurarnos de que se muestra el nuevo
      }
    } catch (error) {
      console.error('Error al crear puesto:', error);
    }
  };

  // Editar puesto
  const handleEdit = (puesto: IPuesto) => {
    setEditPuesto(puesto);
    setFormNombre(puesto.nombrePuesto);
    setFormDescripcion(puesto.descripcionPuesto || '');
    setFormIdArea(puesto.idArea);
    setShowEditModal(true);
    
  };

  const handleUpdate = async () => {
    if (!editPuesto) return;
    try {
      const res = await updatePartialPuesto(editPuesto.idPuestos, { nombrePuesto: formNombre, descripcionPuesto: formDescripcion, idArea: formIdArea });
      if (res.success && res.data) {
        const updated = puestos.map(p => p.idPuestos === editPuesto.idPuestos ? res.data : p);
        setPuestos(updated);
        setFilteredPuestos(updated);
        setShowEditModal(false);
        setEditPuesto(null);
        await fetchPuestos(); // Recargar puestos para asegurarnos de que se muestra el nuevo

      }
    } catch (error) {
      console.error('Error al editar puesto:', error);
    }
  };

  // Eliminar puesto
  const handleDelete = (puesto: IPuesto) => {
    setSelectedPuesto(puesto);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedPuesto) return;
    try {
      await deletePuesto(selectedPuesto.idPuestos);
      const updated = puestos.filter(p => p.idPuestos !== selectedPuesto.idPuestos);
      setPuestos(updated);
      setFilteredPuestos(updated);
      setShowDeleteModal(false);
      setSelectedPuesto(null);
    } catch (error) {
      console.error('Error al eliminar puesto:', error);
    }
  };

  return (
    <div className='areas_container'>
      <div className="container mt-4">
        {/* Barra de búsqueda y botones */}
        <div className="header-azul mb-3">
          <div className="d-flex align-items-center p-3">
            <i className="bi bi-person-badge-fill me-2" style={{ fontSize: 24 }} />
            <h2 className="mb-0 text-white">Gestión de Puestos</h2>
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
                    placeholder="Buscar puesto por ID..."
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
                    Crear puesto
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla de puestos */}
            <div className="custom-table-wrapper">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th>ID Puesto</th>
                    <th>Nombre del Puesto</th>
                    <th>Fecha Asignación</th>
                    <th>Descripción</th>
                    <th>Área</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPuestos.length > 0 ? (
                    filteredPuestos.map((puesto) => (
                      <tr key={puesto.idPuestos}>
                        <td>{puesto.idPuestos}</td>
                        <td>{puesto.nombrePuesto}</td>
                        <td>{puesto.fechaAsignacionPuesto}</td>
                        <td>{puesto.descripcionPuesto}</td>
                        <td>{puesto.areas ? puesto.areas.nombreArea : ''}</td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleEdit(puesto)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(puesto)}
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
                      <td colSpan={6} className="text-center py-4">
                        <div className="text-muted">No se encontraron puestos</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal para crear puesto */}
        {showCreateModal && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal">
              <h5 className="modal-title">Crear Puesto</h5>
              <form>
                <div className="crear-conductor-form">
                  <div className="mb-2">
                    <label className="form-label">Nombre del Puesto</label>
                    <input className="form-control" placeholder="Nombre del Puesto" value={formNombre} onChange={e => setFormNombre(e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Fecha Asignación</label>
                    <input className="form-control" type="date" />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Descripción</label>
                    <input className="form-control" placeholder="Descripción" value={formDescripcion} onChange={e => setFormDescripcion(e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Área</label>
                    <select
                      className="form-control"
                      value={formIdArea}
                      onChange={e => setFormIdArea(Number(e.target.value))}
                      required
                    >
                      <option value="">Seleccione un área</option>
                      {areas.map(area => (
                        <option key={area.idArea} value={area.idArea}>
                          {area.nombreArea}
                        </option>
                      ))}
                    </select>
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

        {/* Modal para editar puesto */}
        {showEditModal && editPuesto && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal">
              <h5 className="modal-title">Editar Puesto</h5>
              <form>
                <div className="crear-conductor-form">
                  <div className="mb-2">
                    <label className="form-label">Nombre del Puesto</label>
                    <input className="form-control" value={formNombre} onChange={e => setFormNombre(e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Fecha Asignación</label>
                    <input className="form-control" type="date" defaultValue={editPuesto.fechaAsignacionPuesto} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Descripción</label>
                    <input className="form-control" value={formDescripcion} onChange={e => setFormDescripcion(e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Área</label>
                    <select
                      className="form-control"
                      value={formIdArea}
                      onChange={e => setFormIdArea(Number(e.target.value))}
                      required
                    >
                      <option value="">Seleccione un área</option>
                      {areas.map(area => (
                        <option key={area.idArea} value={area.idArea}>
                          {area.nombreArea}
                        </option>
                      ))}
                    </select>
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

        {/* Modal para eliminar puesto */}
        {showDeleteModal && selectedPuesto && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal" style={{ maxWidth: 380 }}>
              <h5 className="modal-title mb-3 text-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Confirmar Eliminación
              </h5>
              <div className="mb-3">
                ¿Estás seguro que deseas eliminar este puesto? Esta acción no se puede deshacer.
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

export default Puestos;