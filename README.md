# Fine - Gestión de Finanzas Personales

Fine es una aplicación moderna y simple para gestionar tus finanzas personales. Registra ingresos y gastos, crea categorías personalizadas y visualiza reportes detallados de tu economía.

**Desarrollado con Spring Boot (backend) y React + TypeScript (frontend) con autenticación de usuarios.**

## Tecnologías Utilizadas

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend
- React 19.1.1
- TypeScript 5.8.3
- Vite 7.1.7
- TailwindCSS 4.1.13
- TanStack Query 5.90.2
- Axios 1.12.2

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

1. **Java Development Kit (JDK) 17 o superior**
   - Verificar: `java -version`
   - Descargar: https://www.oracle.com/java/technologies/downloads/

2. **PostgreSQL 12 o superior**
   - Verificar: `psql --version`
   - Descargar: https://www.postgresql.org/download/

3. **Node.js 18 o superior**
   - Verificar: `node --version`
   - Descargar: https://nodejs.org/

4. **npm 9 o superior** (incluido con Node.js)
   - Verificar: `npm --version`

## Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Proyecto
```

### 2. Configurar la Base de Datos

#### 2.1. Crear la Base de Datos

Abre PostgreSQL y ejecuta:

```sql
CREATE DATABASE gastos_personales;
```

#### 2.2. Crear el Usuario

```sql
CREATE USER gastos_user WITH PASSWORD 'gastos123';
GRANT ALL PRIVILEGES ON DATABASE gastos_personales TO gastos_user;
```

#### 2.3. Ejecutar el Script de Inicialización (Opcional)

Si existe el archivo `setup-database.sql`, ejecútalo:

```bash
psql -U gastos_user -d gastos_personales -f setup-database.sql
```

### 3. Configurar el Backend

#### 3.1. Verificar Configuración

Abre el archivo `src/main/resources/application.properties` y verifica:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gastos_personales
spring.datasource.username=gastos_user
spring.datasource.password=gastos123
spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

#### 3.2. Compilar el Proyecto

Desde la raíz del proyecto:

**En Windows:**
```bash
mvnw.cmd clean install
```

**En Linux/Mac:**
```bash
./mvnw clean install
```

O si tienes Maven instalado globalmente:
```bash
mvn clean install
```

### 4. Configurar el Frontend

#### 4.1. Instalar Dependencias

```bash
cd frontend
npm install
```

## Ejecución

### Opción 1: Ejecutar Todo Manualmente

#### 1. Iniciar el Backend

Desde la raíz del proyecto:

**En Windows:**
```bash
mvnw.cmd spring-boot:run
```

**En Linux/Mac:**
```bash
./mvnw spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

#### 2. Iniciar el Frontend

En otra terminal, desde la carpeta `frontend`:

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### Opción 2: Usar Scripts de Automatización (Windows)

Si estás en Windows, puedes usar los scripts incluidos:

#### 1. Compilar:
```bash
compilar.bat
```

#### 2. Ejecutar:
```bash
ejecutar.bat
```

## Estructura del Proyecto

```
Proyecto/
├── src/main/java/com/proyecto/gastospersonales/
│   ├── application/           # Lógica de aplicación
│   ├── domain/                # Modelos y servicios
│   ├── infrastructure/        # Repositorios y configuración
│   └── interfaz/              # Controladores REST
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas principales
│   │   ├── hooks/             # Hooks personalizados
│   │   ├── services/          # Servicios API
│   │   ├── types/             # Tipos TypeScript
│   │   └── utils/             # Utilidades
│   ├── package.json
│   └── vite.config.ts
├── pom.xml
└── README.md
```

## Endpoints de la API

### Categorías

- `GET /api/categorias` - Obtener todas las categorías
- `GET /api/categorias/{id}` - Obtener categoría por ID
- `POST /api/categorias` - Crear nueva categoría
- `PUT /api/categorias/{id}` - Actualizar categoría
- `DELETE /api/categorias/{id}` - Eliminar categoría

### Movimientos

- `GET /api/movimientos` - Obtener todos los movimientos
- `GET /api/movimientos/{id}` - Obtener movimiento por ID
- `POST /api/movimientos/ingresos` - Crear ingreso
- `POST /api/movimientos/gastos` - Crear gasto
- `PUT /api/movimientos/{id}` - Actualizar movimiento
- `DELETE /api/movimientos/{id}` - Eliminar movimiento
- `GET /api/movimientos/estadisticas` - Obtener estadísticas

## Solución de Problemas

### Error: "Puerto 8080 ya está en uso"

Cambia el puerto en `application.properties`:
```properties
server.port=8081
```

Y actualiza la URL en el frontend (`frontend/src/constants/index.ts`):
```typescript
export const API_BASE_URL = "http://localhost:8081";
```

### Error: "No se puede conectar a PostgreSQL"

1. Verifica que PostgreSQL esté ejecutándose:
   ```bash
   # Windows
   net start postgresql-x64-14

   # Linux
   sudo systemctl status postgresql
   ```

2. Verifica las credenciales en `application.properties`

### Error: "Module not found" en Frontend

Limpia e instala de nuevo las dependencias:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Funcionalidades

- Gestión de categorías (crear, editar, eliminar)
- Registro de ingresos y gastos
- Dashboard con resumen financiero
- Reportes y estadísticas
- Filtros y búsqueda
- Configuración de moneda y formato de fecha
- Modo claro/oscuro

## Datos de Prueba

Al iniciar la aplicación por primera vez, se crearán automáticamente categorías predefinidas:

**Categorías de Gastos:**
- Alimentación, Transporte, Entretenimiento, Salud, Educación, Servicios, Ropa, Hogar, Tecnología, Otros

**Categorías de Ingresos:**
- Salario, Inversiones, Negocios, Otros Ingresos

## Comandos Útiles

### Backend

```bash
# Compilar sin ejecutar tests
mvnw clean install -DskipTests

# Ejecutar tests
mvnw test

# Limpiar y compilar
mvnw clean package
```

### Frontend

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linter
npm run lint
```

## Notas Adicionales

- El backend usa Hibernate con `ddl-auto=update`, por lo que creará automáticamente las tablas necesarias
- Los datos de ejemplo se inicializan automáticamente en el primer arranque
- El frontend tiene caché de datos mediante TanStack Query para mejor rendimiento
- Se recomienda usar Chrome o Firefox para mejor compatibilidad

## Licencia

Este proyecto es parte de un trabajo académico.
