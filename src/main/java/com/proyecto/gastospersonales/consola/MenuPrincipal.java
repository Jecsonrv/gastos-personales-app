package com.proyecto.gastospersonales.consola;

import com.proyecto.gastospersonales.modelo.Categoria;
import com.proyecto.gastospersonales.modelo.Movimiento;
import com.proyecto.gastospersonales.modelo.TipoMovimiento;
import com.proyecto.gastospersonales.servicio.CategoriaServicio;
import com.proyecto.gastospersonales.servicio.MovimientoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

/**
 * Interfaz de consola para el Gestor de Compras Personales
 * Maneja toda la interacción con el usuario a través de menús
 */
@Component
public class MenuPrincipal {
    
    @Autowired
    private MovimientoServicio movimientoServicio;
    
    @Autowired
    private CategoriaServicio categoriaServicio;
    
    private Scanner scanner;
    
    public MenuPrincipal() {
        this.scanner = new Scanner(System.in);
    }
    
    /**
     * Ejecuta el menú principal de la aplicación
     */
    public void ejecutar() {
        mostrarBienvenida();
        
        int opcion;
        do {
            mostrarMenuPrincipal();
            opcion = leerOpcion();
            procesarOpcion(opcion);
        } while (opcion != 0);
        
        mostrarDespedida();
    }
    
    private void mostrarBienvenida() {
        limpiarPantalla();
        System.out.println("╔══════════════════════════════════════╗");
        System.out.println("║    GESTOR DE COMPRAS PERSONALES      ║");
        System.out.println("║         Control Financiero           ║");
        System.out.println("╚══════════════════════════════════════╝");
        System.out.println();
        pausar();
    }
    
    private void mostrarMenuPrincipal() {
        limpiarPantalla();
        System.out.println("======================================");
        System.out.println("    GESTOR DE COMPRAS PERSONALES");
        System.out.println("======================================");
        System.out.println("1. Registrar Gasto");
        System.out.println("2. Registrar Ingreso");
        System.out.println("3. Ver Balance Actual");
        System.out.println("4. Listar Todos los Movimientos");
        System.out.println("5. Ver Movimientos por Categoría");
        System.out.println("6. Generar Reporte Mensual");
        System.out.println("7. Gestionar Categorías");
        System.out.println("8. Buscar Movimientos");
        System.out.println("9. Estadísticas");
        System.out.println("0. Salir");
        System.out.println("======================================");
        System.out.print("Seleccione una opción: ");
    }
    
    private int leerOpcion() {
        try {
            return Integer.parseInt(scanner.nextLine().trim());
        } catch (NumberFormatException e) {
            return -1;
        }
    }
    
    private void procesarOpcion(int opcion) {
        try {
            switch (opcion) {
                case 1 -> registrarGasto();
                case 2 -> registrarIngreso();
                case 3 -> mostrarBalance();
                case 4 -> listarTodosLosMovimientos();
                case 5 -> verMovimientosPorCategoria();
                case 6 -> generarReporteMensual();
                case 7 -> gestionarCategorias();
                case 8 -> buscarMovimientos();
                case 9 -> mostrarEstadisticas();
                case 0 -> System.out.println("Saliendo del sistema...");
                default -> {
                    System.out.println("❌ Opción no válida. Por favor, seleccione una opción del 0 al 9.");
                    pausar();
                }
            }
        } catch (Exception e) {
            System.out.println("❌ Error: " + e.getMessage());
            pausar();
        }
    }
    
