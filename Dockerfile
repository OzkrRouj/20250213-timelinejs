# Usar una imagen base de Nginx
FROM nginx:alpine

# Eliminar los archivos predeterminados de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos del proyecto al directorio de Nginx
COPY . /usr/share/nginx/html/

# Exponer el puerto 80 (puerto predeterminado de Nginx)
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]