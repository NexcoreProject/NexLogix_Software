# 🚀 Guía de Despliegue NexLogix en Hostinger

## 📋 Checklist Pre-Despliegue

Antes de subir archivos, asegúrate de:

- ✅ Base de datos creada en Hostinger (phpMyAdmin)
- ✅ Tablas importadas desde tu SQL local
- ✅ Usuario MySQL remoto configurado con IP permitida
- ✅ Archivos del proyecto actualizados localmente

---

## 🔧 Pasos para Desplegar

### **PASO 1: Preparar el Backend**

1. **Copia el archivo `.env.production` y renómbralo a `.env` en tu servidor**
   - Este archivo ya tiene las configuraciones correctas:
     - `APP_ENV=production`
     - `APP_DEBUG=false`
     - `APP_URL=https://hotpink-bison-608328.hostingersite.com`
     - Credenciales de base de datos de Hostinger

2. **Asegúrate de tener estos archivos en la raíz del backend:**
   - `.htaccess` (el nuevo que redirige a `public/`)
   - `.env` (renombrado desde `.env.production`)
   - Todos los archivos de Laravel (app, bootstrap, config, database, etc.)

### **PASO 2: Preparar el Frontend**

1. **Recompilar el frontend con configuración de producción:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Los archivos compilados estarán en `frontend/dist/`**
   - `index.html`
   - carpeta `assets/` (con JS, CSS, imágenes, etc.)

### **PASO 3: Estructura en Hostinger (public_html)**

Tu carpeta `public_html` en Hostinger debe verse así:

```
public_html/
├── .htaccess                    ← Redirige todo a public/
├── .env                         ← Configuración de producción
├── artisan
├── composer.json
├── app/
├── bootstrap/
├── config/
├── database/
├── routes/
├── storage/                     ← IMPORTANTE: Permisos 755
├── vendor/                      ← Si no existe, ejecutar composer install
└── public/                      ← Punto de entrada de Laravel
    ├── .htaccess               ← Ya existe, no tocar
    ├── index.php               ← Punto de entrada
    ├── robots.txt
    ├── index.html              ← Del dist del frontend
    └── assets/                 ← Del dist del frontend
        ├── index-D1nQ2JUG.js
        ├── index-CR_8uH2z.css
        ├── logo-BT7iBvLY.ico
        └── ...
```

### **PASO 4: Subir Archivos via FTP/File Manager**

#### **Opción A: File Manager de Hostinger (Recomendado)**

1. Ve a tu panel de Hostinger → Sitios Web → Administrador de Archivos
2. Entra a `public_html`
3. **BORRA TODO** el contenido actual (excepto `cgi-bin` si existe)

4. **Sube el backend completo:**
   - Sube todos los archivos y carpetas de `backend/` DIRECTAMENTE a `public_html/`
   - Asegúrate de subir `.htaccess` y `.env.production`
   - Renombra `.env.production` a `.env` en el servidor

5. **Sube el frontend compilado:**
   - Entra a la carpeta `public_html/public/`
   - Sube el archivo `dist/index.html`
   - Sube la carpeta `dist/assets/` completa

#### **Opción B: FTP (FileZilla, WinSCP, etc.)**

1. Conecta con las credenciales FTP de Hostinger:
   - **Host:** `ftp://82.25.83.92`
   - **Usuario:** `u603048993`
   - **Puerto:** 21

2. Repite el mismo proceso del File Manager

### **PASO 5: Configurar Permisos (MUY IMPORTANTE)**

Usando File Manager o FTP, cambia permisos:

```
storage/              → 755 (recursivo)
storage/logs/         → 755
storage/framework/    → 755
bootstrap/cache/      → 755
```

En File Manager:
- Click derecho en carpeta → Permisos → 755 → Aplicar recursivamente

### **PASO 6: Instalar Dependencias (Si no existe vendor/)**