    private void registrarGasto() {
        limpiarPantalla();
        System.out.println("=== REGISTRAR NUEVO GASTO ===");
        
        System.out.print("Descripción: ");
        String descripcion = scanner.nextLine().trim();
        
        System.out.print("Monto: $");
        BigDecimal monto;
        try {
            monto = new BigDecimal(scanner.nextLine().trim());
        } catch (NumberFormatException e) {
            System.out.println("❌ Monto inválido.");
            pausar();
            return;
        }
        
        // Mostrar categorías disponibles
        List<Categoria> categorias = categoriaServicio.obtenerTodasLasCategorias();
        if (categorias.isEmpty()) {
            System.out.println("❌ No hay categorías disponibles. Creando categorías predefinidas...");
            categoriaServicio.inicializarCategoriasPredefinidas();
            categorias = categoriaServicio.obtenerTodasLasCategorias();
        }
        
        System.out.println("\nCategorías disponibles:");
        for (int i = 0; i < categorias.size(); i++) {
            System.out.printf("%d. %s\n", i + 1, categorias.get(i).getNombre());
        }
        
        System.out.print("Seleccione categoría: ");
        int opcionCategoria;
        try {
            opcionCategoria = Integer.parseInt(scanner.nextLine().trim());
            if (opcionCategoria < 1 || opcionCategoria > categorias.size()) {
                System.out.println("❌ Opción de categoría inválida.");
                pausar();
                return;
            }
        } catch (NumberFormatException e) {
            System.out.println("❌ Opción de categoría inválida.");
            pausar();
            return;
        }
        
        Categoria categoriaSeleccionada = categorias.get(opcionCategoria - 1);
        
        try {
            Movimiento gasto = movimientoServicio.registrarGasto(descripcion, monto, categoriaSeleccionada.getId());
            System.out.println("\n✅ Gasto registrado exitosamente");
            System.out.println("Fecha: " + gasto.getFechaFormateada());
            System.out.println("Descripción: " + gasto.getDescripcion());
            System.out.println("Monto: " + gasto.getMontoFormateado());
            System.out.println("Categoría: " + gasto.getCategoria().getNombre());
        } catch (Exception e) {
            System.out.println("❌ Error al registrar el gasto: " + e.getMessage());
        }
        
        pausar();
    }
    
    private void registrarIngreso() {
        limpiarPantalla();
        System.out.println("=== REGISTRAR NUEVO INGRESO ===");
        
        System.out.print("Descripción: ");
        String descripcion = scanner.nextLine().trim();
        
        System.out.print("Monto: $");
        BigDecimal monto;
        try {
            monto = new BigDecimal(scanner.nextLine().trim());
        } catch (NumberFormatException e) {
            System.out.println("❌ Monto inválido.");
            pausar();
            return;
        }
        
        // Para ingresos, usar categoría "Otros" por defecto o permitir selección
        List<Categoria> categorias = categoriaServicio.obtenerTodasLasCategorias();
        System.out.println("\nCategorías disponibles:");
        for (int i = 0; i < categorias.size(); i++) {
            System.out.printf("%d. %s\n", i + 1, categorias.get(i).getNombre());
        }
        
        System.out.print("Seleccione categoría (o Enter para 'Otros'): ");
        String inputCategoria = scanner.nextLine().trim();
        
        Categoria categoriaSeleccionada;
        if (inputCategoria.isEmpty()) {
            categoriaSeleccionada = categorias.stream()
                    .filter(c -> c.getNombre().equalsIgnoreCase("Otros"))
                    .findFirst()
                    .orElse(categorias.get(0));
        } else {
            try {
                int opcionCategoria = Integer.parseInt(inputCategoria);
                if (opcionCategoria < 1 || opcionCategoria > categorias.size()) {
                    System.out.println("❌ Opción de categoría inválida.");
                    pausar();
                    return;
                }
                categoriaSeleccionada = categorias.get(opcionCategoria - 1);
            } catch (NumberFormatException e) {
                System.out.println("❌ Opción de categoría inválida.");
                pausar();
                return;
            }
        }
        
        try {
            Movimiento ingreso = movimientoServicio.registrarIngreso(descripcion, monto, categoriaSeleccionada.getId());
            System.out.println("\n✅ Ingreso registrado exitosamente");
            System.out.println("Fecha: " + ingreso.getFechaFormateada());
            System.out.println("Descripción: " + ingreso.getDescripcion());
            System.out.println("Monto: " + ingreso.getMontoFormateado());
            System.out.println("Categoría: " + ingreso.getCategoria().getNombre());
        } catch (Exception e) {
            System.out.println("❌ Error al registrar el ingreso: " + e.getMessage());
        }
        
        pausar();
    }
    
