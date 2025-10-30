# Fine - Gestión de Finanzas Personales

Fine es una aplicación moderna y simple para gestionar tus finanzas personales. Registra ingresos y gastos, crea categorías personalizadas y visualiza reportes detallados de tu economía.

**Desarrollado con Spring Boot (backend) y React + TypeScript (frontend) con autenticación de usuarios.**

## Tecnologías Utilizadas

### Backend

-   Java 17
-   Spring Boot 3.2.0
-   Spring Data JPA
-   PostgreSQL
-   Maven

### Frontend

-   React 19.1.1
-   TypeScript 5.8.3
-   Vite 7.1.7
-   TailwindCSS 4.1.13
-   TanStack Query 5.90.2
-   Axios 1.12.2

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

````markdown
# Fine - Gestión de Finanzas Personales

Aplicación simple para registrar ingresos y gastos, con categorías y reportes básicos.

Requisitos mínimos:

-   Java 17
-   PostgreSQL (local)
-   Node.js 18+

Arranque rápido (desarrollo)

1. Backend (desde la raíz del proyecto, Windows):

```powershell
.\mvnw.cmd spring-boot:run
```

El backend escucha por defecto en: http://localhost:8080

2. Frontend (otra terminal):

```powershell
cd frontend
npm install
npm run dev
```
````
