package com.proyecto.gastospersonales;

import com.proyecto.gastospersonales.interfaz.console.ConsoleApplication;
import com.proyecto.gastospersonales.domain.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

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

    @Autowired
    private ConsoleApplication consoleApplication;
    
    @Autowired
    private CategoriaService categoriaService;
    
    private static ConfigurableApplicationContext context;

    public static void main(String[] args) {
        System.out.println("Iniciando Gestor de Compras Personales");
        
        // Configurar codificación UTF-8 para la consola
        System.setProperty("file.encoding", "UTF-8");
        System.setProperty("console.encoding", "UTF-8");
        System.setProperty("java.awt.headless", "false");
        
        // Determinar modo de ejecución
        boolean modoConsola = "consola".equalsIgnoreCase(args.length > 0 ? args[0] : "web");
        
        if (modoConsola) {
            System.out.println("Iniciando en Modo Consola");
        } else {
            System.out.println("Iniciando en modo WEB");
            System.out.println("Servidor disponible en: http://localhost:8080");
        }
        
        context = SpringApplication.run(GastosPersonalesApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Determinar modo de ejecución
        boolean modoConsola = "consola".equalsIgnoreCase(args.length > 0 ? args[0] : "web");
        
        if (modoConsola) {
            try {
                System.out.println("Iniciando interfaz de consola...");
                // Ejecutar interfaz de consola
                consoleApplication.ejecutar();
            } catch (Exception e) {
                System.err.println("❌ Error al ejecutar la aplicación de consola: " + e.getMessage());
                e.printStackTrace();
            } finally {
                // Cerrar la aplicación cuando se termine la interacción por consola
                cerrarAplicacion();
            }
        } else {
            // Modo Web - La aplicación sigue ejecutándose como servidor
            System.out.println("Servidor web iniciado correctamente");
            System.out.println("Accede desde: http://localhost:8080");
            System.out.println(" Para detener el servidor, presiona Ctrl+C");
            System.out.println("Endpoints disponibles:");
            System.out.println("   - /api/movimientos (próximamente)");
            System.out.println("   - /api/categorias (próximamente)");
        }
    }
    
    /**
     * Cierra la aplicación de forma controlada
     */
    public static void cerrarAplicacion() {
        if (context != null) {
            System.out.println("Cerrando aplicación...");
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