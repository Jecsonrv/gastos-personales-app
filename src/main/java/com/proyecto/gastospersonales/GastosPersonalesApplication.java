package com.proyecto.gastospersonales;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.proyecto.gastospersonales.domain.service.CategoriaService;
import com.proyecto.gastospersonales.domain.service.UsuarioService;
import com.proyecto.gastospersonales.interfaz.console.ConsoleApplication;

/**
 * Clase principal de la aplicación Gestor de Compras Personales
 * 
 * Clean Architecture implementada:
 * - Domain: Entidades, servicios y DTOs del negocio
 * - Application: Implementación de casos de uso
 * - Infrastructure: Repositorios, configuraciones y persistencia
 * - Interface: Consola (actual) y futura API REST
 * 
 * Fase 1: Aplicación de consola (MVP)
 * Fase 2: API REST + Frontend React (futuro)
 */
@SpringBootApplication
public class GastosPersonalesApplication implements CommandLineRunner {

    @Autowired(required = false)
    private ConsoleApplication consoleApplication;
    
    @Autowired
    private CategoriaService categoriaService;
    
    @Autowired
    private UsuarioService usuarioService;
    
    private static ConfigurableApplicationContext context;
    private static final Logger logger = LoggerFactory.getLogger(GastosPersonalesApplication.class);

    public static void main(String[] args) {
        logger.info("Iniciando Gestor de Compras Personales");
        
        // Configurar codificación UTF-8 para la consola
        System.setProperty("file.encoding", "UTF-8");
        System.setProperty("console.encoding", "UTF-8");
        System.setProperty("java.awt.headless", "false");
        
        // Determinar modo de ejecución
        boolean modoConsola = "consola".equalsIgnoreCase(args.length > 0 ? args[0] : "web");
        
        if (modoConsola) {
            logger.info("Iniciando en Modo Consola");
        } else {
            logger.info("Iniciando en modo WEB");
            logger.info("Servidor disponible en: http://localhost:8080");
        }
        
        context = SpringApplication.run(GastosPersonalesApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Inicializar categorías predefinidas
        categoriaService.inicializarCategoriasPredefinidas();
        
        // Crear usuario de prueba si no existe
        inicializarUsuarioPrueba();
        
        // Determinar modo de ejecución
        boolean modoConsola = "consola".equalsIgnoreCase(args.length > 0 ? args[0] : "web");
        
        if (modoConsola) {
            if (consoleApplication != null) {
                try {
                    logger.info("Iniciando interfaz de consola...");
                    // Ejecutar interfaz de consola
                    consoleApplication.ejecutar();
                } catch (Exception e) {
                    logger.error("❌ Error al ejecutar la aplicación de consola", e);
                } finally {
                    // Cerrar la aplicación cuando se termine la interacción por consola
                    cerrarAplicacion();
                }
            } else {
                logger.error("❌ ConsoleApplication no está disponible en el perfil web");
            }
        } else {
            // Modo Web - La aplicación sigue ejecutándose como servidor
            logger.info("Servidor web iniciado correctamente");
            logger.info("Accede desde: http://localhost:8080");
            logger.info(" Para detener el servidor, presiona Ctrl+C");
            logger.info("Endpoints disponibles:");
            logger.info("   - /api/movimientos (próximamente)");
            logger.info("   - /api/categorias (próximamente)");
        }
    }
    
    /**
     * Inicializa un usuario de prueba para desarrollo
     */
    private void inicializarUsuarioPrueba() {
        try {
            if (!usuarioService.existeUsername("admin")) {
                usuarioService.registrarUsuario("admin", "admin@gastos.com", "admin123", "Administrador");
                logger.info("✅ Usuario de prueba creado:");
                logger.info("   Usuario: admin");
                logger.info("   Password: admin123");
            } else {
                logger.info("✅ Usuario de prueba ya existe (admin/admin123)");
            }
        } catch (Exception e) {
            logger.warn("⚠️ No se pudo crear usuario de prueba: {}", e.getMessage());
            logger.debug("Detalle de la excepción al crear usuario de prueba", e);
        }
    }
    
    /**
     * Cierra la aplicación de forma controlada
     */
    public static void cerrarAplicacion() {
        if (context != null) {
            logger.info("Cerrando aplicación...");
            context.close();
            System.exit(0);
        }
    }
}

/*
 * INSTRUCCIONES DE EJECUCIÓN:
 * 
 * Modo Consola (por defecto):
 * mvn spring-boot:run
 * o
 * java -jar target/gastos-personales-1.0.0.jar
 * 
 * Modo Web:
 * mvn spring-boot:run -Dspring-boot.run.arguments=web
 * o
 * java -jar target/gastos-personales-1.0.0.jar web
 * 
 * Acceder a: http://localhost:8080
 */