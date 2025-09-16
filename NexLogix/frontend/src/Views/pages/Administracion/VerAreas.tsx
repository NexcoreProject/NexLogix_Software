import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import './../../Styles/NavBar/Administracion/GeneralStyle.css';
import './../../Styles/Home/TablesStyle.css'
import './../../Styles/NavBar/Logistica/ListaVehiculos.css';
import '../../Styles/Home/TablesStyle.css'
import { IArea } from '../../../models/Interfaces/IAreas';
import { fetchAreas, fetchAreaById, createArea, updateArea, deleteArea } from '../../../services/Areas/AreasService';

const VerAreas: React.FC = () => {
  const [areas, setAreas] = useState<IArea[]>([]);
  const [searchId, setSearchId] = useState("");
  const [filteredAreas, setFilteredAreas] = useState<IArea[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editArea, setEditArea] = useState<IArea | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState<IArea | null>(null);

  // Formularios
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');

  // Cargar áreas reales
  useEffect(() => {
    fetchAreas().then(res => {
      if (res.success) {
        setAreas(res.data);
        setFilteredAreas(res.data);
      }
    });
  }, []);

  // Buscar por ID usando API
  const handleSearch = async () => {
    if (searchId.trim() === "") {
      setFilteredAreas(areas);
    } else {
      try {
        const res = await fetchAreaById(Number(searchId));
        setFilteredAreas(res.success && res.data ? [res.data] : []);
      } catch {
        setFilteredAreas([]);
      }
    }
  };

  // Mostrar todos
  const resetSearch = () => {
    setSearchId("");
    setFilteredAreas(areas);
  };

  // Crear área
  const handleCreate = async () => {
    try {
      const res = await createArea({ nombreArea: formNombre, descripcionArea: formDescripcion });
      if (res.success && res.data) {
        const newAreas = [...areas, res.data];
        setAreas(newAreas);
        setFilteredAreas(newAreas);
        setShowCreateModal(false);
        setFormNombre('');
        setFormDescripcion('');
      }
    } catch (error) {
      console.error('Error al crear área:', error);
    }
  };

  // Editar área
  const handleEdit = (area: IArea) => {
    setEditArea(area);
    setFormNombre(area.nombreArea);
    setFormDescripcion(area.descripcionArea);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editArea) return;
    try {
      const res = await updateArea(editArea.idArea, { nombreArea: formNombre, descripcionArea: formDescripcion });
      if (res.success && res.data) {
        const updated = areas.map(a => a.idArea === editArea.idArea ? res.data : a);
        setAreas(updated);
        setFilteredAreas(updated);
        setShowEditModal(false);
        setEditArea(null);
      }
    } catch (error) {
      console.error('Error al crear área:', error);
    }
  };

  // Eliminar área
  const handleDelete = (area: IArea) => {
    setSelectedArea(area);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedArea) return;
    try {
      await deleteArea(selectedArea.idArea);
      const updated = areas.filter(a => a.idArea !== selectedArea.idArea);
      setAreas(updated);
      setFilteredAreas(updated);
      setShowDeleteModal(false);
      setSelectedArea(null);
    } catch (error) {
      console.error('Error al crear área:', error);
    }
  };

  return (
    <div className='areas_container' style={{ border: 'none', outline: 'none' }}>
      <div className="container mt-4" style={{ border: 'none', outline: 'none' }}>
        {/* Barra de búsqueda y botones */}
        <div className="header-azul mb-3">
          <div className="d-flex align-items-center p-3">
            <i className="bi bi-diagram-3-fill me-2" style={{ fontSize: 24 }} />
            <h2 className="mb-0 text-white">Gestión de Áreas</h2>
          </div>
        </div>
        {/* Contenido principal sin card */}
        <div className="d-flex justify-content-between mb-4 align-items-center">
          <div className="d-flex align-items-center" style={{ flex: 1, minWidth: 0 }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar área por ID..."
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
                  <button className="btn btn-warning" style={{ minWidth: 140, width: "100%" }} onClick={() => setShowCreateModal(true)}>
                    Crear área
                  </button>
                </div>
              </div>
            </div>
            <div className="custom-table-wrapper" style={{ border: 'none', outline: 'none', overflow: 'hidden', borderRadius: '12px', backgroundColor: '#232c42', boxShadow: 'none' }}>
              <table className="table custom-table" style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '0', backgroundColor: 'transparent' }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre del Área</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAreas.length > 0 ? (
                    filteredAreas.map((area) => (
                      <tr key={area.idArea}>
                        <td>{area.idArea}</td>
                        <td>{area.nombreArea}</td>
                        <td>{area.descripcionArea}</td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                              <button className="btn btn-sm btn-primary" onClick={() => handleEdit(area)}>
                                <i className="bi bi-pencil"></i>
                              </button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(area)}>
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
                        <div className="text-muted">No se encontraron áreas</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

        {/* Modal para crear área */}
        {showCreateModal && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal">
              <h5 className="modal-title">Crear Área</h5>
              <form onSubmit={e => { e.preventDefault(); handleCreate(); }}>
                <div className="crear-conductor-form">
                  <div className="mb-2">
                    <label className="form-label">Nombre del Área</label>
                    <input
                      className="form-control"
                      placeholder="Nombre del Área"
                      value={formNombre}
                      onChange={e => setFormNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Descripción</label>
                    <input
                      className="form-control"
                      placeholder="Descripción"
                      value={formDescripcion}
                      onChange={e => setFormDescripcion(e.target.value)}
                      required
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

        {/* Modal para editar área */}
        {showEditModal && editArea && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal">
              <h5 className="modal-title">Editar Área</h5>
              <form onSubmit={e => { e.preventDefault(); handleUpdate(); }}>
                <div className="crear-conductor-form">
                  <div className="mb-2">
                    <label className="form-label">Nombre del Área</label>
                    <input
                      className="form-control"
                      value={formNombre}
                      onChange={e => setFormNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Descripción</label>
                    <input
                      className="form-control"
                      value={formDescripcion}
                      onChange={e => setFormDescripcion(e.target.value)}
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

        {/* Modal para eliminar área */}
        {showDeleteModal && selectedArea && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal" style={{ maxWidth: 380 }}>
              <h5 className="modal-title mb-3 text-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Confirmar Eliminación
              </h5>
              <div className="mb-3">
                ¿Estás seguro que deseas eliminar esta área? Esta acción no se puede deshacer.
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

export default VerAreas;