1. Conéctate por SSH (disponible en tu plan de Hostinger)
2. Ejecuta:
   ```bash
   cd public_html
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Si no tienes acceso SSH**, sube la carpeta `vendor/` completa via FTP (tardará mucho)

### **PASO 7: Verificar Acceso Remoto a MySQL**

1. Ve a Hostinger → Bases de Datos → MySQL Remoto
2. Asegúrate de que tu IP (o `%` para cualquier IP) esté permitida
3. En las imágenes veo:
   - `2e0247802b1234-c5`
   - `82.197.82.197`
   - `%` (todas las IPs)

### **PASO 8: Limpiar Caché en Hostinger**

En tu panel de Hostinger:
1. Ve a tu sitio → Herramientas Avanzadas
2. Click en "Limpiar caché" (botón morado que aparece en tus imágenes)

---

## 🧪 Verificación Post-Despliegue

### **1. Verifica que Laravel funciona:**

Abre en navegador:
```
https://hotpink-bison-608328.hostingersite.com/api/auth/login
```

Deberías ver un error de método (405 Method Not Allowed) porque es POST, pero eso significa que Laravel está funcionando.

### **2. Verifica el frontend:**

Abre:
```
https://hotpink-bison-608328.hostingersite.com
```

Deberías ver tu página de login de NexLogix.

### **3. Prueba el login:**

1. Ingresa tus credenciales
2. Abre DevTools (F12) → Network
3. Verifica que las peticiones vayan a:
   ```
   https://hotpink-bison-608328.hostingersite.com/api/auth/login
   ```
   Y NO a `localhost:8000`

---

## 🚨 Solución de Problemas Comunes

### **Error 404 en /api/***
**Causa:** El `.htaccess` raíz no está funcionando o no existe.

**Solución:**
- Verifica que el archivo `.htaccess` esté en `public_html/` (raíz)
- Contenido:
  ```apache
  <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteRule ^(.*)$ public/$1 [L]
  </IfModule>
  ```

### **Error 500 Internal Server Error**
**Causa:** Permisos incorrectos o falta archivo `.env`.

**Solución:**
1. Verifica permisos de `storage/` y `bootstrap/cache/`
2. Verifica que `.env` exista en `public_html/`
3. Revisa logs en `storage/logs/laravel.log`

### **Frontend carga pero API no responde**
**Causa:** CORS o `.env` con APP_URL incorrecto.

**Solución:**
1. Verifica en `.env`:
   ```
   APP_URL=https://hotpink-bison-608328.hostingersite.com
   ```
2. Limpia caché de Laravel (si tienes SSH):
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

### **Error de conexión a base de datos**
**Causa:** Credenciales incorrectas o IP no permitida.

**Solución:**
1. Verifica credenciales en `.env`:
   ```
   DB_HOST=auth-db1957.hstgr.io
   DB_DATABASE=u603048993_logigov2
   DB_USERNAME=u603048993_root
   DB_PASSWORD=Hero!77777
   ```
2. Verifica en Hostinger → MySQL Remoto que tu IP esté permitida

### **CSS/JS no cargan (404)**
**Causa:** Rutas incorrectas en `index.html` del frontend.

**Solución:**
- Ya está corregido en `vite.config.ts` con `base: '/'`
- Recompila el frontend: `npm run build`

---

## 📝 Comandos Útiles (SSH)

Si tienes acceso SSH:

```bash
# Limpiar cachés
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimizar para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer dump-autoload --optimize

# Ver logs en tiempo real
tail -f storage/logs/laravel.log

# Verificar permisos
chmod -R 755 storage bootstrap/cache
```

---

## 🎯 Checklist Final

Antes de dar por terminado el despliegue:

- [ ] `.env` con configuración de producción (`APP_ENV=production`, `APP_DEBUG=false`)
- [ ] `.htaccess` en raíz redirigiendo a `public/`
- [ ] Frontend compilado en `public_html/public/`
- [ ] Permisos 755 en `storage/` y `bootstrap/cache/`
- [ ] Base de datos importada y accesible remotamente
- [ ] Caché limpiado en Hostinger
- [ ] Login funciona correctamente
- [ ] DevTools muestra peticiones a dominio de Hostinger (no localhost)

---

## 📞 Contacto y Soporte

Si sigues teniendo problemas después de seguir esta guía:

1. Revisa los logs de Laravel: `storage/logs/laravel.log`
2. Revisa la consola del navegador (F12 → Console)
3. Verifica el Network tab para ver qué peticiones fallan
4. Contacta al soporte de Hostinger si el problema es de servidor

---

**¡Buena suerte con el despliegue! 🚀**