    private void mostrarBalance() {
        limpiarPantalla();
        System.out.println("=== BALANCE FINANCIERO ===");
        
        try {
            BigDecimal totalIngresos = movimientoServicio.obtenerTotalIngresos();
            BigDecimal totalGastos = movimientoServicio.obtenerTotalGastos();
            BigDecimal balanceTotal = movimientoServicio.calcularBalanceTotal();
            
            BigDecimal ingresosDelMes = movimientoServicio.obtenerTotalIngresosDelMes();
            BigDecimal gastosDelMes = movimientoServicio.obtenerTotalGastosDelMes();
            BigDecimal balanceDelMes = movimientoServicio.calcularBalanceDelMes();
            
            System.out.println("BALANCE GENERAL:");
            System.out.printf("Total Ingresos: $%.2f\n", totalIngresos);
            System.out.printf("Total Gastos:   $%.2f\n", totalGastos);
            System.out.printf("Balance Total:  $%.2f\n", balanceTotal);
            
            System.out.println("\nBALANCE DEL MES ACTUAL:");
            System.out.printf("Ingresos del mes: $%.2f\n", ingresosDelMes);
            System.out.printf("Gastos del mes:   $%.2f\n", gastosDelMes);
            System.out.printf("Balance del mes:  $%.2f\n", balanceDelMes);
            
            if (balanceDelMes.compareTo(BigDecimal.ZERO) > 0) {
                System.out.println("🟢 ¡Vas bien este mes!");
            } else if (balanceDelMes.compareTo(BigDecimal.ZERO) < 0) {
                System.out.println("🔴 Ten cuidado, estás gastando más de lo que ingresas este mes.");
            } else {
                System.out.println("🟡 Este mes tienes un balance neutro.");
            }
            
        } catch (Exception e) {
            System.out.println("❌ Error al calcular el balance: " + e.getMessage());
        }
        
        pausar();
    }
    
    private void listarTodosLosMovimientos() {
        limpiarPantalla();
        System.out.println("=== TODOS LOS MOVIMIENTOS ===");
        
        try {
            List<Movimiento> movimientos = movimientoServicio.obtenerTodosLosMovimientos();
            
            if (movimientos.isEmpty()) {
                System.out.println("No hay movimientos registrados.");
            } else {
                System.out.printf("%-3s %-19s %-30s %-12s %-10s %-15s\n", 
                        "ID", "Fecha", "Descripción", "Monto", "Tipo", "Categoría");
                System.out.println("─".repeat(95));
                
                for (Movimiento movimiento : movimientos) {
                    String tipoIcon = movimiento.getTipo() == TipoMovimiento.INGRESO ? "⬆️" : "⬇️";
                    System.out.printf("%-3d %-19s %-30s %-12s %-10s %-15s\n",
                            movimiento.getId(),
                            movimiento.getFechaFormateada(),
                            truncar(movimiento.getDescripcion(), 28),
                            movimiento.getMontoFormateado(),
                            tipoIcon + movimiento.getTipo(),
                            truncar(movimiento.getCategoria().getNombre(), 13));
                }
                
                System.out.println("\nTotal de movimientos: " + movimientos.size());
            }
        } catch (Exception e) {
            System.out.println("❌ Error al listar movimientos: " + e.getMessage());
        }
        
        pausar();
    }
    
    private void verMovimientosPorCategoria() {
        limpiarPantalla();
        System.out.println("=== MOVIMIENTOS POR CATEGORÍA ===");
        
        try {
            List<Categoria> categorias = categoriaServicio.obtenerTodasLasCategorias();
            
            if (categorias.isEmpty()) {
                System.out.println("No hay categorías disponibles.");
                pausar();
                return;
            }
            
            System.out.println("Categorías disponibles:");
            for (int i = 0; i < categorias.size(); i++) {
                System.out.printf("%d. %s\n", i + 1, categorias.get(i).getNombre());
            }
            
            System.out.print("Seleccione una categoría: ");
            int opcion = Integer.parseInt(scanner.nextLine().trim());
            
            if (opcion < 1 || opcion > categorias.size()) {
                System.out.println("❌ Opción inválida.");
                pausar();
                return;
            }
            
            Categoria categoriaSeleccionada = categorias.get(opcion - 1);
            List<Movimiento> movimientos = movimientoServicio.obtenerMovimientosPorCategoria(categoriaSeleccionada.getId());
            
            limpiarPantalla();
            System.out.println("=== MOVIMIENTOS - " + categoriaSeleccionada.getNombre().toUpperCase() + " ===");
            
            if (movimientos.isEmpty()) {
                System.out.println("No hay movimientos en esta categoría.");
            } else {
                for (Movimiento movimiento : movimientos) {
                    System.out.println(movimiento.toString());
                }
                System.out.println("\nTotal de movimientos: " + movimientos.size());
            }
            
        } catch (Exception e) {
            System.out.println("❌ Error: " + e.getMessage());
        }
        
        pausar();
    }
    
