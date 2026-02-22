# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src ./src
COPY tsconfig.json ./

# Compilar TypeScript
RUN npm run build

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar archivos compilados desde la etapa de build
COPY --from=builder /app/dist ./dist

# Crear carpeta de uploads
RUN mkdir -p uploads

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/index.js"]
