import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import FooterGeneralEmpleado from "../../componets/Footers/FooterEmpleado";
import NavbarGeneral from "../../componets/NavBars/NavbarGeneral";

const EmpleadoProfile = () => {
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
    
    if (currentPath.includes('/empleado/rutas')) {
      setActiveCollapse('RutasSubmenu');
    } else if (currentPath.includes('/empleado/vehiculos')) {
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
   <div className="profile-layout">
   <NavbarGeneral/>
   {/* Contenedor principal */}
   <div className="container-fluid">
     <div className="row">

       {/* Sidebar: barra lateral de navegación */}
       <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block sidebar shadow-lg">
         <div className="position-sticky">
           <ul className="nav flex-column">

                   {/* Opción Inicio */}
                   <Link className={getLinkClass('/empleado')} to="/empleado">Inicio EMPLEADO</Link>
                  
                   {/* Opción Envíos con submenú */}
                   {/*<li className="nav-item position-relative ">
                       <Link className="nav-link" data-bs-toggle="collapse" to="#enviosSubmenu" role="button" aria-expanded="false" aria-controls="enviosSubmenu">Envíos</Link>
                       <div className="collapse" id="enviosSubmenu">
                             <ul className="nav flex-column ms-3">
                                 <Link className="nav-link" to="/empleado/envios">Ver Envíos</Link>
                             </ul>
                       </div>
                   </li>*/}

                   {/* Opción Rutas con submenú */}
                   <li className="nav-item">
                         <Link 
                           className={getParentLinkClass(['/empleado/rutas'])} 
                           data-bs-toggle="collapse" 
                           to="#RutasSubmenu"  
                           role="button" 
                           aria-expanded={activeCollapse === 'RutasSubmenu' ? "true" : "false"}  
                           aria-controls="RutasSubmenu"
                         >
                           Rutas
                         </Link>
                         <div className={`collapse ${activeCollapse === 'RutasSubmenu' ? 'show' : ''}`} id="RutasSubmenu">
                               <ul className="nav flex-column ms-3">
                                 <Link className={getLinkClass('/empleado/rutas')} to="/empleado/rutas">Ver lista de rutas</Link>
                               </ul>
                         </div>
                   </li>

                   {/* Opción Vehículos */}
                   <li className="nav-item">
                         <Link 
                           className={getParentLinkClass(['/empleado/vehiculos'])} 
                           data-bs-toggle="collapse" 
                           to="#VehiculosSubmenu"  
                           role="button" 
                           aria-expanded={activeCollapse === 'VehiculosSubmenu' ? "true" : "false"}  
                           aria-controls="VehiculosSubmenu"
                         >
                           Vehículos
                         </Link>
                         <div className={`collapse ${activeCollapse === 'VehiculosSubmenu' ? 'show' : ''}`} id="VehiculosSubmenu">
                               <ul className="nav flex-column ms-3">
                                 <Link className={getLinkClass('/empleado/vehiculos')} to="/empleado/vehiculos">Ver mis vehículos</Link>
                               </ul>
                         </div>
                   </li>

                   {/* Opción Reportes */}
                   <li className="nav-item">
                       <Link className="nav-link" data-bs-toggle="collapse" to="#ReportesSubMenu" role="button" aria-expanded="false" aria-controls="ReportesSubMenu">Reportes</Link>
                           <div className="collapse" id="ReportesSubMenu"> 
                                 <ul className="nav flex-column ms-3">
                                   <Link className="nav-link" to="/empleado/reportes">Ver reportes</Link>
                                 </ul>
                           </div>
                   </li>

           </ul>
         </div>
       </nav>

       {/* Área principal (Main) */}
         <main className="p-3">
           <Outlet />  {/* Aquí se renderiza el contenido según la ruta */}
         </main>
     </div>
   </div>

   {/* Pie de página */}
   <FooterGeneralEmpleado />
 </div>
 );
};

export default EmpleadoProfile;