# 💰 Gestor de Compras Personales

Una aplicación Java desarrollada con Spring Boot para el control y gestión de finanzas personales. Permite registrar ingresos y gastos, categorizarlos, generar reportes y llevar un control detallado del balance financiero.

## 🚀 Características Principales

### ✅ Gestión de Movimientos Financieros

-   **Registrar Gastos**: Descripción, monto, categoría y fecha automática
-   **Registrar Ingresos**: Salarios, bonos, ingresos extra con descripción y monto
-   **Editar Movimientos**: Modificar registros existentes
-   **Eliminar Movimientos**: Borrar transacciones incorrectas o duplicadas

### 🏷️ Sistema de Categorización

-   **Categorías Predefinidas**: Alimentación, Transporte, Entretenimiento, Salud, Educación, Otros
-   **Gestión de Categorías**: Crear, editar y eliminar categorías personalizadas
-   **Asignación Automática**: Cada movimiento debe tener una categoría asignada

### 📊 Reportes y Análisis

-   **Balance Actual**: Cálculo automático de (Ingresos - Gastos)
-   **Reporte Mensual**: Resumen de movimientos del mes actual
-   **Gastos por Categoría**: Análisis de distribución de gastos
-   **Histórico**: Consulta de movimientos por período de tiempo
-   **Estadísticas Básicas**: Promedio de gastos, mayor gasto del mes, etc.

### 🔒 Validaciones del Sistema

-   **Montos**: Solo valores positivos y formato decimal correcto
-   **Fechas**: No permite fechas futuras
-   **Campos Obligatorios**: Descripción mínima de 3 caracteres
-   **Integridad**: No permite eliminar categorías con movimientos asociados

## 🛠️ Tecnologías Utilizadas

-   **Java 17+** - Lenguaje de programación principal
-   **Spring Boot 3.2** - Framework para desarrollo de aplicaciones
-   **Spring Data JPA** - Manejo de persistencia y bases de datos
-   **Hibernate** - ORM para mapeo objeto-relacional
-   **PostgreSQL 15+** - Sistema de gestión de base de datos
-   **Maven** - Gestión de dependencias y construcción del proyecto

## 📋 Requisitos del Sistema

### Software Necesario

-   **Java JDK 17+** instalado y configurado
-   **PostgreSQL 15+** servidor de base de datos
-   **Maven 3.6+** (opcional, se puede usar el wrapper incluido)
-   **IDE** (IntelliJ IDEA, Eclipse, VS Code)

### Hardware Mínimo

-   **RAM**: 4GB mínimo (8GB recomendado)
-   **Almacenamiento**: 500MB para el proyecto + base de datos
-   **Procesador**: Cualquier procesador moderno

## ⚙️ Instalación y Configuración

### 1. Configurar PostgreSQL

```sql
-- Crear la base de datos
CREATE DATABASE gastos_personales;

-- Crear el usuario
CREATE USER gastos_user WITH PASSWORD 'gastos123';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE gastos_personales TO gastos_user;
GRANT ALL ON SCHEMA public TO gastos_user;
```

### 2. Clonar el proyecto

```bash
git clone https://github.com/Jecsonrv/gastos-personales-app.git
cd gastos-personales-app
```

### 3. Configurar la base de datos

Editar el archivo `src/main/resources/application.properties` si es necesario:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gastos_personales
spring.datasource.username=gastos_user
spring.datasource.password=gastos123
```

### 4. Compilar el proyecto

```bash
# Usando Maven instalado
mvn clean install

# O usando el wrapper de Maven (recomendado)
./mvnw clean install      # Linux/Mac
mvnw.cmd clean install    # Windows
```

## 🚀 Ejecución de la Aplicación

### Modo Consola (Fase 1 - Actual)

```bash
# Usando Maven
mvn spring-boot:run

# O usando el JAR compilado
java -jar target/gastos-personales-1.0.0.jar

# O usando el wrapper
./mvnw spring-boot:run
```

### Modo Web (Fase 2 - Futuro)

```bash
# Usando Maven
mvn spring-boot:run -Dspring-boot.run.arguments=web

# O usando el JAR compilado
java -jar target/gastos-personales-1.0.0.jar web
```

Una vez ejecutado en modo web, acceder a: `http://localhost:8080/gastos`

## 📱 Uso de la Aplicación (Modo Consola)

### Menú Principal

```
======================================
    GESTOR DE COMPRAS PERSONALES
======================================
1. Registrar Gasto
2. Registrar Ingreso
3. Ver Balance Actual
4. Listar Todos los Movimientos
5. Ver Movimientos por Categoría
6. Generar Reporte Mensual
7. Gestionar Categorías
8. Buscar Movimientos
9. Estadísticas
0. Salir
======================================
```

### Ejemplos de Uso

#### Registrar un Gasto

