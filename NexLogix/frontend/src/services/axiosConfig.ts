import axios from "axios";
import { NavigateFunction } from 'react-router-dom';

/**
 * Núcleo HTTP de la app (frontend)
 *
 * - Crea una instancia de Axios con baseURL y headers por defecto
 * - Inyecta el token (Bearer) en cada request si existe en localStorage
 * - Intercepta 401 para limpiar sesión y redirigir a /unauthorized
 * - Expone setNavigate para poder redirigir desde los interceptores
 *
 * Si tocas algo aquí, afectas TODAS las llamadas HTTP de la app.
 * Úsalo para: timeouts, baseURL, headers comunes, y manejo global de errores.
 */

// Crear instancia de axios con configuración base
// Configuración del entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000 // 10 segundos
});

let navigate: NavigateFunction | null = null;

// Guardamos navigate para poder redirigir desde interceptores (contexto fuera de componentes)
export const setNavigate = (nav: NavigateFunction) => {
    navigate = nav;
};

// Interceptor para agregar el token a cada request
// Inyecta Authorization si hay token en localStorage
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Manejo global de respuestas/errores
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            
            // Preferimos navigate (SPA) y caemos a window.location si aún no lo tenemos
            if (navigate) {
                navigate("/unauthorized");
            } else {
                window.location.href = "/unauthorized";
            }
        }
        return Promise.reject(error);
    }
);