    private void generarReporteMensual() {
        limpiarPantalla();
        System.out.println("=== REPORTE MENSUAL ===");
        
        try {
            String reporte = movimientoServicio.generarReporteMensual();
            System.out.println(reporte);
        } catch (Exception e) {
            System.out.println("❌ Error al generar el reporte: " + e.getMessage());
        }
        
        pausar();
    }
    
    private void gestionarCategorias() {
        int opcion;
        do {
            limpiarPantalla();
            System.out.println("=== GESTIÓN DE CATEGORÍAS ===");
            System.out.println("1. Ver todas las categorías");
            System.out.println("2. Crear nueva categoría");
            System.out.println("3. Buscar categoría");
            System.out.println("0. Volver al menú principal");
            System.out.print("Seleccione una opción: ");
            
            opcion = leerOpcion();
            
            switch (opcion) {
                case 1 -> verTodasLasCategorias();
                case 2 -> crearNuevaCategoria();
                case 3 -> buscarCategoria();
                case 0 -> { /* Volver */ }
                default -> {
                    System.out.println("❌ Opción no válida.");
                    pausar();
                }
            }
        } while (opcion != 0);
    }
    
    private void verTodasLasCategorias() {
        limpiarPantalla();
        System.out.println("=== TODAS LAS CATEGORÍAS ===");
        
        try {
            List<Categoria> categorias = categoriaServicio.obtenerTodasLasCategorias();
            
            if (categorias.isEmpty()) {
                System.out.println("No hay categorías registradas.");
            } else {
                System.out.printf("%-5s %-20s %-30s %-15s %-10s\n", 
                        "ID", "Nombre", "Descripción", "Predefinida", "Movimientos");
                System.out.println("─".repeat(85));
                
                for (Categoria categoria : categorias) {
                    System.out.printf("%-5d %-20s %-30s %-15s %-10d\n",
                            categoria.getId(),
                            categoria.getNombre(),
                            truncar(categoria.getDescripcion() != null ? categoria.getDescripcion() : "", 28),
                            categoria.getEsPredefinida() ? "Sí" : "No",
                            categoria.getCantidadMovimientos());
                }
                
                System.out.println("\nTotal de categorías: " + categorias.size());
            }
        } catch (Exception e) {
            System.out.println("❌ Error al listar categorías: " + e.getMessage());
        }
        
        pausar();
    }
    
    private void crearNuevaCategoria() {
        limpiarPantalla();
        System.out.println("=== CREAR NUEVA CATEGORÍA ===");
        
        System.out.print("Nombre de la categoría: ");
        String nombre = scanner.nextLine().trim();
        
        System.out.print("Descripción (opcional): ");
        String descripcion = scanner.nextLine().trim();
        if (descripcion.isEmpty()) {
            descripcion = null;
        }
        
        try {
            Categoria nuevaCategoria = categoriaServicio.crearCategoria(nombre, descripcion);
            System.out.println("✅ Categoría creada exitosamente:");
            System.out.println("ID: " + nuevaCategoria.getId());
            System.out.println("Nombre: " + nuevaCategoria.getNombre());
            System.out.println("Descripción: " + (nuevaCategoria.getDescripcion() != null ? nuevaCategoria.getDescripcion() : "Sin descripción"));
        } catch (Exception e) {
            System.out.println("❌ Error al crear la categoría: " + e.getMessage());
        }
        
        pausar();
    }
    
    private void buscarCategoria() {
        limpiarPantalla();
        System.out.println("=== BUSCAR CATEGORÍA ===");
        
        System.out.print("Texto a buscar: ");
        String texto = scanner.nextLine().trim();
        
        try {
            List<Categoria> categorias = categoriaServicio.buscarCategoriasPorTexto(texto);
            
            if (categorias.isEmpty()) {
                System.out.println("No se encontraron categorías que coincidan con '" + texto + "'.");
            } else {
                System.out.println("Categorías encontradas:");
                for (Categoria categoria : categorias) {
                    System.out.printf("- %s (ID: %d) - %d movimientos\n", 
                            categoria.getNombre(), 
                            categoria.getId(), 
                            categoria.getCantidadMovimientos());
                }
            }
        } catch (Exception e) {
            System.out.println("❌ Error al buscar categorías: " + e.getMessage());
        }
        
        pausar();
    }
    
