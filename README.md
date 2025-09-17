<div align="center">
  <img src="https://raw.githubusercontent.com/NexLogix/NexLogix_Software/master/NexLogix/frontend/src/assets/logo.png" alt="NexLogix Logo" width="280" height="280" />
</div>

<h1 align="center">
  <a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=500&size=42&duration=3000&pause=1000&color=035094&center=true&vCenter=true&width=700&lines=NexLogix+Software;Sistema+Log%C3%ADstico+Avanzado;Tecnolog%C3%ADa+de+Vanguardia" alt="Typing SVG" /></a>
</h1>

<div align="center">
  <img src="https://img.shields.io/badge/Status-En%20Desarrollo-brightgreen?style=for-the-badge&logo=github" alt="Status">
  <img src="https://img.shields.io/badge/Versión-2.0.0-blue?style=for-the-badge&logo=semver" alt="Version">
  <img src="https://img.shields.io/badge/Licencia-Privada-red?style=for-the-badge&logo=lock" alt="License">
</div>

<div align="center">
  <h3>Sistema Integral de Gestión Logística</h3>
  <p><strong>Optimizando operaciones de transporte y distribución con tecnología de vanguardia</strong></p>
</div>

---

## Stack Tecnológico

<div align="center">

### **Backend Development**
<a href="https://laravel.com" target="_blank">
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
</a>
<a href="https://www.php.net" target="_blank">
  <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
</a>
<a href="https://jwt.io" target="_blank">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
</a>
<a href="https://swagger.io" target="_blank">
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger">
</a>

### **Frontend Development**
<a href="https://reactjs.org" target="_blank">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
</a>
<a href="https://www.typescriptlang.org" target="_blank">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
</a>
<a href="https://vitejs.dev" target="_blank">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
</a>
<a href="https://reactrouter.com" target="_blank">
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router">
</a>

### **Database & Storage**
<a href="https://www.mysql.com" target="_blank">
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</a>
<a href="https://laravel.com/docs/eloquent" target="_blank">
  <img src="https://img.shields.io/badge/Eloquent_ORM-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Eloquent">
</a>

### **Testing & Quality**
<a href="https://phpunit.de" target="_blank">
  <img src="https://img.shields.io/badge/PHPUnit-366488?style=for-the-badge&logo=php&logoColor=white" alt="PHPUnit">
</a>
<a href="https://eslint.org" target="_blank">
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint">
</a>

</div>

---

## Descripción del Proyecto

<table>
<tr>
<td width="60%">

**NexLogix** es una plataforma empresarial de nueva generación diseñada para revolucionar la gestión logística mediante la automatización inteligente y optimización de procesos de transporte, distribución y seguimiento de envíos en tiempo real.

**Desarrollado con arquitectura moderna Full-Stack**, combina la robustez de **Laravel** en el backend con la reactividad de **React + TypeScript** en el frontend, ofreciendo control total sobre operaciones logísticas complejas con interfaces intuitivas y APIs RESTful escalables.

</td>
<td width="40%">
<div align="left">

### **Características Principales**
- **Sistema JWT** para autenticación
- **Gestión de flota** completa
- **Rutas optimizadas** automáticas
- **Seguimiento** en tiempo real
- **Reportes avanzados** con analytics
- **Auditoría completa** del sistema

</div>
</td>
</tr>
</table>

---

## Módulos del Sistema

<div align="center">
<table>
<tr>
<td align="center" width="25%">
<h3><strong>Autenticación</strong></h3>
<p>Sistema JWT avanzado con roles granulares y middleware de seguridad</p>
</td>
<td align="center" width="25%">
<h3><strong>Gestión de Flota</strong></h3>
<p>Control completo de vehículos, conductores y asignaciones inteligentes</p>
</td>
<td align="center" width="25%">
<h3><strong>Rutas Optimizadas</strong></h3>
<p>Planificación estratégica y distribución geográfica eficiente</p>
</td>
<td align="center" width="25%">
<h3><strong>Gestión de Envíos</strong></h3>
<p>Seguimiento completo desde recogida hasta entrega final</p>
</td>
</tr>
</table>
</div>

---

## Sistema de Autenticación Enterprise

