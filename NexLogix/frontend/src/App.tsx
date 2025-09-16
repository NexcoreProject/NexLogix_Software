import AppRouter from "./Routers/AppRouter"; // Importa el componente AppRouter que define las rutas de la aplicación
import { setAuthHeader } from './services/Auth/AuthService'; // Importa la función setAuthHeader para configurar el encabezado de autenticación
import { useEffect } from "react"; // Importa el hook useEffect de React para ejecutar efectos secundarios

// App: raíz de la SPA. Aquí sólo hacemos boot de cosas globales (auth header) y renderizamos el router.
function App() { 

    // Al montar: empuja el token (si existe) al header Authorization por defecto
    useEffect(() => { 
        // Llama a setAuthHeader para establecer el encabezado Authorization con el token (si existe) en las solicitudes HTTP
        setAuthHeader(); 
    }, []); // Arreglo de dependencias vacío asegura que el efecto se ejecute solo una vez al montar

    return (
        <div className="app-container">
            <AppRouter />
        </div>
    ); // Renderiza el componente AppRouter envuelto en un contenedor con fondo consistente
}

export default App; // Exporta App como componente predeterminado para ser usado en main.tsx