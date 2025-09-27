# Gestor de Gastos Personales

Aplicación para el registro y seguimiento de ingresos y gastos personales. Esta guía explica cómo configurar, compilar y ejecutar el proyecto (backend Java/Spring Boot y frontend React + Vite).

## Resumen

-   Backend: Java 17+, Spring Boot (Maven). El código fuente está en `src/main/java`.
-   Frontend: React + TypeScript + Vite, en la carpeta `frontend/`.
-   Base de datos: PostgreSQL (se incluye un archivo `src/main/resources/data.sql` para datos de ejemplo).

## Tecnologías

-   Java 17+
-   Spring Boot
-   Maven (incluye wrapper `mvnw` / `mvnw.cmd`)
-   PostgreSQL
-   Node.js + npm
-   Vite + React + TypeScript

## Requisitos previos

Instala las siguientes herramientas en tu sistema:

-   Java JDK 17 o superior
-   PostgreSQL 14/15+
-   Node.js (LTS) y npm
-   Git

En Windows, los comandos de ejemplo usan PowerShell y `mvnw.cmd`.

## Configuración de la base de datos (PostgreSQL)

1.  Crear la base de datos y un usuario (ajusta nombre/contraseña según tus políticas):

```sql
CREATE DATABASE gastos_personales;
CREATE USER gastos_user WITH PASSWORD 'gastos123';
GRANT ALL PRIVILEGES ON DATABASE gastos_personales TO gastos_user;
```

2.  Opcional: ejecutar `src/main/resources/data.sql` para insertar datos de ejemplo.

## Variables de configuración

El proyecto usa `src/main/resources/application.properties` para la configuración de la conexión a la base de datos. Valores típicos:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gastos_personales
spring.datasource.username=gastos_user
spring.datasource.password=gastos123
server.port=8080
```

Si prefieres usar variables de entorno, puedes modificar `application.properties` o usar perfiles.

## Guía rápida: compilar y ejecutar (Windows PowerShell)

A continuación se muestran pasos mínimos para levantar backend y frontend en entorno de desarrollo.

### Backend (Java / Spring Boot)

Desde la raíz del proyecto:

```powershell
# Compilar (usar wrapper que está incluido)
.\\mvnw.cmd clean package -DskipTests

# Ejecutar la aplicación (usando wrapper)
.\\mvnw.cmd spring-boot:run

# O ejecutar el JAR generado
java -jar target/gastos-personales-1.0.0.jar
```

Notas:

-   Si tienes Maven instalado globalmente puedes usar `mvn clean package`.
-   Para cambiar el puerto modifica `server.port` en `application.properties`.

### Frontend (Desarrollo y Build)

Entrar a la carpeta del frontend y ejecutar:

```powershell
cd frontend
npm install
npm run dev      # Levanta el servidor de desarrollo (Vite)
# Para generar build de producción
npm run build
```

El frontend, en modo desarrollo, estará disponible típicamente en `http://localhost:5173` (Vite).

## Uso básico

-   API REST: el backend expone endpoints bajo `http://localhost:8080` (revisa los controladores en `src/main/java/.../interfaz/web`).
-   Frontend: si ejecutas `npm run dev`, abre el navegador en la URL que indique Vite; para producción sirve la carpeta `frontend/dist` detrás del backend o desde un servidor estático.

## Ejecutar pruebas

-   Backend (maven):

```powershell
.\\mvnw.cmd test
```

-   Frontend: si hay tests configurados (Jest/Vite), usar `npm test` desde `frontend/`.

## Control de versiones y buenas prácticas

-   Antes de subir cambios, ejecuta `mvnw.cmd clean package` y `npm run build` para comprobar que el proyecto compila.
-   No subas credenciales ni archivos sensibles. Revisa `.gitignore` y evita incluir archivos como `.env`, keystores, `node_modules/` o `frontend/dist`.

## Estructura del proyecto (resumen)

```
/ (raíz)
├─ src/main/java/...      # Backend Java
├─ src/main/resources     # application.properties, data.sql
├─ frontend/              # Frontend (Vite + React)
├─ pom.xml                # Configuración Maven
├─ mvnw, mvnw.cmd         # Maven wrapper
└─ README.md              # Este archivo
```

## Troubleshooting (problemas comunes)

-   Error de conexión a la DB: verifica que PostgreSQL esté en ejecución y que los parámetros de `application.properties` sean correctos.
-   Puerto en uso (8080): cambia `server.port` en `application.properties` o termina el proceso que ocupa el puerto.
-   Problemas con dependencias Node: elimina `node_modules/` y vuelve a `npm install`.