<table>
<tr>
<td width="50%">

### **Características Avanzadas**
- **Autenticación JWT** con tokens de acceso y refresh automático
- **Control de roles granular**: Manager, Empleado, Conductor
- **Permisos específicos** por funcionalidad y recurso
- **Middleware personalizado** para protección de rutas
- **Sesiones seguras** con encriptación de nivel empresarial
- **Logs de acceso** y auditoría de seguridad completa

</td>
<td width="50%">

### **Arquitectura de Seguridad**
```php
// Middleware de roles
Route::middleware(['auth:api', 'role:2,3'])
    ->group(function () {
        // Rutas protegidas
    });

// JWT Configuration
'ttl' => env('JWT_TTL', 60),
'refresh_ttl' => env('JWT_REFRESH_TTL', 20160),
```

</td>
</tr>
</table>

---

## Gestión de Flota Inteligente

<table>
<tr>
<td align="left" width="33%">
<h3><strong>Administración de Vehículos</strong></h3>
<ul>
<li>Registro completo: marca, modelo, placa</li>
<li>Control de capacidad y especificaciones</li>
<li>Historial de mantenimiento detallado</li>
<li>Estados: Disponible, En Ruta, Mantenimiento</li>
<li>Monitoreo en tiempo real</li>
</ul>
</td>
<td align="left" width="33%">
<h3><strong>Gestión de Conductores</strong></h3>
<ul>
<li>Registro de licencias y categorías</li>
<li>Validación automática de vigencia</li>
<li>Asignación inteligente conductor-vehículo</li>
<li>Control de estados y disponibilidad</li>
<li>Evaluación de desempeño</li>
</ul>
</td>
<td align="left" width="33%">
<h3><strong>Asignaciones Automáticas</strong></h3>
<ul>
<li>Algoritmos de optimización</li>
<li>Matching por capacidad y tipo</li>
<li>Disponibilidad en tiempo real</li>
<li>Histórico de asignaciones</li>
<li>Reportes de eficiencia</li>
</ul>
</td>
</tr>
</table>

---

## Optimización de Rutas y Distribución

### **Planificación Estratégica de Rutas**

<table>
<tr>
<td width="60%">

**Funcionalidades Avanzadas:**
- **Creación dinámica de rutas** con algoritmos de optimización
- **Asignación automática** de vehículos por capacidad y tipo
- **Control de horarios** y tiempos estimados de entrega
- **Distribución geográfica** inteligente por ciudades y áreas
- **Optimización de cobertura territorial** con análisis de densidad
- **Métricas de eficiencia** por zona y conductor

</td>
<td width="40%">

```typescript
interface Ruta {
  idRuta: number;
  nombreRuta: string;
  horaInicioRuta: string;
  horaFinalizacionRuta: string;
  descripcion: string;
  estadoRuta: 'Activa' | 'Inactiva';
  novedades: string;
  fechaCreacionRuta: Date;
}
```

</td>
</tr>
</table>

---

## Gestión Integral de Envíos

<table>
<tr>
<td align="center" width="25%">
<h4><strong>Registro de Envíos</strong></h4>
<ul>
<li>Datos completos remitente/destinatario</li>
<li>Múltiples métodos de pago</li>
<li>Cálculo automático de costos</li>
<li>Categorización inteligente</li>
</ul>
</td>
<td align="center" width="25%">
<h4><strong>Gestión de Recogidas</strong></h4>
<ul>
<li>Programación automática</li>
<li>Rutas optimizadas</li>
<li>Confirmación en tiempo real</li>
<li>Tracking de estado</li>
</ul>
</td>
<td align="center" width="25%">
<h4><strong>Control de Entregas</strong></h4>
<ul>
<li>Confirmación de entrega</li>
<li>Evidencia fotográfica</li>
<li>Firmas digitales</li>
<li>Notificaciones automáticas</li>
</ul>
</td>
<td align="center" width="25%">
<h4><strong>Seguimiento 24/7</strong></h4>
<ul>
<li>Estados en tiempo real</li>
<li>Historial completo</li>
<li>Alertas automáticas</li>
<li>Dashboard interactivo</li>
</ul>
</td>
</tr>
</table>