```
=== REGISTRAR NUEVO GASTO ===
Descripción: Almuerzo restaurante
Monto: $15.50
Categorías disponibles:
1. Alimentación
2. Transporte
3. Entretenimiento
4. Salud
5. Educación
6. Otros
Seleccione categoría: 1

✅ Gasto registrado exitosamente
Fecha: 22/09/2025 14:30
```

#### Ver Balance

```
=== BALANCE FINANCIERO ===
BALANCE GENERAL:
Total Ingresos: $2500.00
Total Gastos:   $1850.00
Balance Total:  $650.00

BALANCE DEL MES ACTUAL:
Ingresos del mes: $2500.00
Gastos del mes:   $850.00
Balance del mes:  $1650.00

🟢 ¡Vas bien este mes!
```

#### Reporte Mensual

```
======= REPORTE SEPTIEMBRE 2025 =======
Total Ingresos: $2,500.00
Total Gastos:   $1,850.00
Balance:        $650.00

GASTOS POR CATEGORÍA:
- Alimentación:     $650.00 (35.1%)
- Transporte:       $420.00 (22.7%)
- Entretenimiento:  $380.00 (20.5%)
- Salud:           $200.00 (10.8%)
- Educación:       $150.00 (8.1%)
- Otros:           $50.00  (2.7%)
```

## 🗂️ Estructura del Proyecto

```
gastor-compras-personales/
├── src/main/java/com/proyecto/gastospersonales/
│   ├── GastosPersonalesApplication.java      # Clase principal
│   ├── modelo/
│   │   ├── Movimiento.java                   # Entidad principal
│   │   ├── Categoria.java                    # Categorías de gastos
│   │   └── TipoMovimiento.java               # Enum INGRESO/GASTO
│   ├── repositorio/
│   │   ├── MovimientoRepositorio.java        # Acceso a datos de movimientos
│   │   └── CategoriaRepositorio.java         # Acceso a datos de categorías
│   ├── servicio/
│   │   ├── MovimientoServicio.java           # Lógica de negocio
│   │   └── CategoriaServicio.java            # Gestión de categorías
│   └── consola/
│       └── MenuPrincipal.java                # Interfaz de consola
├── src/main/resources/
│   ├── application.properties                # Configuración
│   └── data.sql                             # Datos iniciales
├── pom.xml                                  # Dependencias Maven
└── README.md                                # Este archivo
```

## 🔧 Características Técnicas

### Base de Datos

-   **2 tablas principales**:
    -   `categoria` (id, nombre, descripcion, es_predefinida)
    -   `movimiento` (id, descripcion, monto, fecha, tipo, categoria_id)

### Arquitectura

-   **Patrón MVC** - Separación de responsabilidades
-   **Repository Pattern** - Abstracción de acceso a datos
-   **Service Layer** - Lógica de negocio centralizada
-   **Entity Models** - Representación de datos con JPA

### Validaciones Implementadas

-   Validación de montos positivos
-   Validación de longitud de descripción (mínimo 3 caracteres)
-   Validación de fechas (no futuras)
-   Validación de integridad referencial
-   Validación de unicidad de nombres de categoría

## 🚧 Roadmap - Desarrollo Futuro

### Fase 2: Aplicación Web

-   [ ] Controladores web con Spring MVC
-   [ ] Vistas con Thymeleaf
-   [ ] Dashboard interactivo
-   [ ] Gráficos con Chart.js
-   [ ] API REST para móviles

### Fase 3: Características Avanzadas

-   [ ] Exportación de reportes (PDF/Excel)
-   [ ] Filtros avanzados por fecha
-   [ ] Notificaciones y alertas
-   [ ] Backup automático
-   [ ] Importación de datos

## 🐛 Solución de Problemas

### Error de Conexión a Base de Datos

```
Verificar que PostgreSQL esté ejecutándose:
- Windows: Servicios > PostgreSQL
- Linux: sudo systemctl status postgresql
- Mac: brew services list | grep postgresql
```

### Error "Port 8080 already in use"

```
# Cambiar el puerto en application.properties
server.port=8081
```

### Error de Memoria

```
# Aumentar memoria de la JVM
export MAVEN_OPTS="-Xmx1024m"
mvn spring-boot:run
```

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

-   Crea un issue en [GitHub](https://github.com/Jecsonrv/gastos-personales-app/issues)
-   Revisa la documentación
-   Consulta los logs de la aplicación

## 🔗 Enlaces

-   **Repositorio GitHub**: [https://github.com/Jecsonrv/gastos-personales-app](https://github.com/Jecsonrv/gastos-personales-app)
-   **Documentación**: [README.md](https://github.com/Jecsonrv/gastos-personales-app/blob/main/README.md)
-   **Issues y Bugs**: [GitHub Issues](https://github.com/Jecsonrv/gastos-personales-app/issues)

---

**Desarrollado con ❤️ usando Java y Spring Boot**  
**Autor**: [Jecsonrv](https://github.com/Jecsonrv)  
**Repositorio**: [gastos-personales-app](https://github.com/Jecsonrv/gastos-personales-app)
