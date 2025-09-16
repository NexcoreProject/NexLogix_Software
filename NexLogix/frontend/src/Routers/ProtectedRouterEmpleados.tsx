import { Routes, Route } from "react-router-dom";
import EmpleadoProfile from "../Views/profiles/EmpleadoProfile/EmpleadoProfile";
import HomeEmpleado from "../Views/profiles/EmpleadoProfile/HomeEmpleado";
import ReportesConductor from "../Views/pages/EmpleadoPages/ReportesConductor";
import RutasConductor from "../Views/pages/EmpleadoPages/RutasConductor";
import VehiculosConductor from "../Views/pages/EmpleadoPages/VehiculosConductor";
import EstamosUbicadosEn from "../Views/componets/Footers/EstamosUbicadoEn";
import AcercaDe from "../Views/componets/Footers/AcercaDe";
// Rutas privadas para Empleado/Conductor: cuelgan del layout EmpleadoProfile (sidebar + contenido)

const ProtectedRouteEmpleados = () => {
  return (
    <Routes>
      <Route path="/" element={<EmpleadoProfile />}>
        <Route index element={<HomeEmpleado />} />

  {/* Gestión envíos (si aplica a empleado/conductor) */}

  {/* Gestión de rutas del conductor */}
        <Route path="rutas" element={<RutasConductor />} />

  {/* Gestión de vehículos asignados */}
        <Route path="vehiculos" element={<VehiculosConductor />} />

  {/* Reportes que genera el conductor */}
        {<Route path="reportes" element={<ReportesConductor />} />}

        <Route path="ubicacion" element={<EstamosUbicadosEn />} />
        <Route path="/acerca_de" element={<AcercaDe />} />
        
      </Route>
    </Routes>
  );
};

export default ProtectedRouteEmpleados;
