# Imagen base PHP con Apache
FROM php:8.4-apache
# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    curl \
    && docker-php-ext-install pdo pdo_mysql zip

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Activar mod_rewrite de Apache (Laravel lo necesita)
RUN a2enmod rewrite

# Directorio de la aplicación
WORKDIR /var/www/html

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias PHP
RUN composer install --no-dev --optimize-autoloader

# Permisos necesarios para Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Apache usará la carpeta public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# Ajustar configuración de Apache
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
/etc/apache2/sites-available/*.conf

EXPOSE 80