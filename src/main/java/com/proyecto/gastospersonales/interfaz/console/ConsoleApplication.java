package com.proyecto.gastospersonales.interfaz.console;

import com.proyecto.gastospersonales.domain.model.Categoria;
import com.proyecto.gastospersonales.domain.model.Movimiento;
import com.proyecto.gastospersonales.domain.model.TipoMovimiento;
import com.proyecto.gastospersonales.domain.service.CategoriaService;
import com.proyecto.gastospersonales.domain.service.MovimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Scanner;

/**
 * Interfaz de consola para el Gestor de Gastos Personales
 * Versión limpia sin emojis para mejor compatibilidad
 */
@Component
public class ConsoleApplication {
    
    @Autowired
    private MovimientoService movimientoService;
    
    @Autowired
    private CategoriaService categoriaService;
    
    private Scanner scanner;
    
    public ConsoleApplication() {
        this.scanner = new Scanner(System.in);
    }
    
    /**
     * Ejecuta el menú principal de la aplicación
     */
    public void ejecutar() {
        mostrarBienvenida();
        inicializarCategoriasPredefinidas();
        
        int opcion;
        do {
            mostrarMenuPrincipal();
            opcion = leerOpcion();
            procesarOpcion(opcion);
        } while (opcion != 0);
        
        mostrarDespedida();
    }
    
    /**
     * Muestra el mensaje de bienvenida
     */
    private void mostrarBienvenida() {
        System.out.println("===============================================================");
        System.out.println("              GESTOR DE GASTOS PERSONALES                     ");
        System.out.println("===============================================================");
        System.out.println("Bienvenido al sistema de gestión financiera personal");
        System.out.println();
    }
    
    /**
     * Inicializa las categorías predefinidas
     */
    private void inicializarCategoriasPredefinidas() {
        try {
            categoriaService.inicializarCategoriasPredefinidas();
            System.out.println("Sistema inicializado correctamente");
            System.out.println();
        } catch (Exception e) {
            System.out.println("Error al inicializar categorías: " + e.getMessage());
        }
    }
    
    /**
     * Muestra el menú principal
     */
    private void mostrarMenuPrincipal() {
        System.out.println("+-----------------------------------------------------+");
        System.out.println("|                   MENU PRINCIPAL                   |");
        System.out.println("+-----------------------------------------------------+");
        System.out.println("|  1. Registrar Ingreso                              |");
        System.out.println("|  2. Registrar Gasto                                |");
        System.out.println("|  3. Ver Balance y Estadísticas                     |");
        System.out.println("|  4. Listar Movimientos                             |");
        System.out.println("|  5. Buscar Movimientos                             |");
        System.out.println("|  6. Gestionar Categorías                           |");
        System.out.println("|  7. Reportes y Análisis                            |");
        System.out.println("|  8. Configuración                                  |");
        System.out.println("|  0. Salir                                           |");
        System.out.println("+-----------------------------------------------------+");
        System.out.print("Seleccione una opción: ");
    }
    
    /**
     * Lee la opción seleccionada por el usuario
     */
    private int leerOpcion() {
        try {
            String input = scanner.nextLine().trim();
            if (input.isEmpty()) {
                return -1;
            }
            int opcion = Integer.parseInt(input);
            System.out.println();
            return opcion;
        } catch (NumberFormatException e) {
            System.out.println("Error: Opción inválida. Ingrese un número.");
            System.out.println();
            return -1;
        }
    }
    
    /**
     * Procesa la opción seleccionada
     */
    private void procesarOpcion(int opcion) {
        try {
            switch (opcion) {
                case 1 -> registrarIngreso();
                case 2 -> registrarGasto();
                case 3 -> mostrarBalanceYEstadisticas();
                case 4 -> listarMovimientos();
                case 5 -> buscarMovimientos();
                case 6 -> gestionarCategorias();
                case 7 -> mostrarReportes();
                case 8 -> mostrarConfiguracion();
                case 0 -> System.out.println("Cerrando aplicación...");
                default -> System.out.println("Error: Opción inválida. Intente nuevamente.\n");
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage() + "\n");
        }
    }
    
