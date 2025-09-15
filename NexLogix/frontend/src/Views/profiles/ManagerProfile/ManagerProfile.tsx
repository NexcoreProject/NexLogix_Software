import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import FooterGeneralManager from "../../componets/Footers/FooterManager";
import NavbarGeneral from "../../componets/NavBars/NavbarGeneral";
import './../../Styles/Home/ProfilesGeneralStyle.css';

const ManagerProfile = () => {
  return (
    /// aqui tienen que poner lo demas....
    <>
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
                  <Link className="btn btn w-100 rounded-3" to="/manager">
                    INICIO MANAGER
                  </Link>
                </li>

                {/* Opción Gestión Áreas con submenú */}
                <li className="nav-item">
                  <Link className="nav-link" data-bs-toggle="collapse" to="#administracion" role="button" aria-expanded="false" aria-controls="administracion">
                    Adminstración
                  </Link>
                  <div className="collapse" id="administracion">
                    <ul className="nav flex-column">
                      <Link className="nav-link" to="/manager/verAreas">Areas</Link>
                      <Link className="nav-link" to="/manager/Puestos">Puestos</Link>
                      <Link className="nav-link" to="/manager/Roles">Roles</Link>
                      <Link className="nav-link" to="/manager/gestionUsuarios">Usuarios</Link>
                    </ul>
                  </div>
                </li>

                {/* Opción Gestión Auditorías y Reportes con submenú */}
                <li className="nav-item">
                  <Link className="nav-link" data-bs-toggle="collapse" to="#gestionAuditoriasReportes" role="button" aria-expanded="false" aria-controls="gestionAuditoriasReportes">
                    Gestión auditorías y reportes
                  </Link>
                  <div className="collapse" id="gestionAuditoriasReportes">
                    <ul className="nav flex-column">
                      <Link className="nav-link" to="/manager/reportes">Reportes</Link>
                      <Link className="nav-link" to="/manager/categoriaReportes">Categoría reportes</Link>
                      <Link className="nav-link" to="/manager/auditorias">Auditorías</Link>
                      <Link className="nav-link" to="/manager/logs">Logs</Link>
                    </ul>
                  </div>
                </li>
                {/* Opción Gestion Logistica con submenú */}
                <li className="nav-item">
                  <Link className="nav-link" data-bs-toggle="collapse" to="#VehiculosSubmenu" role="button" aria-expanded="false" aria-controls="VehiculosSubmenu">Gestión Logística</Link>
                  <div className="collapse" id="VehiculosSubmenu">
                    <ul className="nav flex-column">
                      <Link className="nav-link" to="/manager/vehiculos">Lista de vehículos</Link>
                      <Link className="nav-link" to="/manager/conductores">Conductores</Link>
                      <Link className="nav-link" to="/manager/rutas">Rutas</Link>
                      {/*<Link className="nav-link" to="/manager/envios">Gestion Envíos</Link>*/}
                      <Link className="nav-link" to="/manager/ciudades">Lista de ciudades</Link>

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
    </>
  );
};

export default ManagerProfile;