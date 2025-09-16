import '../../Styles/NavBar/plantilla.css';
// import '../../Styles/Home/TablesStyle.css'
import { useState, useEffect } from "react";
import { RutasController } from "../../../Controllers/Rutas/RutasController";
import { 
    IRuta,
    IVehiculo,
    ICiudad,
    ICreateRutaRequest,
    IAxiosError
} from "../../../models/Interfaces/IRutas";

const Rutas = () => {
  const [rutas, setRutas] = useState<IRuta[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchById, setSearchById] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  // Estados de edición
  const [selectedRuta, setSelectedRuta] = useState<IRuta | null>(null);
  const [editRuta, setEditRuta] = useState<IRuta | null>(null);

  // Estados para gestión de vehículos y ciudades
  const [availableVehicles, setAvailableVehicles] = useState<IVehiculo[]>([]);
  const [availableCities, setAvailableCities] = useState<ICiudad[]>([]);

  // Estados para editar ruta (independientes)
  // const [vehiculoEditSearch, setVehiculoEditSearch] = useState<string>("");
  // const [vehiculoEditSeleccionado, setVehiculoEditSeleccionado] = useState<VehiculoRuta | null>(null);
  // const [fechaEditAsignacionInicio, setFechaEditAsignacionInicio] = useState<string>("");
  // const [fechaEditAsignacionFin, setFechaEditAsignacionFin] = useState<string>("");

  // Funciones de carga de datos
  const loadRutas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await RutasController.getAllRutas();
      if (response.success) {
        setRutas(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las rutas');
    } finally {
      setIsLoading(false);
    }
  };

  const loadVehiculos = async () => {
    try {
      const response = await RutasController.getAvailableVehicles();
      if (response.success) {
        setAvailableVehicles(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los vehículos');
    }
  };

  const loadCiudades = async () => {
    try {
      const response = await RutasController.getAvailableCities();
      if (response.success) {
        setAvailableCities(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las ciudades');
    }
  };

  useEffect(() => {
    loadRutas();
  }, []);

  // Funciones de búsqueda
  const filteredRutas = rutas.filter(ruta => {
    if (searchById) {
      return ruta.idRuta.toString() === searchById;
    }
    return (
      ruta.nombreRuta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruta.estadoRuta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruta.novedades?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruta.asignacion__vehiculos__por__rutas.some(asig => 
        asig.vehiculo_asignado.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asig.vehiculo_asignado.marcaVehiculo.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      ruta.asignacion__rutas__por__ciudades.some(asig =>
        asig.ciudad.nombreCiudad.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  // Funciones de gestión de rutas
  const handleCreateRuta = async (data: ICreateRutaRequest) => {
    try {
      setError(null);
      console.log('Datos a enviar:', data);
      const response = await RutasController.createRuta(data);
      if (response.success) {
        loadRutas();
        setShowCreateModal(false);
      } else {
        console.error('Error en la respuesta:', response);
        setError(response.message);
      }
    } catch (err) {
      console.error('Error completo:', err);
      const error = err as IAxiosError;
      
      if (error.response?.data?.errors) {
        // Si hay errores de validación específicos
        const validationErrors = Object.values(error.response.data.errors)
          .flat()
          .join(', ');
        setError(validationErrors);
      } else {
        // Si es un error general
        setError(error.response?.data?.message || error.message || 'Error al crear la ruta');
      }
    }
  };

  const handleUpdateRuta = async (id: number, data: Partial<ICreateRutaRequest>) => {
    try {
      setError(null);
      const response = await RutasController.updateRuta(id, data);
      if (response.success) {
        loadRutas();
        setShowEditModal(false);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la ruta');
    }
  };

  const handleDeleteRuta = async (id: number) => {
    try {
      setError(null);
      const response = await RutasController.deleteRuta(id);
      if (response.success) {
        loadRutas();
        setShowDeleteModal(false);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la ruta');
    }
  };

  const handleAssignVehicle = async (idRuta: number, idVehiculo: number, fechaInicio: string, fechaFin?: string) => {
    try {
      setError(null);
      const response = await RutasController.assignVehicleToRoute(idRuta, idVehiculo, fechaInicio, fechaFin);
      if (response.success) {
        loadRutas();
        setShowVehicleModal(false);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar el vehículo');
    }
  };

  const handleAssignCity = async (idRuta: number, idCiudad: number) => {
    try {
      setError(null);
      const response = await RutasController.assignCityToRoute(idRuta, idCiudad);
      if (response.success) {
        loadRutas();
        setShowCityModal(false);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar la ciudad');
    }
  };

  const handleRemoveVehicle = async (idAsignacion: number) => {
    try {
      setError(null);
      const response = await RutasController.removeVehicleFromRoute(idAsignacion);
      if (response.success) {
        loadRutas();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al remover el vehículo');
    }
  };

  const handleRemoveCity = async (idAsignacion: number) => {
    try {
      setError(null);
      const response = await RutasController.removeCityFromRoute(idAsignacion);
      if (response.success) {
        loadRutas();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al remover la ciudad');
    }
  };

  const getStatusBadge = (estado: IRuta['estadoRuta']) => {
    switch (estado) {
      case "EN_RUTA": return "primary";
      case "EN_RECOGIDA": return "info";
      case "EN_ENTREGA": return "warning";
      case "EN_DEVOLUCIONES": return "danger";
      case "EN_BODEGA":
      default:
        return "secondary";
    }
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="header-azul mb-3">
        <div className="d-flex align-items-center p-3">
          <i className="bi bi-geo-alt me-2" style={{ fontSize: 24 }} />
          <h2 className="mb-0 text-white">Gestión de Rutas</h2>
        </div>
      </div>

      {/* Contenido sin card */}
      {/* Búsqueda y botones */}
      <div className="d-flex justify-content-between mb-3">
            <div className="d-flex gap-2" style={{ flex: 1 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre, estado, etc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="text"
                className="form-control"
                style={{ width: 120 }}
                placeholder="ID de Ruta"
                value={searchById}
                onChange={(e) => setSearchById(e.target.value)}
              />
              <button className="btn btn-primary" onClick={loadRutas}>
                Buscar
              </button>
            </div>
            <button
              className="btn btn-success ms-2"
              onClick={() => setShowCreateModal(true)}
            >
              Nueva Ruta
            </button>
          </div>

          {/* Mensajes de error */}
          {error && (
            <div className="alert alert-danger">
              {error}
              <button
                type="button"
                className="btn-close float-end"
                onClick={() => setError(null)}
              />
            </div>
          )}

          {/* Tabla */}
          {isLoading ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Horario</th>
                    <th>Estado</th>
                    <th>Vehículo</th>
                    <th>Ciudades</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRutas.map((ruta) => (
                    <tr key={ruta.idRuta}>
                      <td>{ruta.idRuta}</td>
                      <td>{ruta.nombreRuta}</td>
                      <td>
                        {ruta.horaInicioRuta} - {ruta.horaFinalizacionRuta}
                      </td>
                      <td>
                        <span className={`badge bg-${getStatusBadge(ruta.estadoRuta)}`}>
                          {ruta.estadoRuta.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => {
                            setSelectedRuta(ruta);
                            loadVehiculos();
                            setShowVehicleModal(true);
                          }}
                        >
                          {ruta.asignacion__vehiculos__por__rutas.length > 0 ? 'Ver Vehículo' : 'Asignar'}
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setSelectedRuta(ruta);
                            loadCiudades();
                            setShowCityModal(true);
                          }}
                        >
                          {ruta.asignacion__rutas__por__ciudades.length} ciudades
                        </button>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              setEditRuta(ruta);
                              setShowEditModal(true);
                            }}
                          >
                            <i className="bi bi-pencil" />
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                              setSelectedRuta(ruta);
                              setShowDeleteModal(true);
                            }}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRutas.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-3">
                        No se encontraron rutas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

      {/* Modal de Eliminar */}
      {showDeleteModal && selectedRuta && (
        <div className="crear-conductor-modal-bg">
          <div className="crear-conductor-modal" style={{ maxWidth: 380 }}>
            <h5 className="modal-title mb-3 text-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Confirmar Eliminación
            </h5>
            <div className="mb-3">
              ¿Está seguro de eliminar la ruta {selectedRuta.nombreRuta}? Esta acción no se puede deshacer.
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
                onClick={() => handleDeleteRuta(selectedRuta.idRuta)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Vehículos */}
      {showVehicleModal && selectedRuta && (
        <div className="crear-conductor-modal-bg">
          <div className="crear-conductor-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Gestión de Vehículos - {selectedRuta.nombreRuta}</h5>
                <button type="button" className="btn-close" onClick={() => setShowVehicleModal(false)} />
              </div>
              <div className="modal-body p-4">
                <h6 className="text-primary mb-3">Vehículo Actual</h6>
                {selectedRuta.asignacion__vehiculos__por__rutas.map(asig => (
                  <div key={asig.idAsignacionVehiculoRuta} className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-2 text-white">
                            <i className="bi bi-truck me-2"></i>
                            {asig.vehiculo_asignado.placa}
                          </h5>
                          <p className="mb-0 text-white opacity-75">
                            <strong>Marca:</strong> {asig.vehiculo_asignado.marcaVehiculo}
                            <br />
                            <strong>Tipo:</strong> {asig.vehiculo_asignado.tipoVehiculo}
                          </p>
                        </div>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill"
                          onClick={() => handleRemoveVehicle(asig.idAsignacionVehiculoRuta)}
                          title="Remover vehículo"
                        >
                          <i className="bi bi-trash me-1" /> Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {availableVehicles.length > 0 && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    handleAssignVehicle(
                      selectedRuta.idRuta,
                      Number(formData.get('vehiculo')),
                      formData.get('fechaInicio') as string,
                      formData.get('fechaFin') as string
                    );
                  }}>
                    <div className="mb-3">
                      <label className="form-label">Seleccionar Vehículo</label>
                      <select name="vehiculo" className="form-select" required>
                        <option value="">Seleccione un vehículo...</option>
                        {availableVehicles.map(v => (
                          <option key={v.idVehiculo} value={v.idVehiculo}>
                            {v.placa} - {v.marcaVehiculo}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="mb-3">
                          <label className="form-label">Fecha Inicio</label>
                          <input type="date" name="fechaInicio" className="form-control" required />
                        </div>
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label className="form-label">Fecha Fin (Opcional)</label>
                          <input type="date" name="fechaFin" className="form-control" />
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Asignar Vehículo
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ciudades */}
      {showCityModal && selectedRuta && (
        <div className="crear-conductor-modal-bg">
          <div className="crear-conductor-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Gestión de Ciudades - {selectedRuta.nombreRuta}</h5>
                <button type="button" className="btn-close" onClick={() => setShowCityModal(false)} />
              </div>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-geo-alt me-2"></i>
                    Ciudades Asignadas
                  </h6>
                  {selectedRuta.asignacion__rutas__por__ciudades.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {selectedRuta.asignacion__rutas__por__ciudades.map(asig => (
                        <div 
                          key={asig.idasignacion_rutas_por_ciudades} 
                          className="badge bg-primary bg-opacity-10 p-2 px-3 d-flex align-items-center"
                          style={{ fontSize: '0.9rem', color: '#0057B2' }}
                        >
                          <i className="bi bi-building me-2"></i>
                          {asig.ciudad.nombreCiudad}
                          <button
                            className="btn btn-link p-0 ms-2 d-flex align-items-center"
                            style={{ color: '#DC3545' }}
                            onClick={() => handleRemoveCity(asig.idasignacion_rutas_por_ciudades)}
                            title="Eliminar ciudad"
                          >
                            <i className="bi bi-x-circle-fill" style={{ fontSize: '0.9rem' }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert-info py-2">
                      <i className="bi bi-info-circle me-2"></i>
                      No hay ciudades asignadas a esta ruta
                    </div>
                  )}
                </div>

                {availableCities.length > 0 && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    handleAssignCity(
                      selectedRuta.idRuta,
                      Number(new FormData(form).get('ciudad'))
                    );
                  }}>
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3 text-white">
                          <i className="bi bi-plus-circle me-2"></i>
                          Agregar Nueva Ciudad
                        </h6>
                        <div className="mb-3">
                          <select 
                            name="ciudad" 
                            className="form-select form-select-lg" 
                            required
                            style={{ fontSize: '0.9rem' }}
                          >
                            <option value="">Seleccione una ciudad...</option>
                            {availableCities
                              .filter(c => !selectedRuta.asignacion__rutas__por__ciudades
                                .some(asig => asig.idCiudad === c.idCiudad))
                              .map(c => (
                                <option key={c.idCiudad} value={c.idCiudad}>
                                  {c.nombreCiudad}
                                </option>
                              ))}
                          </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                          <i className="bi bi-plus-lg me-2"></i>
                          Agregar Ciudad
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear/Editar */}
      {(showCreateModal || (showEditModal && editRuta)) && (
        <div className="crear-conductor-modal-bg">
          <div className="crear-conductor-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editRuta ? 'Editar Ruta' : 'Crear Nueva Ruta'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setEditRuta(null);
                  }} 
                />
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                // Formatear las horas para que incluyan la fecha actual
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
                const horaInicio = formData.get('horaInicioRuta') as string;
                const horaFin = formData.get('horaFinalizacionRuta') as string;

                const data: ICreateRutaRequest = {
                  nombreRuta: formData.get('nombreRuta') as string,
                  horaInicioRuta: `${today} ${horaInicio}:00`,
                  horaFinalizacionRuta: `${today} ${horaFin}:00`,
                  descripcion: formData.get('descripcion') as string,
                  estadoRuta: formData.get('estadoRuta') as IRuta['estadoRuta'],
                  novedades: formData.get('novedades') as string || 'No han habido novedades'
                };

                if (editRuta) {
                  handleUpdateRuta(editRuta.idRuta, data);
                } else {
                  handleCreateRuta(data);
                }
              }}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre de la Ruta</label>
                    <input
                      type="text"
                      name="nombreRuta"
                      className="form-control"
                      defaultValue={editRuta?.nombreRuta}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Hora de Inicio</label>
                        <input
                          type="time"
                          name="horaInicioRuta"
                          className="form-control"
                          defaultValue={editRuta?.horaInicioRuta}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Hora de Finalización</label>
                        <input
                          type="time"
                          name="horaFinalizacionRuta"
                          className="form-control"
                          defaultValue={editRuta?.horaFinalizacionRuta}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      name="descripcion"
                      className="form-control"
                      defaultValue={editRuta?.descripcion}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select
                      name="estadoRuta"
                      className="form-select"
                      defaultValue={editRuta?.estadoRuta || 'EN_BODEGA'}
                      required
                    >
                      <option value="EN_BODEGA">En Bodega</option>
                      <option value="EN_RUTA">En Ruta</option>
                      <option value="EN_RECOGIDA">En Recogida</option>
                      <option value="EN_ENTREGA">En Entrega</option>
                      <option value="EN_DEVOLUCIONES">En Devoluciones</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Novedades</label>
                    <textarea
                      name="novedades"
                      className="form-control"
                      defaultValue={editRuta?.novedades}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setEditRuta(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editRuta ? 'Guardar Cambios' : 'Crear Ruta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rutas;