    /**
     * Registra un nuevo ingreso
     */
    private void registrarIngreso() {
        System.out.println("=== REGISTRAR INGRESO ===");
        
        List<Categoria> categorias = categoriaService.obtenerCategoriasParaIngresos();
        if (categorias.isEmpty()) {
            System.out.println("Error: No hay categorías disponibles para ingresos.");
            return;
        }
        
        System.out.println("\nCategorías disponibles:");
        for (int i = 0; i < categorias.size(); i++) {
            Categoria categoria = categorias.get(i);
            System.out.printf("%d. %s - %s\n", i + 1, categoria.getNombre(), 
                categoria.getDescripcion());
        }
        
        try {
            System.out.print("\nDescripción del ingreso: ");
            String descripcion = scanner.nextLine().trim();
            
            System.out.print("Monto: $");
            BigDecimal monto = new BigDecimal(scanner.nextLine().trim());
            
            System.out.print("Seleccione categoría (número): ");
            int categoriaIndex = Integer.parseInt(scanner.nextLine().trim()) - 1;
            
            if (categoriaIndex < 0 || categoriaIndex >= categorias.size()) {
                System.out.println("Error: Categoría inválida.\n");
                return;
            }
            
            Categoria categoria = categorias.get(categoriaIndex);
            Movimiento ingreso = movimientoService.registrarIngreso(descripcion, monto, categoria.getId());
            
            System.out.println("\nIngreso registrado exitosamente:");
            System.out.printf("   Descripción: %s\n", ingreso.getDescripcion());
            System.out.printf("   Monto: %s\n", ingreso.getMontoFormateado());
            System.out.printf("   Categoría: %s\n", ingreso.getCategoria().getNombre());
            System.out.printf("   Fecha: %s\n\n", ingreso.getFechaFormateada());
            
        } catch (Exception e) {
            System.out.println("Error al registrar ingreso: " + e.getMessage() + "\n");
        }
    }
    
    /**
     * Registra un nuevo gasto
     */
    private void registrarGasto() {
        System.out.println("=== REGISTRAR GASTO ===");
        
        List<Categoria> categorias = categoriaService.obtenerCategoriasParaGastos();
        if (categorias.isEmpty()) {
            System.out.println("Error: No hay categorías disponibles para gastos.");
            return;
        }
        
        System.out.println("\nCategorías disponibles:");
        for (int i = 0; i < categorias.size(); i++) {
            Categoria categoria = categorias.get(i);
            System.out.printf("%d. %s - %s\n", i + 1, categoria.getNombre(), 
                categoria.getDescripcion());
        }
        
        try {
            System.out.print("\nDescripción del gasto: ");
            String descripcion = scanner.nextLine().trim();
            
            System.out.print("Monto: $");
            BigDecimal monto = new BigDecimal(scanner.nextLine().trim());
            
            System.out.print("Seleccione categoría (número): ");
            int categoriaIndex = Integer.parseInt(scanner.nextLine().trim()) - 1;
            
            if (categoriaIndex < 0 || categoriaIndex >= categorias.size()) {
                System.out.println("Error: Categoría inválida.\n");
                return;
            }
            
            Categoria categoria = categorias.get(categoriaIndex);
            Movimiento gasto = movimientoService.registrarGasto(descripcion, monto, categoria.getId());
            
            System.out.println("\nGasto registrado exitosamente:");
            System.out.printf("   Descripción: %s\n", gasto.getDescripcion());
            System.out.printf("   Monto: %s\n", gasto.getMontoFormateado());
            System.out.printf("   Categoría: %s\n", gasto.getCategoria().getNombre());
            System.out.printf("   Fecha: %s\n\n", gasto.getFechaFormateada());
            
        } catch (Exception e) {
            System.out.println("Error al registrar gasto: " + e.getMessage() + "\n");
        }
    }
    
    /**
     * Muestra el balance y estadísticas generales
     */
    private void mostrarBalanceYEstadisticas() {
        System.out.println("=== BALANCE Y ESTADISTICAS ===");
        
        try {
            BigDecimal totalIngresos = movimientoService.calcularTotalIngresos();
            BigDecimal totalGastos = movimientoService.calcularTotalGastos();
            BigDecimal balance = movimientoService.calcularBalanceTotal();
            List<Movimiento> todosMovimientos = movimientoService.obtenerTodosLosMovimientos();
            
            System.out.println("\n+--------------- RESUMEN GENERAL ---------------+");
            System.out.printf("| Total Ingresos:  %20s     |\n", String.format("$%,.2f", totalIngresos));
            System.out.printf("| Total Gastos:    %20s     |\n", String.format("$%,.2f", totalGastos));
            System.out.printf("| Balance Actual:  %20s     |\n", String.format("$%,.2f", balance));
            System.out.printf("| Movimientos:     %20d     |\n", todosMovimientos.size());
            System.out.println("+-----------------------------------------------+");
            
            System.out.println("\nEstado financiero:");
            if (balance.compareTo(BigDecimal.ZERO) > 0) {
                System.out.println("   POSITIVO - Tienes un superávit");
            } else if (balance.compareTo(BigDecimal.ZERO) < 0) {
                System.out.println("   NEGATIVO - Tienes un déficit");
            } else {
                System.out.println("   EQUILIBRADO - Ingresos = Gastos");
            }
            
            if (!todosMovimientos.isEmpty()) {
                System.out.println("\nÚltimos 3 movimientos:");
                int limite = Math.min(3, todosMovimientos.size());
                for (int i = 0; i < limite; i++) {
                    Movimiento mov = todosMovimientos.get(i);
                    String tipo = mov.getTipo() == TipoMovimiento.INGRESO ? "[ING]" : "[GAS]";
                    System.out.printf("   %s %s - %s | %s\n", 
                        tipo, mov.getFechaFormateada(), mov.getDescripcion(), 
                        mov.getMontoFormateado());
                }
            }
            
            System.out.println();
            
        } catch (Exception e) {
            System.out.println("Error al mostrar balance: " + e.getMessage() + "\n");
        }
    }
    
