## CONFIGURACIÓN Y PUESTA EN MARCHA (Proyecto: gastos-personales-app)

Este documento contiene instrucciones prácticas y detalladas en español para levantar el proyecto localmente (backend Java Spring Boot + frontend React + base de datos PostgreSQL). Incluye variables, comandos, tips y pasos para desarrollo y despliegue básico.

---

### 1) Requisitos previos

-   Java JDK 17 o superior instalado y con la variable JAVA_HOME configurada.
-   Git instalado.
-   Node.js 16+ (para el frontend) y npm o yarn.
-   PostgreSQL 12+ (se recomienda 14/15).
-   Opcional: IDE (IntelliJ, VS Code) y Docker (para levantar BD si se prefiere).

---

### 2) Estructura principal del repo

-   `pom.xml`, `mvnw`, `mvnw.cmd`: backend (Spring Boot, Maven)
-   `src/main/java/...` y `src/main/resources`: código backend
-   `frontend/`: aplicación React + Vite + TypeScript
-   `target/`: artefactos compilados
-   `CONFIGURATION.md`: este archivo

---

### 3) Configurar la base de datos (PostgreSQL)

1. Crear la base de datos y el usuario (ejemplo):

    - Abre psql o pgAdmin y ejecuta:

        CREATE DATABASE gastos_personales;
        CREATE USER gastos_user WITH ENCRYPTED PASSWORD 'gastos123';
        GRANT ALL PRIVILEGES ON DATABASE gastos_personales TO gastos_user;

2. Opcional: ejecutar `setup-database.sql` si existen scripts de inicialización.

3. Variables en `src/main/resources/application.properties` o `application-*.properties`:

    spring.datasource.url=jdbc:postgresql://localhost:5432/gastos_personales
    spring.datasource.username=gastos_user
    spring.datasource.password=gastos123

    Ajusta según tu host/puerto/credenciales.

---

### 4) Levantar el backend (Java)

1. Usando el wrapper de Maven (recomendado en Windows):

    - Abrir PowerShell en la raíz del repo y ejecutar:

        .\mvnw.cmd clean package -DskipTests

    - Para ejecutar directamente:

        java -jar target/gastos-personales-1.0.0.jar

    - Para ejecutar con Maven (modo dev):

        .\mvnw.cmd spring-boot:run

2. Comportamiento esperado:

    - La API por defecto expone endpoints en `http://localhost:8080` (o puerto configurado).

3. Propiedades útiles (profiles): revisa `src/main/resources/` para `application.properties`, `application-web.properties`, `application-consola.properties`.

---

### 5) Levantar el frontend (React + Vite)

1. Instalar dependencias (en la carpeta `frontend`):

    - Abrir PowerShell y ejecutar:

        cd frontend
        npm install

    (o `yarn` si prefieres yarn)

2. Ejecutar en modo desarrollo con HMR (interfaz React):

    npm run dev

    - El servidor por defecto de Vite suele exponerse en `http://localhost:5173`.

3. Build para producción del frontend:

    npm run build

    - El output se generará en `frontend/dist` (o según `vite.config.ts`).

4. Si quieres servir el build integrado con el backend, copia los archivos de `dist` al directorio de recursos estáticos del backend (si la aplicación está configurada para servirlos). Revisa la configuración de Spring Boot si se desea esta opción.

---

### 6) Variables de entorno y configuración local

-   Backend (opcionalmente usar variables):

    -   SPRING_DATASOURCE_URL
    -   SPRING_DATASOURCE_USERNAME
    -   SPRING_DATASOURCE_PASSWORD
    -   SERVER_PORT

-   Frontend (archivo `.env` en `frontend/`):

    -   VITE_API_BASE_URL=http://localhost:8080/api

    Nota: Vite exige que las variables expuestas al cliente empiecen con `VITE_`.

---

### 7) Comandos útiles (Windows PowerShell)

-   Compilar backend: `.\mvnw.cmd clean package -DskipTests`
-   Ejecutar backend: `java -jar target/gastos-personales-1.0.0.jar`
-   Ejecutar backend en dev: `.\mvnw.cmd spring-boot:run`
-   Instalar frontend deps: `cd frontend; npm install`
-   Ejecutar frontend dev: `cd frontend; npm run dev`
-   Build frontend: `cd frontend; npm run build`

---

### 8) Verificación rápida (smoke test)

1. Levanta BD y backend.
2. Accede a `http://localhost:8080/actuator/health` si está activo (o prueba endpoint `GET /api/status`).
3. Levanta frontend y verifica que las llamadas XHR a `VITE_API_BASE_URL` respondan.

---

### 9) Problemas comunes y soluciones

-   Error de conexión a BD: revisar URL/usuario/contraseña y que el servicio PostgreSQL esté en ejecución.
-   Puerto 8080 ocupado: cambiar `server.port` en `application.properties` o matar proceso que usa el puerto.
-   CORS: si el frontend hace peticiones al backend en otro puerto, habilitar CORS en Spring o usar un proxy en Vite (ver `vite.config.ts`).

---

### 10) Siguientes pasos recomendados

-   Añadir notificaciones UI (toasts) en lugar de console.log para mensajes de éxito.
-   Añadir linter/prettier para mantener estilo y detectar console.log automáticamente.
-   Añadir scripts npm para checks (lint, typecheck) y pre-commit hooks (husky).

---

Fin del documento.
