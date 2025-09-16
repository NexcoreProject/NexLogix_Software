import { useAuthLoginController } from "../../Controllers/Auth/AuthController"; // Lógica de autenticación (sin cambios)
import { useState } from "react";
import { axiosInstance } from "../../services/axiosConfig";
import "../Styles/Login/generalStyleLogin.css"; // Estilos del nuevo diseño glass + fondo con luces

const Login = () => { // Componente de Login (solo UI cambiada)
  const { // Desestructura las propiedades y funciones retornadas por useAuthLoginController
    email, setEmail, // Estado y función para manejar el valor del campo de correo electrónico
    contrasena, setContrasena, // Estado y función para manejar el valor del campo de contraseña
    error, // Estado para almacenar mensajes de error de autenticación
    handleSubmit, // Función para manejar el envío del formulario de login
  } = useAuthLoginController();

  // Estado del modal "Usuario Bloqueado"
  const [showBlocked, setShowBlocked] = useState(false);
  const [blockedEmail, setBlockedEmail] = useState("");
  const [blockedId, setBlockedId] = useState("");
  const [blockedName, setBlockedName] = useState("");
  const [blockedPhone, setBlockedPhone] = useState("");
  const [blockedStatus, setBlockedStatus] = useState<{state: "idle"|"sending"|"ok"|"error"; message?: string}>({state: "idle"});

  const submitBlockedRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setBlockedStatus({ state: "sending" });
      // Intento de envío al backend. Si la ruta no existe, se maneja el error con elegancia.
      await axiosInstance.post("/support/unlock-request", {
        email: blockedEmail,
        externalId: blockedId,
        name: blockedName,
        phone: blockedPhone,
        source: "login",
        ts: new Date().toISOString(),
      });
      setBlockedStatus({ state: "ok", message: "Solicitud enviada. IT te contactará pronto." });
      setTimeout(() => setShowBlocked(false), 1200);
    } catch (err) {
      console.error("[unlock-request]", err);
      setBlockedStatus({ state: "error", message: "No se pudo enviar. Intenta más tarde." });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" aria-hidden></div>
      <div className="auth-bg second" aria-hidden></div>

      <div className="auth-grid">
        {/* Panel izquierdo (hero) */}
        <section className="auth-hero" aria-label="Bienvenida NexLogix">
          <div className="hero-inner">
            <div className="hero-badge">Plataforma logística</div>
            <h1 className="hero-title">
              Bienvenid@ a <span className="brand-gradient">NexLogix</span>
            </h1>
            <p className="hero-sub">Gestiona envíos, rutas y flotas con una experiencia moderna y segura.</p>
            <ul className="hero-bullets" aria-label="Ventajas de la plataforma">
              <li><i className="bi bi-shield-lock"></i> Seguridad con JWT</li>
              <li><i className="bi bi-graph-up"></i> Operación eficiente</li>
              <li><i className="bi bi-truck"></i> Logística en tiempo real</li>
            </ul>
          </div>
        </section>

        {/* Panel derecho (form) */}
        <section className="auth-card" role="dialog" aria-label="Formulario de inicio de sesión">
          <div className="auth-card-header">
            <h2>Iniciar sesión</h2>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <div className="login-alert" role="alert">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error.replace(/^Error\s+[^:]+:\s*/, "")}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <label className="input-wrap">
              <span className="input-icon" aria-hidden>
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                className="input"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                required
              />
            </label>

            <label className="input-wrap">
              <span className="input-icon" aria-hidden>
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                className="input"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                id="password"
                name="password"
                required
              />
            </label>

            <button type="submit" className="login-btn">
              Iniciar Sesión
            </button>

            <button
              type="button"
              className="blocked-link"
              onClick={() => {
                setShowBlocked(true);
                setBlockedStatus({ state: "idle" });
              }}
              aria-label="Solicitud de desbloqueo de usuario"
            >
              ¿Usuario Bloqueado?
            </button>
          </form>
        </section>
      </div>

      {showBlocked && (
        <div className="blocked-modal-backdrop" role="dialog" aria-modal="true">
          <div className="blocked-modal">
            <div className="blocked-header">
              <h3>Solicitud de Desbloqueo</h3>
              <button className="blocked-close" onClick={() => setShowBlocked(false)} aria-label="Cerrar">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <p className="blocked-desc">Completa los datos para que IT procese tu desbloqueo.</p>

            <form className="blocked-form" onSubmit={submitBlockedRequest}>
              <label>
                <span>Correo</span>
                <input type="email" required value={blockedEmail} onChange={(e)=>setBlockedEmail(e.target.value)} />
              </label>
              <label>
                <span>ID</span>
                <input type="text" required value={blockedId} onChange={(e)=>setBlockedId(e.target.value)} />
              </label>
              <label>
                <span>Nombre</span>
                <input type="text" required value={blockedName} onChange={(e)=>setBlockedName(e.target.value)} />
              </label>
              <label>
                <span>Teléfono</span>
                <input type="tel" required value={blockedPhone} onChange={(e)=>setBlockedPhone(e.target.value)} />
              </label>

              <div className="blocked-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowBlocked(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={blockedStatus.state === "sending"}>
                  {blockedStatus.state === "sending" ? "Enviando…" : "Enviar"}
                </button>
              </div>

              {blockedStatus.state === "ok" && (
                <div className="blocked-feedback ok"><i className="bi bi-check-circle-fill"></i> {blockedStatus.message}</div>
              )}
              {blockedStatus.state === "error" && (
                <div className="blocked-feedback error"><i className="bi bi-x-octagon-fill"></i> {blockedStatus.message}</div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login; // Exporta Login como componente predeterminado para ser usado en AppRouter