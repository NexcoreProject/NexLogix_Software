import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ConductoresController } from '../../../Controllers/ConductoresController';
import {
  IConductor,
  TipoLicencia,
  ConductorCreateDTO
} from '../../../models/Interfaces/IConductor';

// Tipos de licencia válidos
const tiposLicencia = ["A1", "A2", "B1", "B2", "B3", "C1", "C2", "C3"] as const;

// Form-specific type: allow the create DTO fields plus helper fields for nested estado input
type INewConductor = Partial<ConductorCreateDTO> & {
  idEstadoConductor?: number | string;
  idestado_Usuario_control_indentidades?: number | string;
  estado_conductor_c_estado?: string;
  estado_control_estado?: string;
};

const Conductores = () => {
  const [conductores, setConductores] = useState<IConductor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDriver, setEditDriver] = useState<IConductor | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<IConductor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize new driver state with proper flat structure matching backend DTO
  const emptyDriver: INewConductor = {
    c_documentoIdentidad: "",
    c_nombreCompleto: "",
    c_email: "",
    c_numContacto: "",
    c_direccionResidencia: "",
    contrasena: "",
    licencia: "",
    tipoLicencia: undefined,
    vigenciaLicencia: "",
    // possible estado fields to send to backend
    idEstadoConductor: undefined,
    idestado_Usuario_control_indentidades: undefined,
    // helpers for form binding (mapped to nested objects on submit)
    estado_conductor_c_estado: '',
    estado_control_estado: ''
  };

  const [newDriver, setNewDriver] = useState<INewConductor>(emptyDriver);

  useEffect(() => {
    fetchConductores();
  }, []);

  const fetchConductores = async () => {
    setLoading(true);
    setError(null);
    try {
      const conductoresData = await ConductoresController.getAllConductores();
      console.log('Conductores recibidos:', conductoresData);
      
          if (Array.isArray(conductoresData) && conductoresData.length > 0) {
            setConductores(conductoresData);
          } else {
            setError('No hay conductores para mostrar');
          }
    } catch (err) {
      console.error('Error al cargar conductores:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar conductores');
    } finally {
      setLoading(false);
    }
  };



  // Función de filtrado
  const filteredConductores = conductores.filter(conductor => {
    if (!conductor) return false;

    const searchLower = searchTerm.toLowerCase();
    return (
      conductor.documentoIdentidad?.toLowerCase().includes(searchLower) ||
      conductor.nombreCompleto?.toLowerCase().includes(searchLower) ||
      conductor.email?.toLowerCase().includes(searchLower) ||
      conductor.numContacto?.toLowerCase().includes(searchLower) ||
      conductor.licencia?.toLowerCase().includes(searchLower) ||
      (conductor.estado ?? '').toLowerCase().includes(searchLower)
    );
  });

  const handleCreateDriver = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validar el tipo de licencia
      if (!tiposLicencia.includes(newDriver.tipoLicencia as TipoLicencia)) {
        throw new Error('Tipo de licencia inválido');
      }

      // Construir DTO según el backend (c_* fields)
      const dto: ConductorCreateDTO = {
        c_documentoIdentidad: String(newDriver.c_documentoIdentidad || ''),
        c_nombreCompleto: String(newDriver.c_nombreCompleto || ''),
        c_email: String(newDriver.c_email || ''),
        c_numContacto: String(newDriver.c_numContacto || ''),
        c_direccionResidencia: String(newDriver.c_direccionResidencia || ''),
        contrasena: String(newDriver.contrasena || ''),
        licencia: String(newDriver.licencia || ''),
        tipoLicencia: String(newDriver.tipoLicencia) as TipoLicencia,
        vigenciaLicencia: String(newDriver.vigenciaLicencia || '')
      };

      // attach optional estado-related fields if provided in the form
      if (newDriver.idEstadoConductor) dto.idEstadoConductor = Number(newDriver.idEstadoConductor);
      if (newDriver.idestado_Usuario_control_indentidades) dto.idestado_Usuario_control_indentidades = Number(newDriver.idestado_Usuario_control_indentidades);
      if (newDriver.estado_conductor_c_estado && newDriver.estado_conductor_c_estado.trim() !== '') {
        dto.estado_conductor = { c_estado: String(newDriver.estado_conductor_c_estado) };
      }
      if (newDriver.estado_control_estado && newDriver.estado_control_estado.trim() !== '') {
        dto.estado_conductor__control__indentidades = { estado: String(newDriver.estado_control_estado) };
      }

      await ConductoresController.createConductor(dto);

      setShowCreateModal(false);
      setNewDriver(emptyDriver);
      toast.success('Conductor creado exitosamente');
      await fetchConductores(); // Recargar la lista completa
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear conductor');
      toast.error('Error al crear conductor');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDriver = async () => {
    if (!editDriver) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Validar campos requeridos
      if (!editDriver.licencia) {
        throw new Error('El número de licencia es requerido');
      }
      if (!tiposLicencia.includes(editDriver.tipoLicencia as TipoLicencia)) {
        throw new Error('El tipo de licencia es inválido');
      }
      if (!editDriver.vigenciaLicencia) {
        throw new Error('La fecha de vigencia de la licencia es requerida');
      }

      // Preparar datos para actualizar
      const conductorData = {
        licencia: editDriver.licencia.trim(),
        tipoLicencia: editDriver.tipoLicencia as TipoLicencia,
        vigenciaLicencia: editDriver.vigenciaLicencia,
        estado: editDriver.estado || 'disponible'
      };

      // Log para debug
      console.log('Datos a enviar:', conductorData);

      await ConductoresController.updateConductor(editDriver.idConductor, conductorData);
      setShowEditModal(false);
      toast.success('Conductor actualizado exitosamente');
      await fetchConductores(); // Recargar la lista completa
    } catch (err) {
      console.error('Error completo:', err);
      let errorMessage = 'Error al actualizar conductor';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      
      console.error('Error al actualizar:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDriver = async () => {
    if (!selectedDriver) {
      setError('No se ha seleccionado ningún conductor para eliminar');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Eliminando conductor: ${selectedDriver.idConductor}`);
      const result = await ConductoresController.deleteConductor(selectedDriver.idConductor);
      
      if (result) {
        console.log('Conductor eliminado exitosamente');
        setShowDeleteModal(false);
        toast.success('Conductor eliminado exitosamente');
        await fetchConductores(); // Recargar la lista completa
      } else {
        throw new Error('No se pudo eliminar el conductor');
      }
    } catch (err) {
      console.error('Error en handleDeleteDriver:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al eliminar conductor');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handler para el modal de creación
  const handleDriverChange = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    setNewDriver(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler para el modal de edición
  const handleEditDriverChange = (field: string, value: string | number | undefined) => {
    if (!editDriver) return;
    setEditDriver(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      } as IConductor;
    });
  };

  // Handler para cambios en campos anidados (estado_conductor, estado_control)
  const handleEditNestedChange = (parentKey: 'estado_conductor_raw' | 'estado_conductor_control_raw', subKey: string, value: string | number | undefined) => {
    if (!editDriver) return;
    setEditDriver(prev => {
      if (!prev) return prev;
  const prevRec = prev as unknown as Record<string, unknown>;
  const existing = (prevRec[parentKey] as Record<string, unknown> | undefined) ?? {};
  const next = { ...prevRec } as Record<string, unknown>;
  next[parentKey] = { ...existing, [subKey]: value } as unknown;
      return next as unknown as IConductor;
    });
  };

  // Helper to get badge color for license validity
  const getLicenseBadge = (vigencia: string) => {
    const date = new Date(vigencia);
    const today = new Date();
    const diffMonths = (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    let badgeClass = 'bg-success';
    if (diffMonths < 0) {
      badgeClass = 'bg-danger';
    } else if (diffMonths < 3) {
      badgeClass = 'bg-warning';
    }
    
    return (
      <span className={`badge ${badgeClass}`}>
        {vigencia}
      </span>
    );
  };

  // Tipos de estado posibles
  type DriverStatus = 'disponible' | 'en_ruta' | 'no_disponible';
  
  // Helper to get badge color for driver status
  const getStatusBadge = (estado?: string) => {
    const statusClasses: Record<DriverStatus | 'default', string> = {
      'disponible': 'bg-success',
      'en_ruta': 'bg-primary',
      'no_disponible': 'bg-secondary',
      'default': 'bg-warning'
    };

    const normalizedStatus = (estado || '').toLowerCase() as DriverStatus;
    const statusClass = Object.keys(statusClasses).includes(normalizedStatus)
      ? statusClasses[normalizedStatus]
      : statusClasses.default;

    return (
      <span className={`badge ${statusClass}`}>
        {estado || 'Sin estado'}
      </span>
    );
  };

  // Renderizado de la tabla
  const renderTable = () => (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Documento</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Licencia</th>
            <th>Tipo</th>
            <th>Vigencia</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredConductores.map((conductor) => (
            <tr key={conductor.idConductor}>
              <td>{conductor.documentoIdentidad}</td>
              <td>{conductor.nombreCompleto}</td>
              <td>{conductor.email}</td>
              <td>{conductor.numContacto}</td>
              <td>{conductor.licencia}</td>
              <td>{conductor.tipoLicencia}</td>
              <td>{getLicenseBadge(conductor.vigenciaLicencia)}</td>
              <td>{getStatusBadge(conductor.estado)}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setEditDriver(conductor);
                    setShowEditModal(true);
                  }}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelectedDriver(conductor);
                    setShowDeleteModal(true);
                  }}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="header-azul mb-3">
        <div className="d-flex justify-content-between align-items-center p-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-truck me-2" style={{ fontSize: 24 }} />
            <h2 className="m-0">Gestión de Conductores</h2>
          </div>
        </div>
      </div>

      {/* Contenido principal sin card */}
      <div className="d-flex justify-content-between mb-4 align-items-center">
            <div className="d-flex align-items-center" style={{ flex: 1, minWidth: 0 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por documento, nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ minWidth: 0, borderRadius: '0.5rem' }}
                />
              <div className="d-flex gap-2 ms-2">
                <button 
                  className="btn btn-primary" 
                  style={{ minWidth: 140 }} 
                  onClick={() => {
                    if (searchTerm.trim() === '') {
                      fetchConductores();
                    } else {
                      const filtered = conductores.filter(conductor => {
                        const searchLower = searchTerm.toLowerCase();
                        return (
                          conductor.documentoIdentidad?.toLowerCase().includes(searchLower) ||
                          conductor.nombreCompleto?.toLowerCase().includes(searchLower) ||
                          conductor.email?.toLowerCase().includes(searchLower)
                        );
                      });
                      setConductores(filtered);
                    }
                  }}
                  disabled={loading}
                >
                  Buscar
                </button>
                <button 
                  className="btn btn-success" 
                  style={{ minWidth: 140 }} 
                  onClick={() => {
                    setSearchTerm('');
                    fetchConductores();
                  }}
                  disabled={loading}
                >
                  Mostrar todos
                </button>
                <button 
                  className="btn btn-warning" 
                  style={{ minWidth: 140, width: "100%" }} 
                  onClick={() => {
                    setNewDriver(emptyDriver);
                    setShowCreateModal(true);
                  }}
                  disabled={loading}
                >
                  Crear conductor
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)} 
                aria-label="Close"
              />
            </div>
          )}

      {/* Tabla de conductores */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        renderTable()
      )}

      {/* Modal de Creación */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Conductor</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateDriver}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Documento de Identidad</Form.Label>
              <Form.Control
                type="text"
                name="c_documentoIdentidad"
                value={newDriver.c_documentoIdentidad}
                onChange={handleDriverChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                name="c_nombreCompleto"
                value={newDriver.c_nombreCompleto}
                onChange={handleDriverChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="c_email"
                value={newDriver.c_email}
                onChange={handleDriverChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="c_numContacto"
                value={newDriver.c_numContacto}
                onChange={handleDriverChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="c_direccionResidencia"
                value={newDriver.c_direccionResidencia}
                onChange={handleDriverChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="contrasena"
                value={newDriver.contrasena}
                onChange={handleDriverChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Número de Licencia</Form.Label>
              <Form.Control
                type="text"
                name="licencia"
                value={newDriver.licencia}
                onChange={handleDriverChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Licencia</Form.Label>
              <Form.Select
                name="tipoLicencia"
                value={String(newDriver.tipoLicencia || '')}
                onChange={handleDriverChange}
                required
              >
                <option value="">Seleccione tipo...</option>
                {tiposLicencia.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vigencia de Licencia</Form.Label>
              <Form.Control
                type="date"
                name="vigenciaLicencia"
                value={newDriver.vigenciaLicencia}
                onChange={handleDriverChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ID Estado Conductor</Form.Label>
              <Form.Control
                type="number"
                name="idEstadoConductor"
                value={newDriver.idEstadoConductor !== undefined && newDriver.idEstadoConductor !== null ? String(newDriver.idEstadoConductor) : ''}
                onChange={handleDriverChange}
                placeholder="(opcional) Ej: 4"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado Conductor (c_estado)</Form.Label>
              <Form.Control
                type="text"
                name="estado_conductor_c_estado"
                value={newDriver.estado_conductor_c_estado || ''}
                onChange={handleDriverChange}
                placeholder="(opcional) Ej: en_bodega"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ID Estado Control Identidades</Form.Label>
              <Form.Control
                type="number"
                name="idestado_Usuario_control_indentidades"
                value={newDriver.idestado_Usuario_control_indentidades !== undefined && newDriver.idestado_Usuario_control_indentidades !== null ? String(newDriver.idestado_Usuario_control_indentidades) : ''}
                onChange={handleDriverChange}
                placeholder="(opcional) Ej: 1"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado Control Identidades (estado)</Form.Label>
              <Form.Control
                type="text"
                name="estado_control_estado"
                value={newDriver.estado_control_estado || ''}
                onChange={handleDriverChange}
                placeholder="(opcional) Ej: ACTIVO"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Creando...
                </>
              ) : (
                'Crear Conductor'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Conductor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editDriver && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Número de Licencia</Form.Label>
                <Form.Control
                  type="text"
                  value={editDriver.licencia}
                  onChange={(e) => handleEditDriverChange('licencia', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Licencia</Form.Label>
                <Form.Select
                  value={editDriver.tipoLicencia}
                  onChange={(e) => handleEditDriverChange('tipoLicencia', e.target.value)}
                  required
                >
                  {tiposLicencia.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Vigencia de Licencia</Form.Label>
                <Form.Control
                  type="date"
                  value={editDriver.vigenciaLicencia}
                  onChange={(e) => handleEditDriverChange('vigenciaLicencia', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={editDriver.estado}
                  onChange={(e) => handleEditDriverChange('estado', e.target.value)}
                >
                  <option value="disponible">Disponible</option>
                  <option value="en_ruta">En Ruta</option>
                  <option value="no_disponible">No Disponible</option>
                </Form.Select>
              </Form.Group>

              {/* Nested estado fields editing */}
              <Form.Group className="mb-3">
                <Form.Label>ID Estado Conductor</Form.Label>
                <Form.Control
                  type="number"
                  value={editDriver.idEstadoConductor ?? ''}
                  onChange={(e) => handleEditDriverChange('idEstadoConductor', e.target.value ? Number(e.target.value) : undefined)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado Conductor (c_estado)</Form.Label>
                <Form.Control
                  type="text"
                  value={typeof editDriver.estado_conductor_raw === 'string' ? editDriver.estado_conductor_raw : (editDriver.estado_conductor_raw?.c_estado ?? '')}
                  onChange={(e) => handleEditNestedChange('estado_conductor_raw', 'c_estado', e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>ID Estado Control Identidades</Form.Label>
                <Form.Control
                  type="number"
                  value={editDriver.idestado_Usuario_control_indentidades ?? ''}
                  onChange={(e) => handleEditDriverChange('idestado_Usuario_control_indentidades', e.target.value ? Number(e.target.value) : undefined)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estado Control Identidades (estado)</Form.Label>
                <Form.Control
                  type="text"
                  value={typeof editDriver.estado_conductor_control_raw === 'string' ? editDriver.estado_conductor_control_raw : (editDriver.estado_conductor_control_raw?.estado ?? '')}
                  onChange={(e) => handleEditNestedChange('estado_conductor_control_raw', 'estado', e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateDriver}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Actualizando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDriver && (
            <p>
              ¿Está seguro que desea eliminar al conductor{' '}
              <strong>{selectedDriver.nombreCompleto}</strong>?
              Esta acción no se puede deshacer.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteDriver}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Conductores;