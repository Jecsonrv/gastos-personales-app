package com.proyecto.gastospersonales.servicio;

import com.proyecto.gastospersonales.modelo.Categoria;
import com.proyecto.gastospersonales.modelo.Movimiento;
import com.proyecto.gastospersonales.modelo.TipoMovimiento;
import com.proyecto.gastospersonales.repositorio.MovimientoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

/**
 * Servicio que maneja la lógica de negocio para los movimientos financieros
 * Incluye cálculos de balance, reportes y estadísticas
 */
@Service
@Transactional
public class MovimientoServicio {
    
    @Autowired
    private MovimientoRepositorio movimientoRepositorio;
    
    @Autowired
    private CategoriaServicio categoriaServicio;
    
    /**
     * Registra un nuevo gasto
     */
    public Movimiento registrarGasto(String descripcion, BigDecimal monto, Long categoriaId) {
        return registrarMovimiento(descripcion, monto, TipoMovimiento.GASTO, categoriaId);
    }
    
    /**
     * Registra un nuevo ingreso
     */
    public Movimiento registrarIngreso(String descripcion, BigDecimal monto, Long categoriaId) {
        return registrarMovimiento(descripcion, monto, TipoMovimiento.INGRESO, categoriaId);
    }
    
    /**
     * Registra un movimiento (gasto o ingreso)
     */
    private Movimiento registrarMovimiento(String descripcion, BigDecimal monto, TipoMovimiento tipo, Long categoriaId) {
        // Validar parámetros
        if (descripcion == null || descripcion.trim().length() < 3) {
            throw new IllegalArgumentException("La descripción debe tener al menos 3 caracteres");
        }
        
        if (monto == null || monto.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a 0");
        }
        
        if (categoriaId == null) {
            throw new IllegalArgumentException("Debe seleccionar una categoría");
        }
        
        // Buscar la categoría
        Categoria categoria = categoriaServicio.obtenerCategoriaPorId(categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
        
        // Crear el movimiento
        Movimiento movimiento = new Movimiento(
                descripcion.trim(), 
                monto.setScale(2, RoundingMode.HALF_UP), 
                tipo, 
                categoria
        );
        
        return movimientoRepositorio.save(movimiento);
    }
    
    /**
     * Obtiene todos los movimientos ordenados por fecha descendente
     */
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerTodosLosMovimientos() {
        return movimientoRepositorio.findAll()
                .stream()
                .sorted((m1, m2) -> m2.getFecha().compareTo(m1.getFecha()))
                .toList();
    }
    
    /**
     * Obtiene un movimiento por ID
     */
    @Transactional(readOnly = true)
    public Optional<Movimiento> obtenerMovimientoPorId(Long id) {
        return movimientoRepositorio.findById(id);
    }
    
    /**
     * Obtiene los últimos 10 movimientos
     */
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerUltimosMovimientos() {
        return movimientoRepositorio.findTop10ByOrderByFechaDesc();
    }
    
    /**
     * Obtiene movimientos por tipo
     */
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerMovimientosPorTipo(TipoMovimiento tipo) {
        return movimientoRepositorio.findByTipoOrderByFechaDesc(tipo);
    }
    
    /**
     * Obtiene movimientos por categoría
     */
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerMovimientosPorCategoria(Long categoriaId) {
        Categoria categoria = categoriaServicio.obtenerCategoriaPorId(categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
        return movimientoRepositorio.findByCategoriaOrderByFechaDesc(categoria);
    }
    
    /**
     * Busca movimientos por descripción
     */
    @Transactional(readOnly = true)
    public List<Movimiento> buscarMovimientos(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return obtenerTodosLosMovimientos();
        }
        return movimientoRepositorio.findByDescripcionContainingIgnoreCaseOrderByFechaDesc(texto.trim());
    }
    
    /**
     * Calcula el balance total (ingresos - gastos)
     */
    @Transactional(readOnly = true)
    public BigDecimal calcularBalanceTotal() {
        return movimientoRepositorio.calcularBalanceTotal();
    }
    
    /**
     * Calcula el balance del mes actual
     */
    @Transactional(readOnly = true)
    public BigDecimal calcularBalanceDelMes() {
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime finMes = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);
        return movimientoRepositorio.calcularBalancePorPeriodo(inicioMes, finMes);
    }
    
