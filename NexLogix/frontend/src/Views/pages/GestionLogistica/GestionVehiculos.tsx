import { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { VehiculosController } from "../../../Controllers/VehiculosController";
import { IVehiculo } from "../../../models/Interfaces/IVehiculo";
import { IConductor } from "../../../models/Interfaces/IConductor";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Extendemos IVehiculo para incluir los campos adicionales que necesitamos en la UI
interface VehiculoUI extends Omit<IVehiculo, 'idVehiculo' | 'marcaVehiculo' | 'tipoVehiculo' | 'estadoVehiculo'> {
  id: number; // renombramos idVehiculo a id
  marca: string; // renombramos marcaVehiculo a marca
  tipo: string; // renombramos tipoVehiculo a tipo
  estado: string; // renombramos estadoVehiculo a estado
  conductorAsignado: string;
}

interface FormData extends Omit<VehiculoUI, 'id' | 'conductorAsignado'> {
  tipo: string;
}

// Función para convertir IVehiculo a VehiculoUI
const toVehiculoUI = (v: IVehiculo, conductorAsignado: string = "Por asignar"): VehiculoUI => ({
  id: v.idVehiculo,
  placa: v.placa,
  marca: v.marcaVehiculo,
  tipo: v.tipoVehiculo,
  capacidad: v.capacidad,
  estado: v.estadoVehiculo,
  ultimoMantenimiento: v.ultimoMantenimiento,
  conductorAsignado
});

const GestionVehiculos = () => {
  // Helper to extract conductor's display name from either new flat IConductor or legacy conductor.usuario
  const extractConductorNombre = (conductor?: IConductor | { usuario?: { nombreCompleto?: string } } | null): string | undefined => {
    if (!conductor) return undefined;
    // If the conductor has the new flat property
    if ('nombreCompleto' in conductor && typeof conductor.nombreCompleto === 'string' && conductor.nombreCompleto.trim() !== '') {
      return conductor.nombreCompleto;
    }
    // Legacy shape: conductor.usuario.nombreCompleto
    const maybe = conductor as unknown as Record<string, unknown>;
    const usuario = maybe['usuario'] as Record<string, unknown> | undefined;
    if (usuario && typeof usuario['nombreCompleto'] === 'string') return usuario['nombreCompleto'] as string;
    // Backend raw may have c_nombreCompleto
    if (typeof maybe['c_nombreCompleto'] === 'string') return maybe['c_nombreCompleto'] as string;
    return undefined;
  };
  const [vehiculos, setVehiculos] = useState<VehiculoUI[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState<VehiculoUI | null>(null);
  
  // Estados para carga y notificaciones
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Estados para asignar conductor
  const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
  const [selectedVehicleForDriver, setSelectedVehicleForDriver] = useState<VehiculoUI | null>(null);
  const [conductorSearch, setConductorSearch] = useState("");
  const [selectedConductor, setSelectedConductor] = useState<IConductor | null>(null);
  const [conductores, setConductores] = useState<IConductor[]>([]);

  // const navigate = useNavigate();

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const data = await VehiculosController.getAllVehiculos();
        // Obtener las asignaciones actuales
        const asignaciones = await VehiculosController.getAsignacionesConductores();
        
        // Convertir los vehículos a formato UI con sus conductores asignados
        const vehiculosConConductores = data.map(v => {
          const asignacion = asignaciones.find(a => a.vehiculo.placa === v.placa);
          return toVehiculoUI(v, asignacion ? extractConductorNombre(asignacion.conductor) : undefined);
        });
        setVehiculos(vehiculosConConductores);
      } catch (error) {
        console.error('Error al cargar los vehículos:', error);
      }
    };
    fetchVehiculos();
  }, []);

  const filteredVehicles = vehiculos.filter(vehicle => {
    const searchableFields = [
      vehicle.placa,
      vehicle.marca,
      vehicle.tipo,
      vehicle.capacidad,
      vehicle.estado,
      vehicle.conductorAsignado
    ];
    return searchableFields.some(field => 
      field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // const handleEdit = (id: number) => {
  //   navigate(`/manager/editarVehiculo/${id}`);
  // };

  const handleDeleteClick = (id: number) => {
    setSelectedVehicle(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedVehicle) {
      setIsLoading(true);
      try {
        await VehiculosController.deleteVehiculo(selectedVehicle.toString());
        setNotification({ type: 'success', message: 'Vehículo eliminado con éxito' });
        setShowDeleteModal(false);
        // Recargar la lista después de eliminar
        const data = await VehiculosController.getAllVehiculos();
        const asignaciones = await VehiculosController.getAsignacionesConductores();
        const vehiculosConConductores = data.map(v => {
          const asignacion = asignaciones.find(a => a.vehiculo.placa === v.placa);
          return toVehiculoUI(v, asignacion ? extractConductorNombre(asignacion.conductor) : undefined);
        });
        setVehiculos(vehiculosConConductores);
      } catch (error) {
        const apiError = error as ApiError;
        setNotification({ 
          type: 'error', 
          message: apiError.response?.data?.message || 'Error al eliminar el vehículo'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreateVehiculo = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const newVehiculo = {
        placa: formData.placa,
        marcaVehiculo: formData.marca,
        tipoVehiculo: formData.tipo as IVehiculo['tipoVehiculo'],
        capacidad: formData.capacidad,
        estadoVehiculo: formData.estado.toLowerCase() as IVehiculo['estadoVehiculo'],
        ultimoMantenimiento: formData.ultimoMantenimiento
      };
      
      await VehiculosController.createVehiculo(newVehiculo);
      setNotification({ type: 'success', message: 'Vehículo creado con éxito' });
      setShowCreateModal(false);

      // Recargar la lista después de crear
      const data = await VehiculosController.getAllVehiculos();
      const asignaciones = await VehiculosController.getAsignacionesConductores();
        const vehiculosConConductores = data.map(v => {
          const asignacion = asignaciones.find(a => a.vehiculo.placa === v.placa);
          return toVehiculoUI(v, asignacion ? extractConductorNombre(asignacion.conductor) : undefined);
        });
      setVehiculos(vehiculosConConductores);
    } catch (error) {
      const apiError = error as ApiError;
      setNotification({ 
        type: 'error', 
        message: apiError.response?.data?.message || 'Error al crear el vehículo' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVehiculo = async (id: string, formData: FormData) => {
    setIsLoading(true);
    try {
      const updatedVehiculo = {
        placa: formData.placa,
        marcaVehiculo: formData.marca,
        tipoVehiculo: formData.tipo as IVehiculo['tipoVehiculo'],
        capacidad: formData.capacidad,
        estadoVehiculo: formData.estado.toLowerCase() as IVehiculo['estadoVehiculo'],
        ultimoMantenimiento: formData.ultimoMantenimiento
      };
      
      await VehiculosController.updateVehiculo(id, updatedVehiculo);
      setNotification({ type: 'success', message: 'Vehículo actualizado con éxito' });
      setShowEditModal(false);

      // Recargar la lista después de actualizar
      const data = await VehiculosController.getAllVehiculos();
      const asignaciones = await VehiculosController.getAsignacionesConductores();
      const vehiculosConConductores = data.map(v => {
        const asignacion = asignaciones.find(a => a.vehiculo.placa === v.placa);
        return toVehiculoUI(v, asignacion ? extractConductorNombre(asignacion.conductor) : undefined);
      });
      setVehiculos(vehiculosConConductores);
    } catch (error) {
      const apiError = error as ApiError;
      setNotification({ 
        type: 'error', 
        message: apiError.response?.data?.message || 'Error al actualizar el vehículo' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignDriver = async (vehiculoId: number, conductorId: number) => {
    setIsLoading(true);
    try {
      await VehiculosController.createAsignacion({
        idConductor: conductorId,
        idVehiculo: vehiculoId
      });
      
      setNotification({ type: 'success', message: 'Conductor asignado con éxito' });
      setShowAssignDriverModal(false);

      // Recargar la lista después de asignar
      const data = await VehiculosController.getAllVehiculos();
      const asignaciones = await VehiculosController.getAsignacionesConductores();
        const vehiculosConConductores = data.map(v => {
          const asignacion = asignaciones.find(a => a.vehiculo.placa === v.placa);
          return toVehiculoUI(v, asignacion ? extractConductorNombre(asignacion.conductor) : undefined);
        });
      setVehiculos(vehiculosConConductores);
    } catch (error) {
      const apiError = error as ApiError;
      setNotification({ 
        type: 'error', 
        message: apiError.response?.data?.message || 'Error al asignar el conductor' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "disponible": return "success";
      case "asignado": return "info";
      case "en_ruta": return "primary";
      case "mantenimiento": return "warning";
      case "fuera_de_servicio": return "danger";
      default: return "secondary";
    }
  };

  return (
    <div className="container-fluid p-0 m-0">
      {/* Notificación */}
      {notification && (
        <div className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show m-3`} role="alert">
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification(null)} aria-label="Close"></button>
        </div>
      )}

      {/* Indicador de carga */}
      {isLoading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style={{ zIndex: 1050 }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {/* Header azul */}
      <div className="header-azul mb-3">
        <div className="d-flex align-items-center p-3">
          <i className="bi bi-truck me-2" style={{ fontSize: 24 }} />
          <h2 className="mb-0 text-white">Gestión de Vehículos</h2>
        </div>
      </div>

      {/* Contenido principal sin card */}
      {/* Barra de búsqueda y botones */}
      <div className="d-flex justify-content-between mb-4 align-items-center">
            <div className="d-flex align-items-center" style={{ flex: 1, minWidth: 0 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar vehículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ minWidth: 0, borderRadius: '0.5rem' }}
                />
              <div className="d-flex gap-2 ms-2">
                <button
                  className="btn btn-primary"
                  style={{ minWidth: 140 }}
                  onClick={() => {/* Lógica para buscar por ID */}}
                >
                  Buscar por ID
                </button>
                <button
                  className="btn btn-success"
                  style={{ minWidth: 140 }}
                  onClick={() => {/* Lógica para mostrar todos */}}
                >
                  Mostrar todos
                </button>
                <button
                  className="btn btn-warning"
                  style={{ minWidth: 140, width: "100%" }}
                  onClick={() => setShowCreateModal(true)}
                >
                  Crear vehículo
                </button>
              </div>
            </div>
          </div>

          <div className="custom-table-wrapper">
            <table className="table custom-table">
              <thead>
                <tr>
                  {/* <th>#</th> */}
                  <th>Placa</th>
                  <th>Marca Vehiculo</th>
                  <th>Tipo Vehiculo</th>
                  <th>Estado</th>
                  <th>Último Mantenimiento</th>
                  <th>Conductor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      {/* <td>{vehicle.id}</td> */}
                      <td>{vehicle.placa}</td>
                      <td>{vehicle.marca}</td>
                      <td>{vehicle.tipo}</td>

                      <td>
                        <span className={`badge bg-${getStatusBadge(vehicle.estado)} badge-estado-uniforme`}>
                          {vehicle.estado}
                        </span>
                      </td>
                      <td>{new Date(vehicle.ultimoMantenimiento).toLocaleDateString()}</td>
                      <td>{vehicle.conductorAsignado}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                setEditVehicle(vehicle);
                                setShowEditModal(true);
                              }}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteClick(vehicle.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Asignar conductor</Tooltip>}>
                            <button
                              className="btn btn-sm btn-info"
                              onClick={async () => {
                                try {
                                  const activeConductores = await VehiculosController.getActiveConductors();
                                  setConductores(activeConductores);
                                  setSelectedVehicleForDriver(vehicle);
                                  setShowAssignDriverModal(true);
                                  setConductorSearch("");
                                  setSelectedConductor(null);
                                } catch (error) {
                                  console.error('Error al cargar conductores:', error);
                                }
                              }}
                            >
                              <i className="bi bi-person-plus"></i>
                            </button>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      <div className="text-muted">No se encontraron vehículos</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

      {/* Modal de Confirmación */}
      {showDeleteModal && (
        <div className="crear-conductor-modal-bg">
          <div className="crear-conductor-modal" style={{ maxWidth: 380 }}>
            <h5 className="modal-title mb-3 text-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Confirmar Eliminación
            </h5>
            <div className="mb-3">
              ¿Estás seguro que deseas eliminar este vehículo? Esta acción no se puede deshacer.
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

      {/* Modal para crear vehículo */}
      {showCreateModal && (
        <div className="crear-conductor-modal-bg">
          <div className="crear-conductor-modal">
            <h5 className="modal-title">Crear Vehículo</h5>
            <form>
              <div className="crear-conductor-form">
                <div className="mb-2">
                  <label className="form-label">Placa</label>
                  <input 
                    name="placa" 
                    className="form-control" 
                    placeholder="Ej: ABC123" 
                    maxLength={6}
                    required
                    pattern="[A-Za-z0-9]{6}"
                    title="La placa debe tener exactamente 6 caracteres alfanuméricos"
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Marca</label>
                  <input 
                    name="marca" 
                    className="form-control" 
                    placeholder="Ej: Toyota, Chevrolet" 
                    maxLength={155}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Tipo</label>
                  <select name="tipo" className="form-select" required>
                    <option value="">Seleccionar tipo...</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="B3">B3</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                    <option value="C3">C3</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label">Capacidad</label>
                  <input 
                    name="capacidad" 
                    className="form-control" 
                    placeholder="Ej: 2 toneladas, 15 pasajeros" 
                    maxLength={200}
                    required
                  />
                </div>
                
                <div className="mb-2">
                  <label className="form-label">Estado</label>
                  <select name="estado" className="form-select">
                    <option value="disponible">Disponible</option>
                    <option value="asignado">Asignado</option>
                    <option value="en_ruta">En ruta</option>
                    <option value="mantenimiento">En mantenimiento</option>
                    <option value="fuera_de_servicio">Fuera de servicio</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Último mantenimiento</label>
                  <input name="ultimoMantenimiento" className="form-control" type="date" />
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
                  onClick={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget.closest('form');
                    if (form) {
                      const formElements = form.elements as HTMLFormControlsCollection;
                      const formData: FormData = {
                        placa: (formElements.namedItem('placa') as HTMLInputElement)?.value || '',
                        marca: (formElements.namedItem('marca') as HTMLInputElement)?.value || '',
                        tipo: (formElements.namedItem('tipo') as HTMLInputElement)?.value || '',
                        capacidad: (formElements.namedItem('capacidad') as HTMLInputElement)?.value || '',
                        estado: (formElements.namedItem('estado') as HTMLSelectElement)?.value || '',
                        ultimoMantenimiento: (formElements.namedItem('ultimoMantenimiento') as HTMLInputElement)?.value || ''
                      };
                      handleCreateVehiculo(formData);
                    }
                  }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar vehículo */}
      {showEditModal && editVehicle && (
        <div className="crear-conductor-modal-bg">
          <div className="crear-conductor-modal">
            <h5 className="modal-title">Editar Vehículo</h5>
            <form>
              <div className="crear-conductor-form">
                <div className="mb-2">
                  <label className="form-label">Placa</label>
                  <input 
                    name="placa" 
                    className="form-control" 
                    defaultValue={editVehicle.placa}
                    maxLength={6}
                    required
                    pattern="[A-Za-z0-9]{6}"
                    title="La placa debe tener exactamente 6 caracteres alfanuméricos"
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Marca</label>
                  <input 
                    name="marca" 
                    className="form-control" 
                    defaultValue={editVehicle.marca}
                    maxLength={155}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Tipo</label>
                  <select name="tipo" className="form-select" defaultValue={editVehicle.tipo} required>
                    <option value="">Seleccionar tipo...</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="B3">B3</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                    <option value="C3">C3</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label">Capacidad</label>
                  <input 
                    name="capacidad" 
                    className="form-control" 
                    defaultValue={editVehicle.capacidad}
                    maxLength={200}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Estado</label>
                  <select name="estado" className="form-select" defaultValue={editVehicle.estado}>
                    <option value="disponible">Disponible</option>
                    <option value="asignado">Asignado</option>
                    <option value="en_ruta">En ruta</option>
                    <option value="mantenimiento">En mantenimiento</option>
                    <option value="fuera_de_servicio">Fuera de servicio</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Último mantenimiento</label>
                  <input name="ultimoMantenimiento" className="form-control" type="date" defaultValue={editVehicle.ultimoMantenimiento} />
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
                  onClick={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget.closest('form');
                    if (form && editVehicle) {
                      const formData = new FormData(form);
                      const editFormData: FormData = {
                        placa: formData.get('placa')?.toString() || '',
                        marca: formData.get('marca')?.toString() || '',
                        tipo: formData.get('tipo')?.toString() || '',
                        capacidad: formData.get('capacidad')?.toString() || '',
                        estado: formData.get('estado')?.toString() || '',
                        ultimoMantenimiento: formData.get('ultimoMantenimiento')?.toString() || ''
                      };
                      handleEditVehiculo(editVehicle.id.toString(), editFormData);
                    }
                  }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para asignar conductor */}
      {showAssignDriverModal && selectedVehicleForDriver && (
        <div className="crear-conductor-modal-bg">
          <div className="crear-conductor-modal" style={{ maxWidth: 400 }}>
            <h5 className="modal-title mb-2">Asignar Conductor</h5>
            <div className="mb-2">
              <b>Vehículo:</b> {selectedVehicleForDriver.placa} - {selectedVehicleForDriver.marca}
            </div>
            <div className="mb-2">
              <label className="form-label">Buscar conductor</label>
              <input
                className="form-control"
                placeholder="Buscar por nombre..."
                value={conductorSearch}
                onChange={e => {
                  setConductorSearch(e.target.value);
                  setSelectedConductor(null);
                }}
              />
              <div className="list-group mt-1" style={{ maxHeight: 120, overflowY: "auto" }}>
                {conductorSearch &&
                  conductores
                    .filter(c => {
                      const nombre = extractConductorNombre(c) ?? '';
                      const crecord = c as unknown as Record<string, unknown>;
                      const email = crecord['c_email'] ?? crecord['email'] ?? '';
                      const doc = crecord['c_documentoIdentidad'] ?? crecord['documentoIdentidad'] ?? '';
                      const q = conductorSearch.toLowerCase();
                      return (
                        String(nombre).toLowerCase().includes(q) ||
                        String(email).toLowerCase().includes(q) ||
                        String(doc).toLowerCase().includes(q)
                      );
                    })
                    .map(c => (
                      <button
                        type="button"
                        key={c.idConductor}
                        className={`list-group-item list-group-item-action${selectedConductor?.idConductor === c.idConductor ? " active" : ""}`}
                        onClick={() => setSelectedConductor(c)}
                      >
                        {extractConductorNombre(c) ?? ''}
                      </button>
                    ))}
              </div>
            </div>
            {selectedConductor && (
              <div className="alert alert-info py-2 px-2">
                <div><b>Nombre:</b> {extractConductorNombre(selectedConductor) ?? ''}</div>
                <div><b>Licencia:</b> {selectedConductor.licencia}</div>
                <div><b>Tipo de Licencia:</b> {selectedConductor.tipoLicencia}</div>
                <div><b>Estado:</b> {selectedConductor.estado}</div>
              </div>
            )}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAssignDriverModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success"
                disabled={!selectedConductor}                  onClick={async () => {
                    if (selectedConductor && selectedVehicleForDriver) {
                      try {
                        await handleAssignDriver(selectedVehicleForDriver.id, selectedConductor.idConductor);
                        setVehiculos(vehiculos.map(v =>
                          v.id === selectedVehicleForDriver.id
                            ? { ...v, conductorAsignado: extractConductorNombre(selectedConductor) ?? '' }
                            : v
                        ));
                        setShowAssignDriverModal(false);
                      } catch (error) {
                        console.error('Error al asignar conductor:', error);
                      }
                    }
                  }}
              >
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionVehiculos;