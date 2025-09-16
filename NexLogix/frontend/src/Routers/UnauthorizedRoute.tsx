import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../styles/unauthorized.css";

export default function UnauthorizedRoute() {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(3);

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    const timeout = setTimeout(() => {
      navigate("/"); // Redirige a login
    }, 3000); // 3 segundos

    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [navigate]);

  const progress = useMemo(() => ((3 - secondsLeft) / 3) * 100, [secondsLeft]);

  return (
    <div className="unauth-page">
      <div className="unauth-card" role="alert" aria-live="polite">
        <div className="unauth-icon-wrap" aria-hidden>
          <svg
            className="unauth-icon"
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z"
              fill="currentColor"
            />
          </svg>
        </div>

        <h1 className="unauth-title">
          <span className="unauth-code">403</span> No Autorizado
        </h1>
        <p className="unauth-subtitle">
          No tienes permisos para acceder a esta ruta. Probablemente el enlace
          requiere sesión activa.
        </p>

        <div className="unauth-progress" aria-label="Progreso de redirección">
          <div
            className="unauth-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="unauth-hint">
          Te redirigimos al inicio en {secondsLeft}s…
        </p>

        <div className="unauth-actions">
          <button
            className="unauth-btn"
            onClick={() => navigate("/")}
            autoFocus
          >
            Ir al inicio ahora
          </button>
        </div>

        <p className="unauth-footnote">
          Si crees que esto es un error, contacta al administrador.
        </p>
      </div>
    </div>
  );
}