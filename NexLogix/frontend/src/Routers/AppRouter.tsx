import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"; // Importa componentes de react-router-dom para manejar la navegación
import { useEffect } from 'react';

// PÁGINAS PÚBLICAS
import Login from "../Views/pages/Login"; // Importa el componente de la página de inicio de sesión
import UnauthorizedRoute from "./UnauthorizedRoute"; // Importa el componente para la página de acceso no autorizado
import EstamosUbicadosEn from "../Views/componets/Footers/EstamosUbicadoEn"; // Importa el componente para la página de ubicación
import AcercaDe from "../Views/componets/Footers/AcercaDe"; // Importa el componente para la página "Acerca de"

// PROTECCIÓN DE RUTAS
import PrivateRoute from "./PrivateRoute"; // Importa el componente que protege rutas según autenticación y roles
import ProtectedRouteEmpleados from "./ProtectedRouterEmpleados"; // Importa el componente de rutas protegidas para el rol Empleado
import ProtectedRouteManagers from "./ProtectedRouterManagers"; // Importa el componente de rutas protegidas para el rol Manager

// RouterContent: se monta dentro de BrowserRouter para tener acceso a navigate.
// Inyecta navigate en axiosConfig (para redirecciones globales) y define todas las rutas.
const RouterContent = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Importamos setNavigate de forma dinámica para evitar problemas de circular dependency
    import('../services/axiosConfig').then(({ setNavigate }) => {
      setNavigate(navigate);
    });
  }, [navigate]);

  return (
  <Routes> {/* Contenedor de rutas de la app */}

                {/* RUTAS PÚBLICAS */}
                <Route path="/" index element={<Login />} /> {/* Ruta pública para la página de login, marcada como ruta raíz */}
                <Route path="/unauthorized" element={<UnauthorizedRoute />} /> {/* Ruta pública para la página de acceso no autorizado */}
                <Route path="/ubicacion" element={<EstamosUbicadosEn />} /> {/* Ruta pública para la página de ubicación */}
                <Route path="/acerca_de" element={<AcercaDe />} /> {/* Ruta pública para la página "Acerca de" */}

                {/* RUTAS PROTEGIDAS - MANAGER */}
                <Route
                    path="/Manager/*" // Ruta base para todas las subrutas de Manager, el asterisco permite subrutas anidadas
                    element={ /* Define el componente a renderizar para esta ruta */
                      
                      // Protege la ruta, solo permite acceso al rol Manager 
                      <PrivateRoute allowedRoles={["Manager"]}> 
                          {/* Renderiza el componente con las subrutas de Manager */}
                          <ProtectedRouteManagers /> 
                      </PrivateRoute>
                    }
                />

                {/* RUTAS PROTEGIDAS - EMPLEADO Y CONDUCTOR */}
                <Route
                    path="/Empleado/*" // Ruta base para todas las subrutas de Empleado y Conductor, el asterisco permite subrutas anidadas
                    element={ /* Define el componente a renderizar para esta ruta */

                      // Protege la ruta, permite acceso a roles Empleado y Conductor
                      <PrivateRoute allowedRoles={["Empleado", "Conductor"]}> 
                          {/* Renderiza el componente con las subrutas de Empleado/Conductor */}
                          <ProtectedRouteEmpleados /> 
                      </PrivateRoute>
                    }
                />
              </Routes>
  );
};

// AppRouter: responsable de envolver todo en BrowserRouter (historial HTML5)
const AppRouter = () => {
  return (
    <BrowserRouter>
      <RouterContent />
    </BrowserRouter>
  );
};

export default AppRouter; // Exporta AppRouter como componente predeterminado
// BrowserRouter habilita la navegacion basada en URL