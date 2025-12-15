import { useState, useEffect } from "react";
import { VehiculosController } from "../../../Controllers/VehiculosController";
import { UserProfileController } from "../../../Controllers/Users/UserController";
import { IVehiculo } from "../../../models/Interfaces/IVehiculo";
import { IConductor } from "../../../models/Interfaces/IConductor";
import { axiosInstance } from "../../../services/axiosConfig";


const VehiculosConductor = () => {
  const [vehiculos, setVehiculos] = useState<IVehiculo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Cargar el ID del usuario conductor
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await UserProfileController();
        if (response.data.success) {
          setUserId(response.data.Data.ID);
        }
      } catch (err) {
        console.error("Error al obtener el perfil del usuario:", err);
        setError("No se pudo cargar la información del usuario");
      }
    };
    fetchUserProfile();
  }, []);

  const [conductorId, setConductorId] = useState<number | null>(null);

  // Primero obtener el ID del conductor
  useEffect(() => {
    const getConductorId = async () => {
      if (!userId) return;
      
      try {
        const response = await axiosInstance.get(`/gestion_conductores/by-user/${userId}`);
        if (response.data.success) {
          setConductorId(response.data.data.idConductor);
        }
      } catch (err) {
        console.error("Error al obtener el ID del conductor:", err);
        setError("No se pudo obtener la información del conductor");
      }
    };
    getConductorId();
  }, [userId]);

  // Luego cargar los vehículos asignados al conductor
  useEffect(() => {
    const loadVehiculos = async () => {
      if (!conductorId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const asignaciones = await VehiculosController.getAsignacionesConductores();
        // Filtrar las asignaciones activas (sin fecha de entrega) para este conductor
        const asignacionesActivas = asignaciones.filter(
          asig => {
            // Type guard para verificar que conductor tiene idConductor
            const conductor = asig.conductor as IConductor;
            return conductor.idConductor === conductorId && !asig.fecha_entrega_vehiculo;
          }
        );
        
        if (asignacionesActivas.length > 0) {
          const vehiculosCompletos = await Promise.all(
            asignacionesActivas.map(async (asig) => {
              const vehiculoCompleto = await VehiculosController.getVehiculoById(asig.vehiculo.placa);
              return vehiculoCompleto;
            })
          );
          setVehiculos(vehiculosCompletos);
        } else {
          setVehiculos([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los vehículos');
      } finally {
        setIsLoading(false);
      }
    };

    loadVehiculos();
  }, [conductorId, userId]);

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
    <div className="container-fluid">
      {/* Header */}
      <div className="header-azul mb-3">
        <div className="d-flex align-items-center p-3">
          <i className="bi bi-truck me-2" style={{ fontSize: 24 }} />
          <h2 className="mb-0 text-white">Mis Vehículos Asignados</h2>
        </div>
      </div>

      {/* Alerta cuando no hay vehículos asignados */}
      {!isLoading && vehiculos.length === 0 && (
        <div className="alert alert-info d-flex align-items-center mb-3" role="alert">
          <i className="bi bi-info-circle-fill me-2"></i>
          <div>
            No tienes vehículos asignados en este momento. Por favor, contacta a tu supervisor si crees que esto es un error.
          </div>
        </div>
      )}

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

      <div className="card">
        <div className="card-body">
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
                    <th>Placa</th>
                    <th>Marca</th>
                    <th>Tipo</th>
                    <th>Capacidad</th>
                    <th>Estado</th>
                    <th>Último Mantenimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiculos.map((vehiculo) => (
                    <tr key={vehiculo.idVehiculo}>
                      <td>{vehiculo.placa}</td>
                      <td>{vehiculo.marcaVehiculo}</td>
                      <td>{vehiculo.tipoVehiculo}</td>
                      <td>{vehiculo.capacidad}</td>
                      <td>
                        <span className={`badge bg-${getStatusBadge(vehiculo.estadoVehiculo)}`}>
                          {vehiculo.estadoVehiculo.replace('_', ' ')}
                        </span>
                      </td>
                      <td>{new Date(vehiculo.ultimoMantenimiento).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {vehiculos.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-3">
                        <div className="text-muted">No hay vehículos asignados</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehiculosConductor;
