// Archivo de ejecución simple para el Sistema de Gastos Personales
// Equivalente a run.py en Python
// Compilar: javac Run.java
// Ejecutar: java Run

import java.io.File;
import java.io.IOException;
import java.util.Scanner;

public class Run {
    
    private static final String JAR_PATH = "target/gastos-personales-1.0.0.jar";
    private static final String MAVEN_CMD = System.getProperty("os.name").toLowerCase().contains("windows") ? 
        "mvnw.cmd" : "./mvnw";
    
    public static void main(String[] args) {
        System.out.println("=".repeat(60));
        System.out.println("🚀 SISTEMA DE GASTOS PERSONALES");
        System.out.println("=".repeat(60));
        System.out.println();
        
        try {
            // Verificar si el JAR existe, si no, compilar
            if (!new File(JAR_PATH).exists()) {
                System.out.println("📦 Compilando la aplicación...");
                compilarAplicacion();
            }
            
            // Mostrar opciones al usuario
            mostrarMenu();
            
            Scanner scanner = new Scanner(System.in);
            String opcion = scanner.nextLine().trim();
            
            switch (opcion.toLowerCase()) {
                case "1":
                case "web":
                case "":
                    ejecutarModoWeb();
                    break;
                case "2":
                case "consola":
                    ejecutarModoConsola();
                    break;
                case "3":
                case "recompilar":
                    recompilar();
                    break;
                default:
                    System.out.println("❌ Opción no válida. Ejecutando modo web por defecto...");
                    ejecutarModoWeb();
            }
            
            scanner.close();
            
        } catch (Exception e) {
            System.err.println("❌ Error al ejecutar la aplicación: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static void mostrarMenu() {
        System.out.println("Selecciona el modo de ejecución:");
        System.out.println();
        System.out.println("1. 🌐 Modo Web (Recomendado)");
        System.out.println("   - Servidor web en http://localhost:8080");
        System.out.println("   - Frontend React en http://localhost:5173");
        System.out.println("   - API REST completa");
        System.out.println();
        System.out.println("2. 💻 Modo Consola");
        System.out.println("   - Interfaz de línea de comandos");
        System.out.println("   - Funcionalidad básica");
        System.out.println();
        System.out.println("3. 🔧 Recompilar y ejecutar");
        System.out.println("   - Limpia y recompila todo el proyecto");
        System.out.println();
        System.out.print("Ingresa tu opción (1-3) o presiona Enter para modo web: ");
    }
    
    private static void compilarAplicacion() throws IOException, InterruptedException {
        System.out.println("Ejecutando: " + MAVEN_CMD + " clean package -DskipTests");
        ProcessBuilder pb = new ProcessBuilder(MAVEN_CMD, "clean", "package", "-DskipTests");
        pb.directory(new File("."));
        pb.inheritIO();
        
        Process process = pb.start();
        int exitCode = process.waitFor();
        
        if (exitCode != 0) {
            throw new RuntimeException("Error en la compilación. Código de salida: " + exitCode);
        }
        
        System.out.println("✅ Compilación completada exitosamente");
        System.out.println();
    }
    
    private static void ejecutarModoWeb() throws IOException, InterruptedException {
        System.out.println("🌐 Iniciando en Modo Web...");
        System.out.println();
        System.out.println("🔗 URLs disponibles:");
        System.out.println("   Backend:  http://localhost:8080");
        System.out.println("   Frontend: http://localhost:5173");
        System.out.println();
        System.out.println("📝 Para iniciar el frontend, ejecuta en otra terminal:");
        System.out.println("   cd frontend && npm run dev");
        System.out.println();
        System.out.println("⚡ Iniciando servidor backend...");
        System.out.println("   Presiona Ctrl+C para detener");
        System.out.println("-".repeat(50));
        
        ProcessBuilder pb = new ProcessBuilder("java", "-jar", JAR_PATH, "web");
        pb.directory(new File("."));
        pb.inheritIO();
        
        Process process = pb.start();
        process.waitFor();
    }
    
    private static void ejecutarModoConsola() throws IOException, InterruptedException {
        System.out.println("💻 Iniciando en Modo Consola...");
        System.out.println("-".repeat(50));
        
        ProcessBuilder pb = new ProcessBuilder("java", "-jar", JAR_PATH, "consola");
        pb.directory(new File("."));
        pb.inheritIO();
        
        Process process = pb.start();
        process.waitFor();
    }
    
    private static void recompilar() throws IOException, InterruptedException {
        System.out.println("🔧 Recompilando toda la aplicación...");
        
        // Limpiar y compilar
        compilarAplicacion();
        
        // Preguntar qué modo ejecutar después
        System.out.println("Compilación terminada. ¿Qué modo deseas ejecutar ahora?");
        mostrarMenu();
        
        Scanner scanner = new Scanner(System.in);
        String opcion = scanner.nextLine().trim();
        
        switch (opcion.toLowerCase()) {
            case "1":
            case "web":
            case "":
                ejecutarModoWeb();
                break;
            case "2":
            case "consola":
                ejecutarModoConsola();
                break;
            default:
                System.out.println("Ejecutando modo web por defecto...");
                ejecutarModoWeb();
        }
        
        scanner.close();
    }
}