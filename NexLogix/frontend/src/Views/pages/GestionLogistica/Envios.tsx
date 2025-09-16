import { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
//import "../../../Views/Styles/NavBar/ManagerProfile/ListaVehiculos.css";
//import "../../../Views/Styles/NavBar/ManagerProfile/Conductores.css";
//import "../../../Views/Styles/NavBar/ManagerProfile/Envios.css";

// Simulación de datos de envíos
interface Envio {
  id: number;
  codigo: string;
  destinatario: string;
  direccion: string;
  ciudad: string;
  estado: string;
  fechaEnvio: string;
  fechaEntrega: string;
  vehiculoAsignado: string;
  conductorAsignado: string;
}

const Envios = () => {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEnvio, setSelectedEnvio] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEnvio, setEditEnvio] = useState<Envio | null>(null);

  useEffect(() => {
    // Simulación de fetch de envíos
    setTimeout(() => {
      setEnvios([
        {
          id: 1,
          codigo: "ENV-001",
          destinatario: "María López",
          direccion: "Calle 123 #45-67",
          ciudad: "Bogotá",
          estado: "En tránsito",
          fechaEnvio: "2023-07-01",
          fechaEntrega: "2023-07-03",
          vehiculoAsignado: "ABC123",
          conductorAsignado: "Juan Pérez"
        },
        {
          id: 2,
          codigo: "ENV-002",
          destinatario: "Carlos Ruiz",
          direccion: "Carrera 10 #20-30",
          ciudad: "Medellín",
          estado: "Entregado",
          fechaEnvio: "2023-07-02",
          fechaEntrega: "2023-07-04",
          vehiculoAsignado: "XYZ789",
          conductorAsignado: "Ana Gómez"
        },
        {
          id: 3,
          codigo: "ENV-003",
          destinatario: "Laura Torres",
          direccion: "Av. Siempre Viva 742",
          ciudad: "Cali",
          estado: "Pendiente",
          fechaEnvio: "2023-07-05",
          fechaEntrega: "",
          vehiculoAsignado: "DEF456",
          conductorAsignado: "Carlos Gómez"
        }
      ]);
    }, 500);
  }, []);

  const filteredEnvios = envios.filter(envio =>
    Object.values(envio).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Pendiente": return "warning";
      case "En tránsito": return "primary";
      case "Entregado": return "success";
      case "Cancelado": return "danger";
      default: return "secondary";
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedEnvio(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedEnvio) {
      setEnvios(envios.filter(envio => envio.id !== selectedEnvio));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="container-fluid p-0 m-0">
      {/* Header azul */}
      <div className="header-azul mb-3">
        <div className="d-flex align-items-center p-3">
          <i className="bi bi-box-seam me-2" style={{ fontSize: 24 }} />
          <h2 className="mb-0 text-white">Gestión de Envíos</h2>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {/* Barra de búsqueda y botones */}
          <div className="d-flex justify-content-between mb-4 align-items-center">
            <div className="d-flex align-items-center" style={{ flex: 1, minWidth: 0 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar envíos..."
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
                  Crear envío
                </button>
              </div>
            </div>
          </div>

          <div className="custom-table-wrapper">
            <table className="table custom-table">
              <thead>
                <tr>
                  {/* <th>#</th> */}
                  <th>Código</th>
                  <th>Destinatario</th>
                  <th>Dirección</th>
                  <th>Ciudad</th>
                  <th>Estado</th>
                  <th>Fecha Envío</th>
                  <th>Fecha Entrega</th>
                  <th>Vehículo</th>
                  <th>Conductor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnvios.length > 0 ? (
                  filteredEnvios.map((envio) => (
                    <tr key={envio.id}>
                      {/* <td>{envio.id}</td> */}
                      <td>{envio.codigo}</td>
                      <td>{envio.destinatario}</td>
                      <td>{envio.direccion}</td>
                      <td>{envio.ciudad}</td>
                      <td>
                        <span className={`badge bg-${getStatusBadge(envio.estado)} badge-estado-uniforme`}>
                          {envio.estado}
                        </span>
                      </td>
                      <td>{envio.fechaEnvio ? new Date(envio.fechaEnvio).toLocaleDateString() : ""}</td>
                      <td>{envio.fechaEntrega ? new Date(envio.fechaEntrega).toLocaleDateString() : ""}</td>
                      <td>{envio.vehiculoAsignado}</td>
                      <td>{envio.conductorAsignado}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                setEditEnvio(envio);
                                setShowEditModal(true);
                              }}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteClick(envio.id)}
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
                    <td colSpan={10} className="text-center py-4">
                      <div className="text-muted">No se encontraron envíos</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
              ¿Estás seguro que deseas eliminar este envío? Esta acción no se puede deshacer.
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

      {/* Modal para crear envío */}
      {showCreateModal && (
        <div className="crear-conductor-modal-bg">
          <div className="crear-conductor-modal" style={{ maxWidth: '80%', maxHeight: '90vh' }}>
            <h5 className="modal-title">Crear Envío</h5>
            <div className="crear-conductor-modal-scroll" style={{ 
              maxHeight: 'calc(90vh - 120px)',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '20px'
            }}>
              <form>
                <div className="row">
                  {/* Columna Izquierda */}
                  <div className="col-md-6 pe-md-2">
                    {/* Sección 1: Datos básicos del envío */}
                    <div className="mb-3 border-bottom pb-2">
                      <h6 className="text-primary mb-2">Información del Envío</h6>
                      <div className="row g-2">
                        <div className="col-12">
                          <label className="form-label">Nombre Remitente</label>
                          <input className="form-control" name="nombreRemitente" placeholder="Nombre del remitente" required />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Contacto Remitente</label>
                          <input className="form-control" name="num_ContactoRemitente" placeholder="Número de contacto" required pattern="[0-9+]{10,14}" />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Nombre Destinatario</label>
                          <input className="form-control" name="nombreDestinatario" placeholder="Nombre del destinatario" required />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Contacto Destinatario</label>
                          <input className="form-control" name="num_ContactoDestinatario" placeholder="Número de contacto" required pattern="[0-9+]{10,14}" />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Método de Pago</label>
                          <select className="form-select" name="metodoPago" required>
                            <option value="">Seleccionar método de pago</option>
                            <option value="Efectivo">Efectivo</option>
                            <option value="Tarjeta Debito">Tarjeta Débito</option>
                            <option value="Tarjeta Credito">Tarjeta Crédito</option>
                            <option value="Plataformas Virtuales">Plataformas Virtuales</option>
                            <option value="Cupones">Cupones</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Sección 2: Categoría del Envío */}
                    <div className="mb-3 border-bottom pb-2">
                      <h6 className="text-success mb-2">Categoría del Envío</h6>
                      <div className="row g-2">
                        <div className="col-12">
                          <select className="form-select mb-2" name="idCategoria" required>
                            <option value="">Selecciona una categoría</option>
                            <option value="1">Documentos - $15.000</option>
                            <option value="2">Abarrotes - $20.000</option>
                            <option value="3">Electrodomésticos - $1.500.000</option>
                            <option value="4">Mercancía - $50.000</option>
                            <option value="5">Papelería - $18.000</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <div className="card bg-light">
                            <div className="card-body">
                              <h6 className="card-subtitle mb-2 text-muted">Detalles de la Categoría</h6>
                              <p className="card-text">
                                <small>
                                  <strong>Nombre:</strong> <span id="categoriaNombre">-</span><br />
                                  <strong>Precio Base:</strong> <span id="categoriaPrecio">-</span><br />
                                  <strong>Descripción:</strong> <span id="categoriaDescripcion">-</span>
                                </small>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Columna Derecha */}
                  <div className="col-md-6 ps-md-2">
                    {/* Sección 3: Recogida */}
                    <div className="mb-3 border-bottom pb-2">
                      <h6 className="text-info mb-2">Información de Recogida</h6>
                      <div className="row g-2">
                        <div className="col-12">
                          <label className="form-label">Ciudad de Recogida</label>
                          <select className="form-select" name="idRecogida" required>
                            <option value="">Selecciona una ciudad</option>
                            <option value="1">Bogotá - $30.000</option>
                            <option value="2">Bucaramanga - $13.800</option>
                            <option value="3">Medellín - $14.000</option>
                            <option value="4">Cali - $14.200</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <label className="form-label">Dirección de Recogida</label>
                          <input className="form-control" name="direccionRecogida" placeholder="Dirección completa" required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Fecha Seleccionada</label>
                          <input type="datetime-local" className="form-control" name="fechaRecogidaSeleccionada" required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Fecha Final</label>
                          <input type="datetime-local" className="form-control" name="fechaRecogidaFinal" />
                        </div>
                      </div>
                    </div>

                    {/* Sección 4: Entrega */}
                    <div className="mb-3">
                      <h6 className="text-warning mb-2">Información de Entrega</h6>
                      <div className="row g-2">
                        <div className="col-12">
                          <label className="form-label">Ciudad de Entrega</label>
                          <select className="form-select" name="idEntrega" required>
                            <option value="">Selecciona una ciudad</option>
                            <option value="1">Bogotá - $30.000</option>
                            <option value="2">Bucaramanga - $13.800</option>
                            <option value="3">Medellín - $14.000</option>
                            <option value="4">Cali - $14.200</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <label className="form-label">Dirección de Entrega</label>
                          <input className="form-control" name="direccionEntrega" placeholder="Dirección completa" required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Fecha Seleccionada</label>
                          <input type="datetime-local" className="form-control" name="fechaEntregaSeleccionada" required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Fecha Final</label>
                          <input type="datetime-local" className="form-control" name="fechaEntregaFinal" />
                        </div>
                      </div>
                    </div>
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
                    onClick={() => setShowCreateModal(false)}
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar envío */}
      {showEditModal && editEnvio && (
        <div className="crear-conductor-modal-bg">
          <div className="crear-conductor-modal" style={{ maxWidth: '80%', maxHeight: '90vh' }}>
            <h5 className="modal-title">Editar Envío</h5>
            <div style={{ 
              maxHeight: 'calc(90vh - 120px)',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '20px'
            }}>
              <form>
                <div className="crear-conductor-form">
                  <div className="mb-2">
                    <label className="form-label">Código</label>
                    <input className="form-control" defaultValue={editEnvio.codigo} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Destinatario</label>
                    <input className="form-control" defaultValue={editEnvio.destinatario} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Dirección</label>
                    <input className="form-control" defaultValue={editEnvio.direccion} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Ciudad</label>
                    <input className="form-control" defaultValue={editEnvio.ciudad} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Estado</label>
                    <select className="form-select" defaultValue={editEnvio.estado}>
                      <option>Pendiente</option>
                      <option>En tránsito</option>
                      <option>Entregado</option>
                      <option>Cancelado</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Fecha de Envío</label>
                    <input className="form-control" type="date" defaultValue={editEnvio.fechaEnvio} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Fecha de Entrega</label>
                    <input className="form-control" type="date" defaultValue={editEnvio.fechaEntrega} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Vehículo Asignado</label>
                    <input className="form-control" defaultValue={editEnvio.vehiculoAsignado} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Conductor Asignado</label>
                    <input className="form-control" defaultValue={editEnvio.conductorAsignado} />
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
                    onClick={() => setShowEditModal(false)}
                  >
                    Guardar
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

export default Envios;