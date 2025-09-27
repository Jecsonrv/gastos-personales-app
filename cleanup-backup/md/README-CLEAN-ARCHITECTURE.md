# 🏦 Gestor de Compras Personales - Clean Architecture v2.0

Sistema de gestión financiera personal implementado con **Clean Architecture**, diseñado para evolucionar desde una aplicación de consola (MVP) hacia una aplicación web moderna con React + TypeScript.

## 🏗️ Arquitectura del Sistema

### Clean Architecture - Capas Implementadas

```
src/main/java/com/proyecto/gastospersonales/
├── 🏛️ domain/                    # Capa de Dominio (Entidades y Reglas de Negocio)
│   ├── model/                    # Entidades: Categoria, Movimiento, TipoMovimiento
│   ├── dto/                      # DTOs: CategoriaResumenDto, DashboardDto, MonthlySummaryDto
│   └── service/                  # Interfaces de servicios de dominio
├── 🔧 application/               # Capa de Aplicación (Casos de Uso)
│   └── service/                  # Implementación de casos de uso
├── 🗄️ infrastructure/            # Capa de Infraestructura
│   ├── repository/               # Interfaces JPA y persistencia
│   └── config/                   # Configuraciones de Spring
└── 🖥️ interfaz/                  # Capa de Interfaces de Usuario
    ├── console/                  # Interfaz de consola (Fase 1)
    └── web/                      # API REST (Fase 2)
```

### Patrones de Diseño Implementados

-   **Repository Pattern**: Separación entre lógica y persistencia
-   **Service Layer**: Centralización de la lógica de negocio
-   **Dependency Injection**: Inversión de dependencias con Spring
-   **DTOs**: Transferencia segura entre capas
-   **Factory**: Creación de objetos complejos

## 🚀 Tecnologías

### Backend

-   ☕ **Java 17+**
-   🍃 **Spring Boot 3.2**
-   🗄️ **Spring Data JPA + Hibernate**
-   🐘 **PostgreSQL 15+**
-   🔧 **Maven**
-   ✅ **JUnit + Mockito** (tests)

### Frontend (Planificado - Fase 2)

-   ⚛️ **React 18 + TypeScript**
-   ⚡ **Vite** (bundler)
-   🎨 **TailwindCSS + shadcn/ui**
-   📊 **Recharts / Chart.js**
-   🌐 **React Query / Axios**

## 📋 Funcionalidades Core

### ✅ Implementado (Fase 1 - Consola)

-   💰 Registrar ingresos y gastos
-   📁 Gestión completa de categorías
-   🔍 Consultas y búsquedas avanzadas
-   📊 Balance y estadísticas en tiempo real
-   📈 Reportes básicos por categoría
-   🗄️ Persistencia en PostgreSQL
-   🏗️ API REST base preparada

### 🔄 En Desarrollo (Fase 2 - Web)

-   🌐 API REST completa
-   🖥️ Dashboard interactivo
-   📱 Interfaz responsive
-   📊 Gráficos dinámicos
-   🌓 Modo claro/oscuro
-   📤 Exportación de datos

## 🎯 Instalación y Configuración

### Prerrequisitos

-   Java 17+
-   Maven 3.8+
-   PostgreSQL 15+
-   Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/Jecsonrv/gastos-personales-app.git
cd gastos-personales-app
```

### 2. Configurar PostgreSQL

```sql
-- Crear base de datos
CREATE DATABASE gastos_personales;
CREATE USER gastos_user WITH ENCRYPTED PASSWORD 'gastos123';
GRANT ALL PRIVILEGES ON DATABASE gastos_personales TO gastos_user;
```

### 3. Configurar aplicación

Editar `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gastos_personales
spring.datasource.username=gastos_user
spring.datasource.password=gastos123
```

### 4. Compilar proyecto

```bash
mvn clean compile
```

## 🚀 Ejecución

### Modo Consola (Por defecto - MVP Fase 1)

```bash
# Con Maven
mvn spring-boot:run

# Con JAR
mvn package
java -jar target/gastos-personales-1.0.0.jar
```

### Modo Web (API REST - Fase 2)

```bash
# Con Maven
mvn spring-boot:run -Dspring-boot.run.arguments=web

