# Use the official PHP 7.4 Apache image as the base image
FROM php:7.4-apache

# Install dependencies for the zip extension and GD library
RUN apt-get update && apt-get install -y \
    zlib1g-dev \
    libzip-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd mysqli pdo_mysql zip \
    && a2enmod rewrite \
    && echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && rm -rf /var/lib/apt/lists/*

# Copy project files to the working directory
COPY . /var/www/html

# Create 'upload' directory and set proper permissions
RUN mkdir -p /var/www/html/upload && chown -R www-data:www-data /var/www/html/upload

# Change ownership of files and directories
RUN chown -R www-data:www-data /var/www/html

# Expose port 80 to the outside world
EXPOSE 80
