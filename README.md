# Sistema de Registro de Matrículas

Una aplicación web para registrar y administrar fotografías de matrículas vehiculares con capacidades de filtrado y búsqueda.

## Tecnologías Utilizadas

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express
- TypeScript
- SQLite (better-sqlite3)
- Multer (manejo de archivos)

## Estructura del Proyecto

```
plater/
├── client/                 # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Servicios API
│   │   ├── types/         # Definiciones TypeScript
│   │   └── App.tsx        # Componente principal
│   └── package.json
│
├── server/                # API Express
│   ├── src/
│   │   ├── controllers/  # Controladores
│   │   ├── routes/       # Rutas API
│   │   ├── database/     # Configuración BD
│   │   └── index.ts      # Punto de entrada
│   ├── uploads/          # Carpeta de imágenes
│   └── package.json
│
└── README.md
```

## Características

- Subir fotografías de matrículas
- Registrar información asociada (número de matrícula, fecha, descripción)
- Filtrar registros por:
  - Número de matrícula
  - Rango de fechas
- Vista previa de imágenes antes de subir
- Interfaz responsive con Tailwind CSS
- API RESTful con TypeScript

## Instalación

### Requisitos Previos

- Node.js 20.x o superior
- npm
- Docker y Docker Compose (para despliegue con Docker)

### Opción 1: Instalación Local

#### Backend

```bash
cd server
npm install
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

#### Frontend

```bash
cd client
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Opción 2: Despliegue con Docker

#### Requisitos

- Docker
- Docker Compose

#### Comando para iniciar

```bash
docker-compose up --build
```

Esto iniciará automáticamente:

- **Frontend** en `http://localhost:2288`
- **Backend** en `http://localhost:22883`

#### Comandos útiles

```bash
# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reconstruir imágenes
docker-compose build --no-cache

# Ejecutar con modo detached
docker-compose up -d
```

#### Volúmenes

Las imágenes subidas se persisten en `./server/uploads/` en tu máquina local.

## API Endpoints

### POST /api/plates

Crear una nueva matrícula

**Body (FormData):**

- `image`: archivo de imagen (requerido)
- `plate_number`: string (requerido)
- `date`: string en formato YYYY-MM-DD (requerido)
- `description`: string (opcional)

**Response:** Objeto Plate creado

### GET /api/plates

Obtener lista de matrículas

**Query Parameters:**

- `plate_number`: filtrar por matrícula (búsqueda parcial)
- `date_from`: fecha mínima
- `date_to`: fecha máxima

**Response:** Array de objetos Plate

### GET /api/plates/:id

Obtener una matrícula por ID

**Response:** Objeto Plate

## Esquema de Base de Datos

### Tabla: plates

| Campo        | Tipo     | Descripción           |
| ------------ | -------- | --------------------- |
| id           | INTEGER  | Primary key           |
| plate_number | TEXT     | Número de matrícula   |
| image_path   | TEXT     | Ruta de la imagen     |
| date         | TEXT     | Fecha del registro    |
| description  | TEXT     | Descripción opcional  |
| created_at   | DATETIME | Timestamp de creación |

## Scripts Disponibles

### Backend

- `npm run dev` - Ejecutar en modo desarrollo con hot-reload
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Ejecutar versión compilada

### Frontend

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Compilar para producción
- `npm run preview` - Vista previa de build de producción

## Almacenamiento de Datos

### Base de Datos

- **Ubicación**: `server/data/plater.db`
- **Tipo**: SQLite
- **Persistencia**: Almacenada en volumen separado en Docker
- Se crea automáticamente en la primera ejecución

### Imágenes

- **Ubicación**: `server/uploads/`
- **Nombrado**: `{timestamp}-{random}.{extension}`
- **Persistencia**: Almacenadas en volumen separado en Docker
- Límite de tamaño: 5MB por imagen

### En Docker

Los volúmenes están mapeados así:

```yaml
volumes:
  - ./server/uploads:/app/uploads # Imágenes
  - ./server/data:/app/data # Base de datos
```

Esto significa que los datos persisten en tu servidor incluso si eliminas los contenedores:

```bash
# Los datos se conservan en estas carpetas
server/uploads/      # Todas las imágenes
server/data/         # Archivo plater.db
```

## Estructura Docker

```
Dockerfile (server) - Backend compilado con Node.js
Dockerfile (client) - Frontend compilado con Nginx
docker-compose.yml  - Orquestación de servicios
nginx.conf          - Configuración de Nginx para proxy inverso
```

### Características Docker

- **Multi-stage builds** para optimizar el tamaño de las imágenes
- **Health checks** para verificar que los servicios estén funcionando
- **Volúmenes persistentes** para almacenamiento de imágenes
- **Proxy inverso** con Nginx para servir frontend y API desde un puerto único
- **Isolamiento de servicios** con networking automático

## Próximas Mejoras

- Paginación de resultados
- Edición y eliminación de registros
- Exportación de datos (CSV, Excel)
- Búsqueda por descripción
- Tags/categorías personalizadas
- Autenticación de usuarios
- Certificados SSL/TLS
- Dashboard de estadísticas

## Licencia

ISC
