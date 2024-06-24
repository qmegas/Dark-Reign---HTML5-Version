# Set the base image
FROM php:8.2-apache
 
# Environment Variables
ENV APP_ENV=production
ENV APP_DEBUG=false
 
# Install common PHP extensions
RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install opcache
 
# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
 
# Copy Laravel project files to /var/www/html
COPY . /var/www/html
 
# Set permissions
RUN chown -R www-data:www-data /var/www/html
 
# Expose port 80
EXPOSE 80
 
# Start Apache
CMD ["apache2-foreground"]