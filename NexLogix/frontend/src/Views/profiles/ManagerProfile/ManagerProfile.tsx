import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import FooterGeneralManager from "../../componets/Footers/FooterManager";
import NavbarGeneral from "../../componets/NavBars/NavbarGeneral";
import './../../Styles/Home/ProfilesGeneralStyle.css';

const ManagerProfile = () => {
  const location = useLocation();
  const [activeCollapse, setActiveCollapse] = useState<string | null>(null);

  // Función para determinar si una ruta está activa
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Función para determinar si un grupo de rutas está activo
  const isGroupActive = (paths: string[]) => {
    return paths.some(path => location.pathname === path);
  };

  // Efecto para manejar el colapso automático de submenús
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Determinar qué sección debe estar expandida basado en la ruta actual
    if (currentPath.includes('/manager/verAreas') || 
        currentPath.includes('/manager/Puestos') || 
        currentPath.includes('/manager/Roles') || 
        currentPath.includes('/manager/gestionUsuarios')) {
      setActiveCollapse('administracion');
    } else if (currentPath.includes('/manager/reportes') || 
               currentPath.includes('/manager/categoriaReportes') || 
               currentPath.includes('/manager/auditorias') || 
               currentPath.includes('/manager/logs')) {
      setActiveCollapse('gestionAuditoriasReportes');
    } else if (currentPath.includes('/manager/vehiculos') || 
               currentPath.includes('/manager/conductores') || 
               currentPath.includes('/manager/rutas') || 
               currentPath.includes('/manager/ciudades')) {
      setActiveCollapse('VehiculosSubmenu');
    } else {
      setActiveCollapse(null);
    }
  }, [location]);

  // Función para obtener la clase del enlace
  const getLinkClass = (path: string) => {
    const baseClass = "nav-link";
    return isActive(path) ? `${baseClass} active` : baseClass;
  };

  // Función para obtener la clase del enlace padre de submenú
  const getParentLinkClass = (paths: string[]) => {
    const baseClass = "nav-link";
    return isGroupActive(paths) ? `${baseClass} active` : baseClass;
  };
  return (
    /// aqui tienen que poner lo demas....
    <div className="profile-layout">
      <NavbarGeneral />
      {/* Contenedor principal */}
      <div className="container-fluid">
        <div className="row">

          {/* Sidebar: barra lateral de navegación */}
          <nav id="sidebar" className=" col-lg-2 d-md-block sidebar">
            <div className="position-sticky">
              <ul className="nav flex-column">

                {/* Opción Inicio */}
                <li className="nav-item mb-1 mt-3">
                  <Link className={`btn btn w-100 rounded-3 ${isActive('/manager') ? 'active' : ''}`} to="/manager">
                    INICIO MANAGER
                  </Link>
                </li>

                {/* Opción Gestión Áreas con submenú */}
                <li className="nav-item">
                  <Link 
                    className={getParentLinkClass(['/manager/verAreas', '/manager/Puestos', '/manager/Roles', '/manager/gestionUsuarios'])} 
                    data-bs-toggle="collapse" 
                    to="#administracion" 
                    role="button" 
                    aria-expanded={activeCollapse === 'administracion' ? "true" : "false"} 
                    aria-controls="administracion"
                  >
                    Adminstración
                  </Link>
                  <div className={`collapse ${activeCollapse === 'administracion' ? 'show' : ''}`} id="administracion">
                    <ul className="nav flex-column">
                      <Link className={getLinkClass('/manager/verAreas')} to="/manager/verAreas">Areas</Link>
                      <Link className={getLinkClass('/manager/Puestos')} to="/manager/Puestos">Puestos</Link>
                      <Link className={getLinkClass('/manager/Roles')} to="/manager/Roles">Roles</Link>
                      <Link className={getLinkClass('/manager/gestionUsuarios')} to="/manager/gestionUsuarios">Usuarios</Link>
                    </ul>
                  </div>
                </li>

                {/* Opción Gestión Auditorías y Reportes con submenú */}
                <li className="nav-item">
                  <Link 
                    className={getParentLinkClass(['/manager/reportes', '/manager/categoriaReportes', '/manager/auditorias', '/manager/logs'])} 
                    data-bs-toggle="collapse" 
                    to="#gestionAuditoriasReportes" 
                    role="button" 
                    aria-expanded={activeCollapse === 'gestionAuditoriasReportes' ? "true" : "false"} 
                    aria-controls="gestionAuditoriasReportes"
                  >
                    Gestión auditorías y reportes
                  </Link>
                  <div className={`collapse ${activeCollapse === 'gestionAuditoriasReportes' ? 'show' : ''}`} id="gestionAuditoriasReportes">
                    <ul className="nav flex-column">
                      <Link className={getLinkClass('/manager/reportes')} to="/manager/reportes">Reportes</Link>
                      <Link className={getLinkClass('/manager/categoriaReportes')} to="/manager/categoriaReportes">Categoría reportes</Link>
                      <Link className={getLinkClass('/manager/auditorias')} to="/manager/auditorias">Auditorías</Link>
                      <Link className={getLinkClass('/manager/logs')} to="/manager/logs">Logs</Link>
                    </ul>
                  </div>
                </li>
                {/* Opción Gestion Logistica con submenú */}
                <li className="nav-item">
                  <Link 
                    className={getParentLinkClass(['/manager/vehiculos', '/manager/conductores', '/manager/rutas', '/manager/ciudades'])} 
                    data-bs-toggle="collapse" 
                    to="#VehiculosSubmenu" 
                    role="button" 
                    aria-expanded={activeCollapse === 'VehiculosSubmenu' ? "true" : "false"} 
                    aria-controls="VehiculosSubmenu"
                  >
                    Gestión Logística
                  </Link>
                  <div className={`collapse ${activeCollapse === 'VehiculosSubmenu' ? 'show' : ''}`} id="VehiculosSubmenu">
                    <ul className="nav flex-column">
                      <Link className={getLinkClass('/manager/vehiculos')} to="/manager/vehiculos">Lista de vehículos</Link>
                      <Link className={getLinkClass('/manager/conductores')} to="/manager/conductores">Conductores</Link>
                      <Link className={getLinkClass('/manager/rutas')} to="/manager/rutas">Rutas</Link>
                      {/*<Link className="nav-link" to="/manager/envios">Gestion Envíos</Link>*/}
                      <Link className={getLinkClass('/manager/ciudades')} to="/manager/ciudades">Lista de ciudades</Link>

                    </ul>
                  </div>
                </li>

              </ul>
            </div>
          </nav>

          {/* Área principal (Main) */}
          <main>
            <Outlet />  {/* Aquí se renderiza el contenido según la ruta */}
          </main>
        </div>
      </div>

      {/* Pie de página */}
      <FooterGeneralManager />
    </div>
  );
};

export default ManagerProfile;