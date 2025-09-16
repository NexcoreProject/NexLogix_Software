import { useAuthLoginController } from "../../Controllers/Auth/AuthController"; // Importa el hook personalizado useAuthLoginController para manejar la lógica de autenticación
import "../Styles/Login/generalStyleLogin.css"; // Importa el archivo CSS personalizado para estilos específicos del componente Login

const Login = () => { // Define el componente funcional Login para la página de inicio de sesión
  const { // Desestructura las propiedades y funciones retornadas por useAuthLoginController
    email, setEmail, // Estado y función para manejar el valor del campo de correo electrónico
    contrasena, setContrasena, // Estado y función para manejar el valor del campo de contraseña
    error, // Estado para almacenar mensajes de error de autenticación
    handleSubmit, // Función para manejar el envío del formulario de login
  } = useAuthLoginController();

  return (
    <> {/* Fragmento para envolver múltiples elementos sin agregar un contenedor adicional */}
      <div className="bg_login"> {/* Contenedor principal con clase personalizada bg_login para el fondo */}
        <div className="container d-flex justify-content-center align-items-center "> {/* Contenedor Bootstrap centrado verticalmente y horizontalmente */}
          <div className="login_caja animate__animated animate__fadeIn"> {/* Contenedor del formulario con clase personalizada y animación */}
            <div className="text-center"> {/* Contenedor para el logo o nombre de la marca */}
              <h2 className="fw-bold mb-5">NexLogix</h2> {/* Nombre de la aplicación como marca */}
            </div>
              {error && ( /* Muestra un toast para errores en lugar de alert */
              (() => {
                const match = error.match(/^Error\s+([^:]+):\s*(.*)$/i);
                const code = match ? match[1] : null;
                const message = match ? match[2] : error;
                return (
                  <div className="toast show mx-auto mb-3" role="alert">
                    <div className="toast-header bg-danger text-white">
                      <strong className="me-auto">{`Error${code ? ` ${code}` : ''}`}</strong>
                      <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
                    </div>
                    <div className="toast-body text-white">{message}</div>
                  </div>
                );
              })()
            )}
            <form onSubmit={handleSubmit}> {/* Formulario que ejecuta handleSubmit al enviarse */}
              <div className="mb-3"> {/* Campo de correo con ícono */}
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-envelope-fill text-primary"></i>
                  </span>
                  <input
                    type="email" className="form-control border-start-0" placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email" name="email"
                    required
                  />
                </div>
              </div>
              <div className="mb-3"> {/* Campo de contraseña con ícono */}
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-lock-fill text-primary"></i>
                  </span>
                  <input
                    type="password" className="form-control border-start-0" placeholder="Contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    id="password" name="password"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                {/* Botón de envío sin spinner hasta que se añada isLoading en useAuthLoginController */}
                <span>Iniciar Sesión</span>
                {/* Nota: Agregar spinner cuando isLoading esté disponible: {isLoading && <span className="spinner-border spinner-border-sm" />} */}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login; // Exporta Login como componente predeterminado para ser usado en AppRouter