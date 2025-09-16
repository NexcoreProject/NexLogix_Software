import { StrictMode } from 'react'; // Importa StrictMode de React para habilitar verificaciones adicionales en desarrollo
import { createRoot } from 'react-dom/client'; // Importa createRoot de React DOM para renderizar la aplicación en el DOM
import App from './App.tsx'; // Importa el componente raíz App, que contiene la estructura principal de la aplicación
import './styles/global.css'; // Importa estilos globales ANTES que Bootstrap para establecer el fondo correcto
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos CSS de Bootstrap para diseño responsivo y componentes predefinidos
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa el JavaScript de Bootstrap (incluye Popper.js) para funcionalidades interactivas como menús colapsables y modales
import 'bootstrap-icons/font/bootstrap-icons.css'; // En main.tsx
import './services/axiosConfig.ts'; // Importa la configuración de Axios para realizar solicitudes HTTP a la API

createRoot(document.getElementById('root')!).render( // Crea un punto de entrada en el DOM y renderiza la aplicación
  <>
    {/* Envuelve la aplicación en StrictMode para detectar problemas potenciales en desarrollo */}
    <StrictMode> 

        {/* Renderiza el componente App, que contiene la lógica de enrutamiento y la estructura de la SPA */}
        <App/> 
        
    </StrictMode> {/*aki ubo un error :(  "la coma"*/}
  </>
);