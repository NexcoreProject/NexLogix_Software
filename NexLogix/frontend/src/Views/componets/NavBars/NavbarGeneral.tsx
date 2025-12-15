import { useLogoutController } from "../../../Controllers/Users/UserController";
import logo from "../../../assets/logo.png"; // Se corrigió la ruta para importar el logo PNG correctamente
import './NavbarGeneral.css';


const NavbarGeneral = () => {
    // Llamada del controller logout
    const { handleLogout } = useLogoutController();

    // cada click es llama al controller logout para hacer la accion
    const onLogoutClick = async () => {
        const result = await handleLogout();
        if (!result.success) {
            alert(result.message);
        } else {
            alert('¡Hasta pronto!');
        }
    };

    return (
        <nav
            className="navbar navbar-expand-lg navbar-dark shadow-lg"
            style={{ height: 60, minHeight: 60, maxHeight: 60 }} // Altura fija del navbar
        >
            <div
                className="navbar-brand p-5 mr-7 d-flex align-items-center"
                style={{
                    height: 60,
                    overflow: "hidden",
                    marginLeft: "20px"
                }}
            >
                <img
                    src={logo}
                    alt="Logo NexLogix"
                    style={{
                        width: 80,
                        height: 80,
                        marginRight: 0,
                        objectFit: "contain",
                        display: "block"
                    }}
                />
            </div>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                {/* Aquí puedes poner otros elementos del menú si los tienes */}
            </div>
            {/* Botón Configuraciones SIEMPRE visible a la derecha */}
            <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                    <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Configuraciones
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end navbar-dropdown" aria-labelledby="navbarDropdown">
                        <li>
                            {/* AQUI SE PONE EL LINK DEL MANUAL */}
                            <a
                                className="dropdown-item custom-bg"
                                href="#" 
                                download
                            >
                                Descargar Manual de Usuario
                            </a>
                        </li>
                        <li>
                            {/*NO TOCAR POR EL AMOR A CRISTO
                                Aqui esta la llamada del controller Logout
                            */}
                            <button className="dropdown-item custom-logout fw-bold" onClick={onLogoutClick}> SALIR </button>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
};

export default NavbarGeneral;