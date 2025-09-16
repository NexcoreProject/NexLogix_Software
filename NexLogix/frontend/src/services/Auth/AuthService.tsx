import axios, { AxiosResponse } from 'axios';
import { useState, useEffect } from "react";
import { UserProfile } from '../../models/Interfaces/UserProfile';
const API_URL = 'http://localhost:8000/api/auth';

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    idRole: number;
    idestado: number;
    idPuestos: number;
  };
  status: number;
}

// Estructura de error estandarizada desde el backend
interface BackendErrorData {
  success?: boolean;
  message?: string;
  status?: number;
  errors?: Record<string, string[] | string>;
}

const getRoleName = (idRole: number): string => {
  switch (idRole) {
    case 1:
      return "Soporte Tecnico";
    case 2:
      return "Manager";
    case 3:
      return "Empleado";
    case 13:
      return "Conductor";
    default:
      console.warn("[AuthLoginService] idRole desconocido:", idRole);
      return "Unknown";
  }
};

export const AuthLoginService = async (
  email: string,
  contrasena: string
): Promise<LoginResponse | null> => {
  try {
    console.log("[AuthLoginService] Enviando solicitud de login:", { email });
    const response: AxiosResponse<LoginResponse> = await axios.post(
      `${API_URL}/login`,
      {
        email,
        contrasena,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    console.log("[AuthLoginService] Respuesta completa del backend:", response.data);

    // Si el backend responde con success=false, propagar el mensaje con código en lugar de continuar
    if (!response.data?.success) {
      const code = response.data?.status ?? 'ERROR';
      const msg = response.data?.message || 'Inicio de sesión no válido.';
      throw new Error(`Error ${code}: ${msg}`);
    }

    const { token, user } = response.data;
    console.log("[AuthLoginService] Usuario recibido:", user);
    console.log("[AuthLoginService] idRole recibido:", user.idRole);

    const roleName = getRoleName(user.idRole);
    console.log("[AuthLoginService] Rol mapeado:", roleName);

    if (!token) {
      throw new Error('El servidor no envió un token de autenticación.');
    }
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", roleName);
    localStorage.setItem("user", JSON.stringify(user));
    console.log("[AuthLoginService] Datos guardados en localStorage:", {
      token: token.slice(0, 10) + "...",
      userRole: roleName,
      user,
    });

    return response.data;
  } catch (error: unknown) {
    // Log inicial
    console.error("[AuthLoginService] Error en login:", error);

    // Si es un error HTTP desde axios, intentamos extraer el mensaje del backend
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = (error.response?.data ?? {}) as BackendErrorData;

      // Construimos un mensaje amigable basado en la respuesta del backend
      let backendMsg = data.message;

      // Si vienen errores de validación, los concatenamos
      if (data.errors && typeof data.errors === 'object') {
        const detalles = Object.entries(data.errors)
          .flatMap(([campo, msgs]) => {
            const textos = Array.isArray(msgs) ? msgs : [msgs];
            return textos.map((t) => `${campo}: ${t}`);
          })
          .join(' | ');
        backendMsg = backendMsg ? `${backendMsg}: ${detalles}` : detalles;
      }

      // Mensajes por estado común
      if (!backendMsg) {
        switch (status) {
          case 400:
            backendMsg = 'Solicitud inválida.';
            break;
          case 401:
            backendMsg = 'No autorizado. Verifica tus credenciales.';
            break;
          case 403:
            backendMsg = 'Acceso prohibido.';
            break;
          case 404:
            backendMsg = 'Recurso no encontrado.';
            break;
          case 405:
            backendMsg = 'Contraseña inválida.';
            break;
          case 422:
            backendMsg = 'Errores de validación.';
            break;
          case 500:
            backendMsg = 'Error interno del servidor.';
            break;
          default:
            backendMsg = 'Ocurrió un error al iniciar sesión.';
        }
      }

      // Anteponer código al mensaje para mostrarlo en el banner
      const codeTxt = status ?? 'ERROR';
      throw new Error(`Error ${codeTxt}: ${backendMsg}`);
    }

    // Si no hay respuesta (problema de red / servidor caído)
    throw new Error('Error CONEXION: No se pudo conectar con el servidor. Asegúrate de que el backend esté ejecutándose.');
  }
};


// ————————————————————————
// 2) Manejo del header Authorization
// ————————————————————————
export const setAuthHeader = () => {
    const token = getToken();
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  
// ————————————————————————
// 3) Getters / Setters
// ————————————————————————
    export const setToken = (token: string) => {
        localStorage.setItem("token", token);
    };
  
    export const getToken = (): string | null => {
        return localStorage.getItem("token");
    };
  
    export const setUserRole = (role: string) => {
        localStorage.setItem("userRole", role);
    };
  
    export const getUserRole = (): string | null => {
        return localStorage.getItem("userRole");
    };

// ————————————————————————
// 4) Hook de autenticación
  //  esta parte es importante porque es la que usa Private Router
// ————————————————————————

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setTokenState] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const checkAuth = () => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole");
    console.log("[useAuth] Verificando auth - Token:", storedToken ? "presente" : "ausente");
    console.log("[useAuth] Verificando auth - Rol:", storedRole);

    if (storedToken && storedRole) {
      setTokenState(storedToken);
      setRole(storedRole);
      setIsAuthenticated(true);
      console.log("[useAuth] Autenticación establecida: true");
    } else {
      console.log("[useAuth] No hay token o rol en localStorage");
      setIsAuthenticated(false);
      setTokenState(null);
      setRole(null);
    }
  };

  useEffect(() => {
    checkAuth();

    // Escuchar cambios en localStorage
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return { token, role, isAuthenticated, checkAuth };
};

// ————————————————————————
// 5) SHOW PROFILE 
// ————————————————————————

export const getUserProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No autenticado');
  }

  try {
    console.log('Token encontrado:', token); // Verificar que el token está presente

    const response: AxiosResponse = await axios.get(`${API_URL}/mostrar_perfil_auth`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Respuesta del backend:', response);

    if (response.data && response.data.data) {
      console.log('Perfil del usuario:', response.data.data);
      return response.data.data as UserProfile;
    } else {
      throw new Error('Respuesta inesperada del backend');
    }
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    throw new Error('Error al obtener el perfil');
  }
};


// ————————————————————————
// 6) Logout 
// ————————————————————————
export const LogoutUser = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
      throw new Error('No hay sesión activa');
  }
  try {
      await axios.post(`${API_URL}/logout`, {}, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
  } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw new Error('Error al cerrar sesión');
  }
};