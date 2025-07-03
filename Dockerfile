FROM node:22 AS angular_builder

ARG BUILD_ENV


WORKDIR /var/www/html/app

COPY . .

RUN npm install -g @angular/cli

RUN apt-get update && apt-get install -y \
    sudo \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libzip-dev \
    libcurl4-openssl-dev \
    zip \
    unzip \
    default-mysql-client

RUN npm install

ENV NODE_ENV=$BUILD_ENV
# # Builder l'app Angular en prod
RUN npx ng build --configuration=$BUILD_ENV

# Étape 2 : NGINX pour servir les fichiers Angular compilés
FROM nginx:alpine AS nginx_runner

# Copie le build Angular depuis le builder
COPY --from=angular_builder /var/www/html/app/dist/apps/browser /usr/share/nginx/html

COPY /docker/nginx/default.conf /etc/nginx/conf.d/default.conf


# Exposer le port 80
EXPOSE  80

CMD ["nginx", "-g", "daemon off;"]

