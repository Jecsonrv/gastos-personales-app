package com.proyecto.gastospersonales;

import com.proyecto.gastospersonales.consola.MenuPrincipal;
import com.proyecto.gastospersonales.servicio.CategoriaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

/**
 * Clase principal de la aplicación Gestor de Compras Personales
 * 
 * Esta aplicación puede ejecutarse en dos modos:
 * 1. Modo Consola: Para interacción por línea de comandos (Fase 1)
 * 2. Modo Web: Para interfaz web (Fase 2 - futuro)
 * 
 * Por defecto se ejecuta en modo consola. Para modo web, se debe configurar
 * el perfil spring.profiles.active=web
 */
@SpringBootApplication
public class GastosPersonalesApplication implements CommandLineRunner {

    @Autowired
    private MenuPrincipal menuPrincipal;
    
    @Autowired
    private CategoriaServicio categoriaServicio;
    
    private static ConfigurableApplicationContext context;

    public static void main(String[] args) {
        System.setProperty("java.awt.headless", "false");
        
        // Verificar si se debe ejecutar en modo web
        boolean modoWeb = args.length > 0 && "web".equals(args[0]);
        
        if (modoWeb) {
            // Modo Web - Solo iniciar el servidor Spring Boot
            System.out.println("🌐 Iniciando en modo WEB...");
            System.out.println("La aplicación estará disponible en: http://localhost:8080/gastos");
            context = SpringApplication.run(GastosPersonalesApplication.class, args);
        } else {
            // Modo Consola - Ejecutar interfaz de consola
            System.out.println("💻 Iniciando en modo CONSOLA...");
            context = SpringApplication.run(GastosPersonalesApplication.class, args);
        }
    }

    @Override
    public void run(String... args) throws Exception {
        // Inicializar categorías predefinidas
        inicializarDatos();
        
        // Verificar si se debe ejecutar en modo consola
        boolean modoWeb = args.length > 0 && "web".equals(args[0]);
        
        if (!modoWeb) {
            try {
                // Ejecutar interfaz de consola
                menuPrincipal.ejecutar();
            } catch (Exception e) {
                System.err.println("❌ Error al ejecutar la aplicación de consola: " + e.getMessage());
                e.printStackTrace();
            } finally {
                // Cerrar la aplicación cuando se termine la interacción por consola
                cerrarAplicacion();
            }
        }
        // Si es modo web, la aplicación sigue ejecutándose como servidor
    }
    
    /**
     * Inicializa los datos básicos de la aplicación
     */
    private void inicializarDatos() {
        try {
            System.out.println("🔧 Inicializando datos básicos...");
            categoriaServicio.inicializarCategoriasPredefinidas();
            System.out.println("✅ Datos inicializados correctamente.");
        } catch (Exception e) {
            System.err.println("❌ Error al inicializar datos: " + e.getMessage());
            // No es crítico, la aplicación puede continuar
        }
    }
    
    /**
     * Cierra la aplicación de forma controlada
     */
    public static void cerrarAplicacion() {
        if (context != null) {
            System.out.println("🔄 Cerrando aplicación...");
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
 * Una vez ejecutado en modo web, acceder a:
 * http://localhost:8080/gastos
 */