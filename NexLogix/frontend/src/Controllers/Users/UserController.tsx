
import { useNavigate } from "react-router-dom";
import { LogoutUser } from "../../services/Auth/AuthService";
import { UserProfile } from "../../models/Interfaces/UserProfile";
import { axiosInstance } from "../../services/axiosConfig";



interface ResponseData<T> {
    success: boolean;
    Data: T;
    message?: string;
}

// GET PROFILE
export const UserProfileController = async (): Promise<{ data: ResponseData<UserProfile> }> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No autenticado');
  }

  try {
    console.log('Token en UserProfileController:', token);
    const response = await axiosInstance.get('/auth/mostrar_perfil_auth');
    console.log('Respuesta del servidor:', response.data);
    // Ajustar la respuesta para que coincida con ResponseData
    return {
      data: {
        success: true,
        Data: response.data.data, // Asumiendo que el backend devuelve { data: UserProfile }
      },
    };
  } catch (err) {
    console.error('Error en UserProfileController:', err);
    throw err;
  }
};


// LOGOUT 
export const useLogoutController = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await LogoutUser();
            navigate("/", { replace: true });
            return { success: true, message: 'Sesión cerrada correctamente' };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al cerrar sesión';
            return { success: false, message };
        }
    };

    return { handleLogout };
};