import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import FooterGeneralManager from "../../componets/Footers/FooterManager";
import NavbarGeneral from "../../componets/NavBars/NavbarGeneral";
import './../../Styles/Home/ProfilesGeneralStyle.css';
import './../../Styles/Sidebar/ModernSidebar.css';

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
               currentPath.includes('/manager/auditorias')) {
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
          <nav id="sidebar" className="col-lg-2 d-md-block modern-sidebar">
            <div className="position-sticky">
              <div className="nav flex-column modern-nav">

                {/* Opción Inicio */}
                <div className="nav-item-wrapper mb-2">
                  <Link className={`modern-nav-item home-item ${isActive('/manager') ? 'active' : ''}`} to="/manager">
                    <i className="bi bi-house-door"></i>
                    <span>Inicio Manager</span>
                    <div className="nav-glow"></div>
                  </Link>
                </div>

                {/* Opción Administración con submenú */}
                <div className="nav-item-wrapper">
                  <Link 
                    className={`modern-nav-item dropdown-toggle ${getParentLinkClass(['/manager/verAreas', '/manager/Puestos', '/manager/Roles', '/manager/gestionUsuarios']).includes('active') ? 'active' : ''}`}
                    data-bs-toggle="collapse" 
                    to="#administracion" 
                    role="button" 
                    aria-expanded={activeCollapse === 'administracion' ? "true" : "false"} 
                    aria-controls="administracion"
                  >
                    <i className="bi bi-gear"></i>
                    <span>Administración</span>
                    <i className={`bi bi-chevron-right dropdown-arrow ${activeCollapse === 'administracion' ? 'rotated' : ''}`}></i>
                    <div className="nav-glow"></div>
                  </Link>
                  <div className={`modern-collapse ${activeCollapse === 'administracion' ? 'show' : ''}`} id="administracion">
                    <div className="submenu-container">
                      <Link className={`submenu-item ${getLinkClass('/manager/verAreas').includes('active') ? 'active' : ''}`} to="/manager/verAreas">
                        <i className="bi bi-diagram-3"></i>
                        <span>Áreas</span>
                      </Link>
                      <Link className={`submenu-item ${getLinkClass('/manager/Puestos').includes('active') ? 'active' : ''}`} to="/manager/Puestos">
                        <i className="bi bi-briefcase"></i>
                        <span>Puestos</span>
                      </Link>
                      <Link className={`submenu-item ${getLinkClass('/manager/Roles').includes('active') ? 'active' : ''}`} to="/manager/Roles">
                        <i className="bi bi-person-badge"></i>
                        <span>Roles</span>
                      </Link>
                      <Link className={`submenu-item ${getLinkClass('/manager/gestionUsuarios').includes('active') ? 'active' : ''}`} to="/manager/gestionUsuarios">
                        <i className="bi bi-people"></i>
                        <span>Usuarios</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Opción Gestión Auditorías y Reportes con submenú */}
                <div className="nav-item-wrapper">
                  <Link 
                    className={`modern-nav-item dropdown-toggle ${getParentLinkClass(['/manager/reportes', '/manager/categoriaReportes', '/manager/auditorias']).includes('active') ? 'active' : ''}`}
                    data-bs-toggle="collapse" 
                    to="#gestionAuditoriasReportes" 
                    role="button" 
                    aria-expanded={activeCollapse === 'gestionAuditoriasReportes' ? "true" : "false"} 
                    aria-controls="gestionAuditoriasReportes"
                  >
                    <i className="bi bi-clipboard-data"></i>
                    <span>Auditorías y Reportes</span>
                    <i className={`bi bi-chevron-right dropdown-arrow ${activeCollapse === 'gestionAuditoriasReportes' ? 'rotated' : ''}`}></i>
                    <div className="nav-glow"></div>
                  </Link>
                  <div className={`modern-collapse ${activeCollapse === 'gestionAuditoriasReportes' ? 'show' : ''}`} id="gestionAuditoriasReportes">
                    <div className="submenu-container">
                      <Link className={`submenu-item ${getLinkClass('/manager/reportes').includes('active') ? 'active' : ''}`} to="/manager/reportes">
                        <i className="bi bi-bar-chart"></i>
                        <span>Reportes</span>
                      </Link>
                      <Link className={`submenu-item ${getLinkClass('/manager/categoriaReportes').includes('active') ? 'active' : ''}`} to="/manager/categoriaReportes">
                        <i className="bi bi-tags"></i>
                        <span>Categoría Reportes</span>
                      </Link>
                      <Link className={`submenu-item ${getLinkClass('/manager/auditorias').includes('active') ? 'active' : ''}`} to="/manager/auditorias">
                        <i className="bi bi-shield-check"></i>
                        <span>Auditorías</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Opción Gestión Logística con submenú */}
                <div className="nav-item-wrapper">
                  <Link 
                    className={`modern-nav-item dropdown-toggle ${getParentLinkClass(['/manager/vehiculos', '/manager/conductores', '/manager/rutas', '/manager/ciudades']).includes('active') ? 'active' : ''}`}
                    data-bs-toggle="collapse" 
                    to="#VehiculosSubmenu" 
                    role="button" 
                    aria-expanded={activeCollapse === 'VehiculosSubmenu' ? "true" : "false"} 
                    aria-controls="VehiculosSubmenu"
                  >
                    <i className="bi bi-truck"></i>
                    <span>Gestión Logística</span>
                    <i className={`bi bi-chevron-right dropdown-arrow ${activeCollapse === 'VehiculosSubmenu' ? 'rotated' : ''}`}></i>
                    <div className="nav-glow"></div>
                  </Link>
                  <div className={`modern-collapse ${activeCollapse === 'VehiculosSubmenu' ? 'show' : ''}`} id="VehiculosSubmenu">
                    <div className="submenu-container">
                      <Link className={`submenu-item ${getLinkClass('/manager/vehiculos').includes('active') ? 'active' : ''}`} to="/manager/vehiculos">
                        <i className="bi bi-car-front"></i>
                        <span>Lista de Vehículos</span>
                      </Link>
                      <Link className={`submenu-item ${getLinkClass('/manager/conductores').includes('active') ? 'active' : ''}`} to="/manager/conductores">
                        <i className="bi bi-person-check"></i>
                        <span>Conductores</span>
                      </Link>
                      <Link className={`submenu-item ${getLinkClass('/manager/rutas').includes('active') ? 'active' : ''}`} to="/manager/rutas">
                        <i className="bi bi-map"></i>
                        <span>Rutas</span>
                      </Link>
                      <Link className={`submenu-item ${getLinkClass('/manager/ciudades').includes('active') ? 'active' : ''}`} to="/manager/ciudades">
                        <i className="bi bi-building"></i>
                        <span>Lista de Ciudades</span>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </nav>

          {/* Área principal (Main) */}
          <main className="col-lg-10 modern-main-content">
            <div className="main-content-wrapper">
              <Outlet />  {/* Aquí se renderiza el contenido según la ruta */}
            </div>
          </main>
        </div>
      </div>

      {/* Pie de página */}
      <FooterGeneralManager />
    </div>
  );
};

export default ManagerProfile;