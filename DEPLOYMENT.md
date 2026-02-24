# 🚀 Guía de Despliegue - Plater

## 📑 Tabla de Contenidos
1. [Quick Start](#quick-start)
2. [Configuración Inicial](#configuración-inicial)
3. [Despliegue Manual](#despliegue-manual)
4. [Despliegue Automático](#despliegue-automático)
5. [Comandos Útiles](#comandos-útiles)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

**Tiempo estimado: 15 minutos**

### 1. Configurar GitHub Secrets
Ve a tu repositorio → Settings → Secrets and variables → Actions
- Crea un secreto llamado `SSH_PRIVATE_KEY`
- Valor: contenido completo de tu clave privada SSH (`~/.ssh/id_rsa`)

### 2. Preparar el Servidor
Conéctate por SSH y crea la carpeta de despliegue:
```bash
ssh deployer@ssh.nicolaspereira.me
mkdir -p /home/deployer/plater
cd /home/deployer/plater
git init
git remote add origin https://github.com/tu-usuario/plater.git
git fetch origin main
git checkout main
mkdir -p server/uploads server/data
chmod -R 755 server/uploads server/data
```

### 3. Primer Deploy Manual
```bash
cd /home/deployer/plater
docker compose up --build -d
docker compose ps
```

### 4. Verificar
- Frontend: `http://ssh.nicolaspereira.me:2288`
- Backend: `http://ssh.nicolaspereira.me:22883`

### 5. Configurar Despliegue Automático
Desde tu máquina local, haz un push a `main`:
```bash
git push origin main
```
GitHub Actions se ejecutará automáticamente. Ve a la pestaña Actions de tu repositorio para monitorear.

---

## Configuración Inicial

### Requisitos Previos
- Repositorio en GitHub
- Servidor con Docker y Docker Compose
- Acceso SSH con Cloudflare Tunnel
- Usuario `deployer` en el servidor

### Variables de Entorno

**En GitHub Secrets:**
| Variable | Descripción |
|----------|-------------|
| `SSH_PRIVATE_KEY` | Clave privada SSH completa |

**En el servidor (.env):**
Crea un archivo `.env` en `/home/deployer/plater/` si es necesario (opcional - el proyecto tiene `.env.example`)

### Estructura de Carpetas en el Servidor

```
/home/deployer/plater/
├── server/
│   ├── data/          ← SQLite database persiste aquí
│   └── uploads/       ← Imágenes subidas
├── client/
├── docker-compose.yml
└── .git/
```

---

## Despliegue Manual

Usa despliegue manual para:
- Cambios urgentes
- Debugging
- Primer setup

### Pasos

1. Conéctate al servidor por SSH
2. Navega a `/home/deployer/plater`
3. Sincroniza el código (si es necesario):
   ```bash
   git fetch origin main
   git checkout main
   ```
4. Reconstruye e inicia los contenedores:
   ```bash
   docker compose down
   docker compose up --build -d
   ```
5. Verifica:
   ```bash
   docker compose ps
   docker compose logs --tail=30
   ```

---

## Despliegue Automático

### Cómo Funciona

El workflow en `.github/workflows/deploy.yml` se ejecuta automáticamente cuando haces push a la rama `main`.

**Pasos del workflow:**
1. Checkout del código en el runner
2. Instalación/caché de cloudflared
3. Setup SSH con Cloudflare Tunnel
4. Sincronización de archivos con rsync (respeta `.gitignore`)
5. Ejecución de `docker compose down/up --build -d` en el servidor
6. Notificación de éxito o fallo

**Tiempo total:** 5-15 minutos (primeros deploys son más lentos por build de imágenes)

### Flujo Completo

```
┌─ git push origin main
├─ GitHub Actions inicia
├─ rsync sincroniza archivos
├─ docker compose reconstruye
├─ Servicio se reinicia
└─ ✅ Listo en :2288 y :22883
```

### Monitorear Despliegue

1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña **Actions**
3. Selecciona el workflow más reciente
4. Observa el progreso en tiempo real

---

## Comandos Útiles

### Ver estado
```bash
docker compose ps              # Estado de todos los servicios
docker compose ps --quiet      # Solo nombres
```

### Logs
```bash
docker compose logs -f                # Todos los servicios (sigue actualizaciones)
docker compose logs -f server          # Solo backend
docker compose logs -f client          # Solo frontend
docker compose logs --tail=50          # Últimas 50 líneas
```

### Reiniciar
```bash
docker compose restart                 # Reinicia todos
docker compose restart server          # Reinicia solo backend
```

### Detener/Limpiar
```bash
docker compose down                    # Detiene contenedores (mantiene volúmenes)
docker compose down -v                 # Detiene y elimina volúmenes
docker system prune -a                 # Limpia imágenes y contenedores no usados
```

### Estadísticas
```bash
docker stats                   # Uso de CPU, memoria, etc.
docker compose ps              # Ver puertos mapeados
```

### Base de Datos
```bash
docker compose exec server sqlite3 /app/data/plater.db ".tables"  # Ver tablas
```

---

## Troubleshooting

### GitHub Actions falla

**Síntomas:** El workflow en Actions muestra error rojo

**Causas comunes:**
- `SSH_PRIVATE_KEY` no configurado correctamente en Secrets
- Clave privada incompleta (falta `BEGIN` o `END`)
- Sin acceso SSH al servidor con Cloudflare Tunnel

**Solución:**
1. Verifica que `SSH_PRIVATE_KEY` en GitHub Secrets contiene la clave completa
2. Prueba conexión manual: `ssh deployer@ssh.nicolaspereira.me`
3. Revisa logs del workflow en la pestaña Actions
4. Si todo falla, intenta despliegue manual

### Contenedores no inician

**Síntomas:** `docker compose ps` muestra estado `Exited` o `Exit Code`

**Investigación:**
```bash
docker compose logs server    # Ver errores del backend
docker compose logs client    # Ver errores del frontend
```

**Soluciones comunes:**
- Verifica puertos disponibles: `sudo lsof -i :2288` o `:22883`
- Reconstruye desde cero: `docker compose down && docker system prune -a && docker compose up --build -d`
- Comprueba que `.env` existe (o usa `.env.example`)

### Puerto en uso

**Síntomas:** Error `bind: address already in use`

**Solución:**
```bash
sudo lsof -i :2288          # Ver qué usa el puerto
kill -9 <PID>               # Matar el proceso
docker compose up --build -d  # Reintentar
```

### Base de datos no persiste

**Síntomas:** Datos desaparecen después de reiniciar

**Verificación:**
```bash
ls -la /home/deployer/plater/server/data/     # Carpeta debe existir
ls -la /home/deployer/plater/server/data/plater.db  # Archivo debe existir
```

**Solución:** Verifica que los volúmenes en `docker-compose.yml` apuntan correctamente a estas carpetas

### Imágenes no se cargan

**Síntomas:** Puedo subir imágenes pero no aparecen

**Verificación:**
```bash
ls -la /home/deployer/plater/server/uploads/   # Carpeta debe existir y tener permisos
chmod 755 /home/deployer/plater/server/uploads  # Ajustar permisos si es necesario
```

**Solución:** Verifica permisos de carpeta y que el backend tiene permiso de escritura

### Base de datos corrupta

**Síntomas:** Errores al acceder a datos o BD vacía sin motivo

**Solución:**
```bash
# Backup de la BD actual
mv /home/deployer/plater/server/data/plater.db /home/deployer/plater/server/data/plater.db.backup

# Reinicia - se creará una nueva BD
docker compose restart server

# Si necesitas recuperar la anterior
mv /home/deployer/plater/server/data/plater.db.backup /home/deployer/plater/server/data/plater.db
```

---

## Información de Referencia

### Puertos y Servicios
| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend | 2288 | Nginx + React |
| Backend | 22883 | Express API |

### Ubicaciones Importantes
| Ubicación | Descripción |
|-----------|-------------|
| `~/.ssh/id_rsa` (tu máquina) | Clave privada SSH (para Secrets) |
| `/home/deployer/plater/` (servidor) | Directorio de despliegue |
| `/home/deployer/plater/server/data/` | Base de datos SQLite |
| `/home/deployer/plater/server/uploads/` | Imágenes subidas |

### Seguridad

✅ SSH keys almacenadas en GitHub Secrets (nunca en código)  
✅ Cloudflare Tunnel para acceso seguro  
✅ Archivos sensibles excluidos en rsync (`.env`, `.git`, etc.)  
✅ Contenedores Docker aislados  
✅ Variables de entorno en `.env.example`

### Tiempos Aproximados

| Acción | Tiempo |
|--------|--------|
| Primer deploy automático | 10-15 min |
| Deploy automático (siguiente) | 5-10 min |
| Deploy manual | 2-5 min |
| Sincronización rsync | ~30 seg |

### Verificación Post-Deploy

Después de cada despliegue, verifica:

```bash
# Servicios corriendo
docker compose ps                          # Ambos deben estar "Up"

# Backend accesible
curl http://ssh.nicolaspereira.me:22883   # Debe retornar JSON

# Frontend accesible
curl -I http://ssh.nicolaspereira.me:2288 # HTTP/1.1 200 OK

# Base de datos existe
ls -la /home/deployer/plater/server/data/plater.db
```

---

## Próximos Pasos

1. Completa el [Quick Start](#quick-start)
2. Realiza el primer despliegue manual
3. Configura el despliegue automático
4. Usa esta guía como referencia

**¡Listo para desplegar! 🎉**