---

## Sistema de Analytics y Reportes

<div align="center">
<table>
<tr>
<td align="center">
<h3><strong>Dashboard Ejecutivo</strong></h3>
<ul>
<li>KPIs en tiempo real</li>
<li>Métricas de rendimiento</li>
<li>Gráficos interactivos</li>
<li>Alertas inteligentes</li>
</ul>
</td>
<td align="center">
<h3><strong>Reportes Categorizados</strong></h3>
<ul>
<li>Reportes operacionales</li>
<li>Análisis financiero</li>
<li>Rendimiento de flota</li>
<li>Satisfacción del cliente</li>
</ul>
</td>
<td align="center">
<h3><strong>Exportación de Datos</strong></h3>
<ul>
<li>Formatos múltiples (PDF, Excel, CSV)</li>
<li>Reportes programados</li>
<li>Distribución automática</li>
<li>API de integración</li>
</ul>
</td>
</tr>
</table>
</div>

---

## Auditoría y Trazabilidad

### **Sistema Completo de Auditoría**

<table>
<tr>
<td width="50%">

**Características de Auditoría:**
- **Registro automático** de todas las operaciones del sistema
- **Trazabilidad completa** de cambios con timestamps
- **Logs detallados** por usuario, IP y acción realizada
- **Integridad de datos** con hash de verificación
- **Retención configurable** de logs según políticas
- **Alertas de seguridad** para actividades sospechosas

</td>
<td width="50%">

```php
class AuditLog extends Model {
    protected $fillable = [
        'user_id', 'action', 'table_name',
        'record_id', 'old_values', 'new_values',
        'ip_address', 'user_agent', 'timestamp'
    ];
    
    protected $casts = [
        'old_values' => 'json',
        'new_values' => 'json'
    ];
}
```

</td>
</tr>
</table>

---

## Arquitectura del Sistema

### **Stack Tecnológico Detallado**

<table>
<tr>
<td width="50%">

#### **Backend (API REST)**
- **Framework:** Laravel 10+ con PHP 8.2+
- **Base de datos:** MySQL 8.0 con Eloquent ORM
- **Autenticación:** JWT con tymon/jwt-auth
- **Documentación:** Swagger/OpenAPI 3.0
- **Testing:** PHPUnit con cobertura >90%
- **Queue:** Redis para trabajos en segundo plano
- **Cache:** Redis para optimización de rendimiento

</td>
<td width="50%">

#### **Frontend (SPA)**
- **Framework:** React 18+ con TypeScript 5+
- **Build tool:** Vite 4+ para desarrollo y producción
- **Routing:** React Router v6 con lazy loading
- **State:** Context API + useReducer patterns
- **Styling:** CSS Modules + Responsive Design
- **HTTP Client:** Axios con interceptors
- **Testing:** Jest + React Testing Library

</td>
</tr>
</table>

---

## Roles y Permisos del Sistema

<div align="center">
<table>
<tr>
<td align="center" width="33%">
<h3><strong>Manager</strong></h3>
<p><strong>Control Total del Sistema</strong></p>
<ul>
<li>Dashboard ejecutivo completo</li>
<li>Gestión de usuarios y roles</li>
<li>Configuración del sistema</li>
<li>Reportes estratégicos</li>
<li>Auditoría y compliance</li>
<li>Administración de flota</li>
</ul>
</td>
<td align="center" width="33%">
<h3><strong>Empleado</strong></h3>
<p><strong>Operaciones Diarias</strong></p>
<ul>
<li>Gestión de envíos y rutas</li>
<li>Consulta de información</li>
<li>Reportes operacionales</li>
<li>Seguimiento de entregas</li>
<li>Coordinación logística</li>
<li>Atención al cliente</li>
</ul>
</td>
<td align="center" width="33%">
<h3><strong>Conductor</strong></h3>
<p><strong>Operaciones de Campo</strong></p>
<ul>
<li>Consulta de rutas asignadas</li>
<li>Información de vehículos</li>
<li>Estados de entregas</li>
<li>Comunicación con central</li>
<li>Confirmación de recogidas</li>
<li>Reportes de campo</li>
</ul>
</td>
</tr>
</table>
</div>