    /**
     * Obtiene el total de ingresos
     */
    @Transactional(readOnly = true)
    public BigDecimal obtenerTotalIngresos() {
        return movimientoRepositorio.sumMontoByTipo(TipoMovimiento.INGRESO);
    }
    
    /**
     * Obtiene el total de gastos
     */
    @Transactional(readOnly = true)
    public BigDecimal obtenerTotalGastos() {
        return movimientoRepositorio.sumMontoByTipo(TipoMovimiento.GASTO);
    }
    
    /**
     * Obtiene el total de ingresos del mes actual
     */
    @Transactional(readOnly = true)
    public BigDecimal obtenerTotalIngresosDelMes() {
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime finMes = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);
        return movimientoRepositorio.sumMontoByTipoAndFechaBetween(TipoMovimiento.INGRESO, inicioMes, finMes);
    }
    
    /**
     * Obtiene el total de gastos del mes actual
     */
    @Transactional(readOnly = true)
    public BigDecimal obtenerTotalGastosDelMes() {
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime finMes = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);
        return movimientoRepositorio.sumMontoByTipoAndFechaBetween(TipoMovimiento.GASTO, inicioMes, finMes);
    }
    
    /**
     * Genera el reporte de gastos por categoría del mes actual
     */
    @Transactional(readOnly = true)
    public Map<String, BigDecimal> obtenerGastosPorCategoriaDelMes() {
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime finMes = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);
        
        List<Object[]> resultados = movimientoRepositorio.sumMontoByTipoAndFechaGroupByCategoria(
                TipoMovimiento.GASTO, inicioMes, finMes);
        
        Map<String, BigDecimal> gastosPorCategoria = new LinkedHashMap<>();
        for (Object[] resultado : resultados) {
            Categoria categoria = (Categoria) resultado[0];
            BigDecimal total = (BigDecimal) resultado[1];
            gastosPorCategoria.put(categoria.getNombre(), total);
        }
        
        return gastosPorCategoria;
    }
    
    /**
     * Genera estadísticas básicas
     */
    @Transactional(readOnly = true)
    public Map<String, Object> obtenerEstadisticas() {
        Map<String, Object> estadisticas = new HashMap<>();
        
        // Totales generales
        estadisticas.put("totalIngresos", obtenerTotalIngresos());
        estadisticas.put("totalGastos", obtenerTotalGastos());
        estadisticas.put("balanceTotal", calcularBalanceTotal());
        
        // Totales del mes
        estadisticas.put("ingresosDelMes", obtenerTotalIngresosDelMes());
        estadisticas.put("gastosDelMes", obtenerTotalGastosDelMes());
        estadisticas.put("balanceDelMes", calcularBalanceDelMes());
        
        // Promedios
        BigDecimal promedioGastos = movimientoRepositorio.promedioMontoByTipo(TipoMovimiento.GASTO);
        BigDecimal promedioIngresos = movimientoRepositorio.promedioMontoByTipo(TipoMovimiento.INGRESO);
        estadisticas.put("promedioGastos", promedioGastos != null ? promedioGastos : BigDecimal.ZERO);
        estadisticas.put("promedioIngresos", promedioIngresos != null ? promedioIngresos : BigDecimal.ZERO);
        
        // Máximos y mínimos
        BigDecimal maxGasto = movimientoRepositorio.maxMontoByTipo(TipoMovimiento.GASTO);
        BigDecimal maxIngreso = movimientoRepositorio.maxMontoByTipo(TipoMovimiento.INGRESO);
        estadisticas.put("mayorGasto", maxGasto != null ? maxGasto : BigDecimal.ZERO);
        estadisticas.put("mayorIngreso", maxIngreso != null ? maxIngreso : BigDecimal.ZERO);
        
        // Cantidades
        estadisticas.put("cantidadGastos", movimientoRepositorio.countByTipo(TipoMovimiento.GASTO));
        estadisticas.put("cantidadIngresos", movimientoRepositorio.countByTipo(TipoMovimiento.INGRESO));
        
        return estadisticas;
    }
    
    /**
     * Genera el reporte mensual completo
     */
    @Transactional(readOnly = true)
    public String generarReporteMensual() {
        StringBuilder reporte = new StringBuilder();
        LocalDate fechaActual = LocalDate.now();
        String mesAnio = fechaActual.getMonth().getDisplayName(TextStyle.FULL, Locale.of("es")) + " " + fechaActual.getYear();
        
        reporte.append("======= REPORTE ").append(mesAnio.toUpperCase()).append(" =======\n");
        
        BigDecimal ingresos = obtenerTotalIngresosDelMes();
        BigDecimal gastos = obtenerTotalGastosDelMes();
        BigDecimal balance = calcularBalanceDelMes();
        
        reporte.append(String.format("Total Ingresos: $%.2f\n", ingresos));
        reporte.append(String.format("Total Gastos:   $%.2f\n", gastos));
        reporte.append(String.format("Balance:        $%.2f\n\n", balance));
        
        // Gastos por categoría
        Map<String, BigDecimal> gastosPorCategoria = obtenerGastosPorCategoriaDelMes();
        if (!gastosPorCategoria.isEmpty()) {
            reporte.append("GASTOS POR CATEGORÍA:\n");
            BigDecimal totalGastosCategoria = gastosPorCategoria.values().stream()
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            for (Map.Entry<String, BigDecimal> entry : gastosPorCategoria.entrySet()) {
                BigDecimal porcentaje = totalGastosCategoria.compareTo(BigDecimal.ZERO) > 0 
                        ? entry.getValue().multiply(BigDecimal.valueOf(100)).divide(totalGastosCategoria, 1, RoundingMode.HALF_UP)
                        : BigDecimal.ZERO;
                reporte.append(String.format("- %-15s $%.2f (%.1f%%)\n", 
                        entry.getKey() + ":", entry.getValue(), porcentaje));
            }
        }
        
        return reporte.toString();
    }
    
    /**
     * Actualiza un movimiento existente
     */
    public Movimiento actualizarMovimiento(Long id, String nuevaDescripcion, BigDecimal nuevoMonto, Long nuevaCategoriaId) {
        Movimiento movimiento = movimientoRepositorio.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movimiento no encontrado"));
        
        if (nuevaDescripcion != null && nuevaDescripcion.trim().length() >= 3) {
            movimiento.setDescripcion(nuevaDescripcion.trim());
        }
        
        if (nuevoMonto != null && nuevoMonto.compareTo(BigDecimal.ZERO) > 0) {
            movimiento.setMonto(nuevoMonto.setScale(2, RoundingMode.HALF_UP));
        }
        
        if (nuevaCategoriaId != null) {
            Categoria nuevaCategoria = categoriaServicio.obtenerCategoriaPorId(nuevaCategoriaId)
                    .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
            movimiento.setCategoria(nuevaCategoria);
        }
        
        return movimientoRepositorio.save(movimiento);
    }
    
    /**
     * Elimina un movimiento
     */
    public void eliminarMovimiento(Long id) {
        if (!movimientoRepositorio.existsById(id)) {
            throw new IllegalArgumentException("Movimiento no encontrado");
        }
        movimientoRepositorio.deleteById(id);
    }
    
    /**
     * Obtiene movimientos del mes actual
     */
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerMovimientosDelMes() {
        return movimientoRepositorio.findMovimientosDelMesActual();
    }
}