# 使用PHP官方镜像作为基础镜像
FROM php:7.4-apache

# 安装必要的PHP扩展
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd mysqli pdo_mysql zip

# 启用Apache的rewrite模块
RUN a2enmod rewrite

# 设置Apache虚拟主机配置
RUN echo "<VirtualHost *:7890> \
    DocumentRoot /var/www/html \
    ServerName localhost \
    <Directory /var/www/html> \
        Options Indexes FollowSymLinks \
        AllowOverride All \
        Require all granted \
    </Directory> \
    ErrorLog ${APACHE_LOG_DIR}/error.log \
    CustomLog ${APACHE_LOG_DIR}/access.log combined \
</VirtualHost>" > /etc/apache2/sites-available/000-default.conf

# 将项目文件复制到工作目录
COPY . /var/www/html


# 创建upload文件夹并设置正确的权限
RUN mkdir -p /var/www/html/upload && chown -R www-data:www-data /var/www/html/upload

# 更改文件和文件夹的权限
RUN chown -R www-data:www-data /var/www/html

# 暴露端口
EXPOSE 7890
USER 10001
CMD ["apache2-foreground"]