    /**
     * Lista todos los movimientos
     */
    private void listarMovimientos() {
        System.out.println("=== LISTA DE MOVIMIENTOS ===");
        
        try {
            List<Movimiento> movimientos = movimientoService.obtenerTodosLosMovimientos();
            
            if (movimientos.isEmpty()) {
                System.out.println("\nNo hay movimientos registrados.\n");
                return;
            }
            
            System.out.println("\nTotal de movimientos: " + movimientos.size() + "\n");
            
            for (int i = 0; i < movimientos.size(); i++) {
                Movimiento mov = movimientos.get(i);
                String tipo = mov.getTipo() == TipoMovimiento.INGRESO ? "[ING]" : "[GAS]";
                
                System.out.printf("  %d. %s %s - %s\n", i + 1, tipo, 
                    mov.getFechaFormateada(), mov.getDescripcion());
                System.out.printf("     %s | %s\n", mov.getMontoFormateado(), 
                    mov.getCategoria().getNombre());
                if (i < movimientos.size() - 1) {
                    System.out.println("     -----------------------------");
                }
            }
            
            System.out.println();
            
        } catch (Exception e) {
            System.out.println("Error al listar movimientos: " + e.getMessage() + "\n");
        }
    }
    
    /**
     * Busca movimientos (funcionalidad básica)
     */
    private void buscarMovimientos() {
        System.out.println("=== BUSCAR MOVIMIENTOS ===");
        System.out.println("\n1. Mostrar solo ingresos");
        System.out.println("2. Mostrar solo gastos");
        System.out.println("3. Mostrar todos");
        System.out.print("\nSeleccione opción: ");
        
        try {
            int opcion = Integer.parseInt(scanner.nextLine().trim());
            List<Movimiento> movimientos = movimientoService.obtenerTodosLosMovimientos();
            List<Movimiento> filtrados;
            
            switch (opcion) {
                case 1 -> filtrados = movimientos.stream()
                    .filter(m -> m.getTipo() == TipoMovimiento.INGRESO)
                    .toList();
                case 2 -> filtrados = movimientos.stream()
                    .filter(m -> m.getTipo() == TipoMovimiento.GASTO)
                    .toList();
                case 3 -> filtrados = movimientos;
                default -> {
                    System.out.println("Opción inválida.\n");
                    return;
                }
            }
            
            if (filtrados.isEmpty()) {
                System.out.println("\nNo se encontraron movimientos.\n");
                return;
            }
            
            System.out.println("\nResultados (" + filtrados.size() + " encontrados):");
            for (int i = 0; i < filtrados.size(); i++) {
                Movimiento mov = filtrados.get(i);
                String tipo = mov.getTipo() == TipoMovimiento.INGRESO ? "[ING]" : "[GAS]";
                System.out.printf("  %d. %s %s - %s\n", i + 1, tipo, 
                    mov.getFechaFormateada(), mov.getDescripcion());
                System.out.printf("     %s | %s\n", mov.getMontoFormateado(), 
                    mov.getCategoria().getNombre());
            }
            System.out.println();
            
        } catch (Exception e) {
            System.out.println("Error en la búsqueda: " + e.getMessage() + "\n");
        }
    }
    
    /**
     * Gestiona las categorías
     */
    private void gestionarCategorias() {
        System.out.println("=== GESTIONAR CATEGORIAS ===");
        System.out.println("\n1. Listar categorías");
        System.out.println("2. Crear nueva categoría");
        System.out.print("\nSeleccione opción: ");
        
        try {
            int opcion = Integer.parseInt(scanner.nextLine().trim());
            
            switch (opcion) {
                case 1 -> listarCategorias();
                case 2 -> crearCategoria();
                default -> System.out.println("Opción inválida.\n");
            }
        } catch (Exception e) {
            System.out.println("Error en gestión de categorías: " + e.getMessage() + "\n");
        }
    }
    
