import { Route, Routes } from "react-router-dom";

// IMPORT PROFILE MANAGER
import ManagerProfile from "../Views/profiles/ManagerProfile/ManagerProfile";
import HomeManager from "../Views/profiles/ManagerProfile/HomeManager";

// AREAS
// import EditarAreas from "../Views/pages/Areas/EditarArea";
// import CrearArea from "../Views/pages/Areas/CrearArea";
// import EliminarArea from "../Views/pages/Areas/EliminarArea";

// ADMINISTRACION
import Puestos from "../Views/pages/Administracion/Puestos";
import VerAreas from '../Views/pages/Administracion/VerAreas';
import Reportes from "../Views/pages/Administracion/Reportes";
import Roles from "../Views/pages/Administracion/Roles";
import GestionUsuarios from "../Views/pages/Administracion/GestionUsuarios";


// CIUDADES
import Ciudades from "../Views/pages/GestionLogistica/Ciudades";

// ENVIOS
import Envios from "../Views/pages/GestionLogistica/Envios";
// RUTAS
import Rutas from "../Views/pages/GestionLogistica/Rutas";

// VEHICULOS
import GestionVehiculos from "../Views/pages/GestionLogistica/GestionVehiculos";

// CONDUCTORES
import Conductores from "../Views/pages/GestionLogistica/Conductores";
// FOOTER
import EstamosUbicadosEn from "../Views/componets/Footers/EstamosUbicadoEn";
import AcercaDe from "../Views/componets/Footers/AcercaDe";

// AUDITORIAS
import Auditorias from "../Views/pages/Auditorias/Auditorias";

// NUEVAS SECCIONES PARA GESTIÓN AUDITORÍAS Y REPORTES
import CategoriaReportes from "../Views/pages/CategoriaReportes/CategoriaReportes";
import Logs from "../Views/pages/Logs/Logs";
// Rutas privadas para Manager: cuelgan del layout ManagerProfile (sidebar + contenido)

const ProtectedRouteManagers = () => {
  return (
    <Routes>
      <Route path="/" element={<ManagerProfile />}>
        <Route index element={<HomeManager />} />

        {/*GESTION AREAS*/} 
        {/* <Route path="verAreas" element={<VerAreas />} />
        <Route path="crearArea" element={<CrearArea />} />
        <Route path="editarArea" element={<EditarAreas />} />
        <Route path="eliminarArea" element={<EliminarArea />} /> */}

  {/* GESTIÓN ADMINISTRACIÓN: CRUD de catálogos y usuarios */}
        <Route path="verAreas" element={<VerAreas />} />
        <Route path="puestos" element={<Puestos />} />
        <Route path="roles" element={<Roles />} />
        <Route path="gestionUsuarios" element={<GestionUsuarios />} />

  {/* Auditorías y reportes del sistema */}
        <Route path="reportes" element={<Reportes />} />
        <Route path="categoriaReportes" element={<CategoriaReportes />} />
        <Route path="auditorias" element={<Auditorias />} />
        <Route path="logs" element={<Logs />} />
  {/* Gestión logística */}
        <Route path="ciudades" element={<Ciudades />} />

  {/* Gestión envíos */}
        <Route path="envios" element={<Envios />} />
        

  {/* Gestión rutas */}
        <Route path="rutas" element={<Rutas />} />
  {/* Gestión vehículos */}
        <Route path="vehiculos" element={<GestionVehiculos />} />
  {/* Gestión conductores */}
        <Route path="conductores" element={<Conductores />} />

  {/* Home manager (vista principal) */}

        {/*FOOTER*/}
        <Route path="ubicacion" element={<EstamosUbicadosEn />} />
        <Route path="acerca_de" element={<AcercaDe />} />

      </Route>
    </Routes>
  );
};

export default ProtectedRouteManagers;