# Con JAR
java -jar target/gastos-personales-1.0.0.jar web
```

Acceder a: `http://localhost:8080`

## 🌐 API REST Endpoints

### 📊 Información General

-   `GET /api/info` - Información de la API
-   `GET /api/status` - Estado del sistema

### 💸 Movimientos

-   `GET /api/movimientos` - Obtener todos los movimientos
-   `GET /api/movimientos/{id}` - Obtener movimiento por ID
-   `POST /api/movimientos/gastos` - Registrar gasto
-   `POST /api/movimientos/ingresos` - Registrar ingreso
-   `GET /api/movimientos/buscar?q={texto}` - Buscar movimientos
-   `GET /api/movimientos/estadisticas` - Estadísticas generales
-   `PUT /api/movimientos/{id}` - Actualizar movimiento
-   `DELETE /api/movimientos/{id}` - Eliminar movimiento

### 📁 Categorías

-   `GET /api/categorias` - Obtener todas las categorías
-   `GET /api/categorias/{id}` - Obtener categoría por ID
-   `GET /api/categorias/gastos` - Categorías para gastos
-   `GET /api/categorias/ingresos` - Categorías para ingresos
-   `POST /api/categorias` - Crear categoría
-   `GET /api/categorias/buscar?q={texto}` - Buscar categorías
-   `PUT /api/categorias/{id}` - Actualizar categoría
-   `DELETE /api/categorias/{id}` - Eliminar categoría

## 💻 Interfaz de Consola

La aplicación incluye una interfaz de consola completa con:

```
┌─────────────────────────────────────────────────────┐
│                   MENÚ PRINCIPAL                    │
├─────────────────────────────────────────────────────┤
│  1. 💰 Registrar Ingreso                           │
│  2. 💸 Registrar Gasto                             │
│  3. 📊 Ver Balance y Estadísticas                  │
│  4. 📋 Listar Movimientos                          │
│  5. 🔍 Buscar Movimientos                          │
│  6. 📁 Gestionar Categorías                        │
│  7. 📈 Reportes y Análisis                         │
│  8. ⚙️  Configuración                               │
│  0. 🚪 Salir                                        │
└─────────────────────────────────────────────────────┘
```

## 📊 Características Técnicas

### 🏗️ Clean Architecture

-   **Separación de responsabilidades** clara
-   **Inversión de dependencias** completa
-   **Testabilidad** mejorada
-   **Mantenibilidad** a largo plazo
-   **Escalabilidad** para nuevas funcionalidades

### 🔒 Validaciones

-   Validación de datos de entrada
-   Constraints de base de datos
-   Manejo de excepciones robusto
-   Mensajes de error descriptivos

### 📈 Performance

-   Consultas optimizadas con JPA
-   Lazy loading configurado
-   Transacciones gestionadas
-   Conexiones de BD pooled

## 🔮 Roadmap

### Fase 2 - Frontend React (Próximamente)

-   [ ] 🎨 Dashboard con tarjetas resumen
-   [ ] 📊 Gráficos interactivos (dona, líneas, barras)
-   [ ] 📱 Interfaz responsive con Tailwind
-   [ ] 🌓 Tema claro/oscuro
-   [ ] 🔍 Filtros avanzados y paginación
-   [ ] 📤 Exportación (PDF, Excel, CSV)
-   [ ] 🔔 Notificaciones toast
-   [ ] ⚡ Loading states y skeletons

### Fase 3 - Características Avanzadas

-   [ ] 🔐 Autenticación y autorización
-   [ ] 👥 Multi-usuario
-   [ ] 🏷️ Etiquetas personalizadas
-   [ ] 📅 Planificación presupuestaria
-   [ ] 🤖 Análisis inteligente con IA
-   [ ] 📱 Progressive Web App (PWA)

## 🧪 Testing

```bash
# Ejecutar tests
mvn test

# Generar reporte de cobertura
mvn jacoco:report
```

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Tu Nombre** - [@Jecsonrv](https://github.com/Jecsonrv)

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!

🚀 **Clean Architecture + Spring Boot + React = Arquitectura Escalable y Mantenible**