---

## Características Técnicas Avanzadas

<div align="center">
<table>
<tr>
<td align="center" width="20%">
<h4><strong>Integración Total</strong></h4>
<p>API RESTful con endpoints especializados y documentación Swagger completa</p>
</td>
<td align="center" width="20%">
<h4><strong>Responsive Design</strong></h4>
<p>Interfaz adaptativa optimizada para desktop, tablet y móvil</p>
</td>
<td align="center" width="20%">
<h4><strong>Alto Rendimiento</strong></h4>
<p>Lazy loading, caching inteligente y optimización de consultas</p>
</td>
<td align="center" width="20%">
<h4><strong>Seguridad Enterprise</strong></h4>
<p>Encriptación, validación robusta y protección CSRF</p>
</td>
<td align="center" width="20%">
<h4><strong>Escalabilidad</strong></h4>
<p>Arquitectura modular preparada para crecimiento empresarial</p>
</td>
</tr>
</table>
</div>

### **Patrones de Desarrollo y Best Practices**

<table>
<tr>
<td width="50%">

**Backend Architecture:**
```php
// Repository Pattern
interface EnvioRepositoryInterface {
    public function create(array $data): Envio;
    public function findById(int $id): ?Envio;
    public function updateStatus(int $id, string $status): bool;
}

// Service Layer
class EnvioService {
    public function __construct(
        private EnvioRepositoryInterface $repository,
        private NotificationService $notificationService
    ) {}
}
```

</td>
<td width="50%">

**Frontend Architecture:**
```typescript
// Custom Hooks
const useEnvios = () => {
    const [envios, setEnvios] = useState<Envio[]>([]);
    const [loading, setLoading] = useState(false);
    
    const fetchEnvios = useCallback(async () => {
        setLoading(true);
        const data = await envioService.getAll();
        setEnvios(data);
        setLoading(false);
    }, []);
    
    return { envios, loading, fetchEnvios };
};
```

</td>
</tr>
</table>

---

## Información Técnica Adicional

<div align="center">
<table>
<tr>
<td align="center" width="50%">
<h3><strong>API Endpoints Principales</strong></h3>

| Módulo | Endpoints | Autenticación |
|--------|-----------|---------------|
| **Autenticación** | `/api/auth/*` | JWT |
| **Usuarios** | `/api/gestion_usuarios/*` | JWT + Roles |
| **Vehículos** | `/api/gestion_vehiculos/*` | JWT + Roles |
| **Rutas** | `/api/gestion_rutas/*` | JWT + Roles |
| **Envíos** | `/api/gestion_envios/*` | JWT + Roles |
| **Reportes** | `/api/gestion_reportes/*` | JWT + Roles |
| **Auditoría** | `/api/gestion_auditorias/*` | JWT + Admin |

</td>
<td align="center" width="50%">
<h3><strong>Estructura de Base de Datos</strong></h3>

| Tabla Principal | Relaciones | Índices |
|----------------|------------|---------|
| **usuarios** | roles, conductores | email, activo |
| **vehiculos** | conductores, rutas | placa, estado |
| **rutas** | vehiculos, ciudades | nombre, estado |
| **envios** | recogidas, entregas | fecha, estado |
| **audit_logs** | usuarios | timestamp, tabla |
| **reportes** | categorias, users | fecha, tipo |

</td>
</tr>
</table>
</div>

---

<div align="center">

<table>
<tr>
<td align="center">
<h3><strong>Innovación Tecnológica</strong></h3>
<p>Desarrollado con tecnología de vanguardia</p>
</td>
<td align="center">
<h3><strong>Solución Empresarial</strong></h3>
<p>Diseñado para operaciones de alto volumen</p>
</td>
<td align="center">
<h3><strong>Excelencia Operacional</strong></h3>
<p>Optimización continua de procesos logísticos</p>
</td>
</tr>
</table>

<p><strong>Sistema integral diseñado para empresas que buscan transformar sus operaciones logísticas</strong></p>
<p><em>Combinando inteligencia artificial, análisis de datos y experiencia de usuario excepcional</em></p>

**NexLogix Software - Transformando la logística del futuro**

</div>
