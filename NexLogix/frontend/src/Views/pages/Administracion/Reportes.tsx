import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import './../../Styles/NavBar/Administracion/GeneralStyle.css';
import './../../Styles/Home/TablesStyle.css'
import './../../Styles/NavBar/Logistica/ListaVehiculos.css';
import '../../Styles/Home/TablesStyle.css'
import { useReportesController } from '../../../Controllers/Reportes/ReportesController';
import { IReporte } from '../../../models/Interfaces/IReportes';

const Reportes: React.FC = () => {
  const { reportes, setReportes, cargarReportes, useCase } = useReportesController();
  const [searchId, setSearchId] = useState("");
  const [filteredReportes, setFilteredReportes] = useState<IReporte[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editReporte, setEditReporte] = useState<IReporte | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReporte, setSelectedReporte] = useState<IReporte | null>(null);

  // Formularios controlados
  const [formTipo, setFormTipo] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');

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

  // Crear reporte
  const handleCreate = async () => {
    const data = {
      tipoReporte: formTipo,
      descripcion: formDescripcion
    };
    const res = await useCase.create(data);
    if (res.success && res.data) {
      setReportes([...reportes, res.data]);
      setShowCreateModal(false);
      setFormTipo('');
      setFormDescripcion('');
      await cargarReportes(); // Recargar la lista completa
    }
  };

  // Editar reporte
  const handleEdit = (reporte: IReporte) => {
    setEditReporte(reporte);
    setFormTipo(reporte.tipoReporte);
    setFormDescripcion(reporte.descripcion);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editReporte) return;
    const data = {
      tipoReporte: formTipo,
      descripcion: formDescripcion
      // NO incluyas fechaCreacion aquí
    };
    const res = await useCase.update(editReporte.idReporte, data);
    if (res.success && res.data) {
      setReportes(reportes.map(r => r.idReporte === editReporte.idReporte ? res.data : r));
      setShowEditModal(false);
      setEditReporte(null);
      await cargarReportes(); // Recargar la lista completa

    }
  };

  // Eliminar reporte
  const handleDelete = (reporte: IReporte) => {
    setSelectedReporte(reporte);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedReporte) return;
    const res = await useCase.delete(selectedReporte.idReporte);
    if (res.success) {
      setReportes(reportes.filter(r => r.idReporte !== selectedReporte.idReporte));
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
                  <button className="btn btn-warning" style={{ minWidth: 140, width: "100%" }} onClick={() => setShowCreateModal(true)}>
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
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReportes.length > 0 ? (
                    filteredReportes.map((reporte) => (
                      <tr key={reporte.idReporte}>
                        <td>{reporte.idReporte}</td>
                        <td>{reporte.tipoReporte}</td>
                        <td>{reporte.descripcion}</td>
                        <td>{reporte.fechaCreacion}</td>
                        <td>{reporte.users ? reporte.users.nombreCompleto : ''}</td>
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
                      <td colSpan={6} className="text-center py-4">
                        <div className="text-muted">No se encontraron reportes</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
                  <div className="mb-2">
                    <label className="form-label">Tipo de Reporte</label>
                    <input className="form-control" value={formTipo} onChange={e => setFormTipo(e.target.value)} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Descripción</label>
                    <input className="form-control" value={formDescripcion} onChange={e => setFormDescripcion(e.target.value)} required />
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

        {/* Modal para editar reporte */}
        {showEditModal && editReporte && (
          <div className="crear-conductor-modal-bg">
            <div className="crear-conductor-modal">
              <h5 className="modal-title">Editar Reporte</h5>
              <form onSubmit={e => { e.preventDefault(); handleUpdate(); }}>
                <div className="crear-conductor-form">
                  <div className="mb-2">
                    <label className="form-label">Tipo de Reporte</label>
                    <input className="form-control" value={formTipo} onChange={e => setFormTipo(e.target.value)} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Descripción</label>
                    <input className="form-control" value={formDescripcion} onChange={e => setFormDescripcion(e.target.value)} required />
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