    /**
     * Lista todas las categorías
     */
    private void listarCategorias() {
        System.out.println("\n--- CATEGORIAS DISPONIBLES ---");
        
        List<Categoria> categorias = categoriaService.obtenerTodasLasCategorias();
        if (categorias.isEmpty()) {
            System.out.println("No hay categorías registradas.\n");
            return;
        }
        
        System.out.println("\nCategorías registradas:");
        for (Categoria categoria : categorias) {
            System.out.printf("  - %s: %s\n", categoria.getNombre(), categoria.getDescripcion());
        }
        
        System.out.println();
    }
    
    /**
     * Crea una nueva categoría
     */
    private void crearCategoria() {
        System.out.println("\n--- CREAR NUEVA CATEGORIA ---");
        
        try {
            System.out.print("Nombre de la categoría: ");
            String nombre = scanner.nextLine().trim();
            
            System.out.print("Descripción: ");
            String descripcion = scanner.nextLine().trim();
            
            Categoria nuevaCategoria = categoriaService.crearCategoria(nombre, descripcion);
            
            System.out.printf("\nCategoría '%s' creada exitosamente.\n\n", nuevaCategoria.getNombre());
            
        } catch (Exception e) {
            System.out.println("Error al crear categoría: " + e.getMessage() + "\n");
        }
    }
    
    /**
     * Muestra reportes básicos
     */
    private void mostrarReportes() {
        System.out.println("=== REPORTES Y ANALISIS ===");
        
        try {
            BigDecimal totalGastos = movimientoService.calcularTotalGastos();
            BigDecimal totalIngresos = movimientoService.calcularTotalIngresos();
            List<Movimiento> movimientos = movimientoService.obtenerTodosLosMovimientos();
            
            if (movimientos.isEmpty()) {
                System.out.println("\nNo hay movimientos registrados para generar reportes.\n");
                return;
            }
            
            System.out.printf("\nResumen financiero:");
            System.out.printf("\n   Total Ingresos:  $%,.2f", totalIngresos);
            System.out.printf("\n   Total Gastos:    $%,.2f", totalGastos);
            System.out.printf("\n   Balance:         $%,.2f", totalIngresos.subtract(totalGastos));
            
            long ingresos = movimientos.stream()
                .filter(m -> m.getTipo() == TipoMovimiento.INGRESO)
                .count();
            long gastos = movimientos.stream()
                .filter(m -> m.getTipo() == TipoMovimiento.GASTO)
                .count();
            
            System.out.printf("\n\nContadores:");
            System.out.printf("\n   Ingresos registrados: %d", ingresos);
            System.out.printf("\n   Gastos registrados: %d", gastos);
            System.out.printf("\n   Total movimientos: %d\n\n", movimientos.size());
            
        } catch (Exception e) {
            System.out.println("Error al generar reportes: " + e.getMessage() + "\n");
        }
    }
    
    /**
     * Muestra opciones de configuración
     */
    private void mostrarConfiguracion() {
        System.out.println("=== CONFIGURACION ===");
        System.out.println("\n1. Información del sistema");
        System.out.println("2. Inicializar categorías predefinidas");
        System.out.print("\nSeleccione opción: ");
        
        try {
            int opcion = Integer.parseInt(scanner.nextLine().trim());
            
            switch (opcion) {
                case 1 -> mostrarInformacionSistema();
                case 2 -> {
                    categoriaService.inicializarCategoriasPredefinidas();
                    System.out.println("Categorías predefinidas inicializadas.\n");
                }
                default -> System.out.println("Opción inválida.\n");
            }
        } catch (Exception e) {
            System.out.println("Error en configuración: " + e.getMessage() + "\n");
        }
    }
    
    /**
     * Muestra información del sistema
     */
    private void mostrarInformacionSistema() {
        System.out.println("\n--- INFORMACION DEL SISTEMA ---");
        System.out.println("Sistema: Gestor de Gastos Personales");
        System.out.println("Arquitectura: Clean Architecture");
        System.out.println("Base de datos: PostgreSQL");
        System.out.println("Framework: Spring Boot 3.2");
        System.out.println("Java: 17+");
        
        try {
            int totalCategorias = categoriaService.obtenerTodasLasCategorias().size();
            int totalMovimientos = movimientoService.obtenerTodosLosMovimientos().size();
            
            System.out.println("\nEstadísticas:");
            System.out.printf("  Categorías: %d\n", totalCategorias);
            System.out.printf("  Movimientos: %d\n", totalMovimientos);
            
        } catch (Exception e) {
            System.out.println("Error al obtener estadísticas: " + e.getMessage());
        }
        
        System.out.println();
    }
    
    /**
     * Muestra mensaje de despedida
     */
    private void mostrarDespedida() {
        System.out.println("===============================================================");
        System.out.println("              Gracias por usar el sistema");
        System.out.println("              ¡Hasta la próxima!");
        System.out.println("===============================================================");
    }
}