    private void buscarMovimientos() {
        limpiarPantalla();
        System.out.println("=== BUSCAR MOVIMIENTOS ===");
        
        System.out.print("Texto a buscar en descripción: ");
        String texto = scanner.nextLine().trim();
        
        try {
            List<Movimiento> movimientos = movimientoServicio.buscarMovimientos(texto);
            
            if (movimientos.isEmpty()) {
                System.out.println("No se encontraron movimientos que coincidan con '" + texto + "'.");
            } else {
                System.out.println("Movimientos encontrados:");
                for (Movimiento movimiento : movimientos) {
                    System.out.println(movimiento.toString());
                }
                System.out.println("\nTotal encontrados: " + movimientos.size());
            }
        } catch (Exception e) {
            System.out.println("❌ Error al buscar movimientos: " + e.getMessage());
        }
        
        pausar();
    }
    
    private void mostrarEstadisticas() {
        limpiarPantalla();
        System.out.println("=== ESTADÍSTICAS FINANCIERAS ===");
        
        try {
            Map<String, Object> estadisticas = movimientoServicio.obtenerEstadisticas();
            
            System.out.println("TOTALES GENERALES:");
            System.out.printf("Total Ingresos:     $%.2f\n", (BigDecimal) estadisticas.get("totalIngresos"));
            System.out.printf("Total Gastos:       $%.2f\n", (BigDecimal) estadisticas.get("totalGastos"));
            System.out.printf("Balance Total:      $%.2f\n", (BigDecimal) estadisticas.get("balanceTotal"));
            
            System.out.println("\nESTADÍSTICAS DEL MES:");
            System.out.printf("Ingresos del mes:   $%.2f\n", (BigDecimal) estadisticas.get("ingresosDelMes"));
            System.out.printf("Gastos del mes:     $%.2f\n", (BigDecimal) estadisticas.get("gastosDelMes"));
            System.out.printf("Balance del mes:    $%.2f\n", (BigDecimal) estadisticas.get("balanceDelMes"));
            
            System.out.println("\nPROMEDIOS:");
            System.out.printf("Promedio gastos:    $%.2f\n", (BigDecimal) estadisticas.get("promedioGastos"));
            System.out.printf("Promedio ingresos:  $%.2f\n", (BigDecimal) estadisticas.get("promedioIngresos"));
            
            System.out.println("\nRECORDS:");
            System.out.printf("Mayor gasto:        $%.2f\n", (BigDecimal) estadisticas.get("mayorGasto"));
            System.out.printf("Mayor ingreso:      $%.2f\n", (BigDecimal) estadisticas.get("mayorIngreso"));
            
            System.out.println("\nCANTIDADES:");
            System.out.printf("Total gastos:       %d\n", (Long) estadisticas.get("cantidadGastos"));
            System.out.printf("Total ingresos:     %d\n", (Long) estadisticas.get("cantidadIngresos"));
            
        } catch (Exception e) {
            System.out.println("❌ Error al obtener estadísticas: " + e.getMessage());
        }
        
        pausar();
    }
    
    // Métodos de utilidad
    private void limpiarPantalla() {
        System.out.print("\033[H\033[2J");
        System.out.flush();
    }
    
    private void pausar() {
        System.out.println("\nPresione Enter para continuar...");
        scanner.nextLine();
    }
    
    private void mostrarDespedida() {
        limpiarPantalla();
        System.out.println("╔══════════════════════════════════════╗");
        System.out.println("║     ¡Gracias por usar el sistema!   ║");
        System.out.println("║    Gestor de Compras Personales     ║");
        System.out.println("╚══════════════════════════════════════╝");
    }
    
    private String truncar(String texto, int longitud) {
        if (texto == null) return "";
        return texto.length() > longitud ? texto.substring(0, longitud - 3) + "..." : texto;
    }
}