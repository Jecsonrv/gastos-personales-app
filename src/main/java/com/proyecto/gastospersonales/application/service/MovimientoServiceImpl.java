package com.proyecto.gastospersonales.application.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.gastospersonales.domain.model.Categoria;
import com.proyecto.gastospersonales.domain.model.Movimiento;
import com.proyecto.gastospersonales.domain.model.TipoMovimiento;
import com.proyecto.gastospersonales.domain.service.CategoriaService;
import com.proyecto.gastospersonales.domain.service.MovimientoService;
import com.proyecto.gastospersonales.infrastructure.repository.MovimientoRepositoryInterface;

/**
 * Implementación de la lógica de negocio para los movimientos financieros
 * Actúa como la capa de aplicación en Clean Architecture
 */
@Service
@Transactional
public class MovimientoServiceImpl implements MovimientoService {
    
    @Autowired
    private MovimientoRepositoryInterface movimientoRepository;
    
    @Autowired
    private CategoriaService categoriaService;
    
    /**
     * Registra un nuevo gasto
     */
    @Override
    public Movimiento registrarGasto(String descripcion, BigDecimal monto, Long categoriaId) {
        return registrarMovimiento(descripcion, monto, TipoMovimiento.GASTO, categoriaId);
    }
    
    /**
     * Registra un nuevo ingreso
     */
    @Override
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
        Categoria categoria = categoriaService.obtenerCategoriaPorId(categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
        
        // Crear el movimiento
        Movimiento movimiento = new Movimiento(
                descripcion.trim(), 
                monto.setScale(2, RoundingMode.HALF_UP), 
                tipo, 
                categoria
        );
        
        return movimientoRepository.save(movimiento);
    }
    
    /**
     * Obtiene todos los movimientos ordenados por fecha descendente
     */
    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerTodosLosMovimientos() {
        return movimientoRepository.findAllByOrderByFechaDesc();
    }
    
    /**
     * Obtiene un movimiento por ID
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Movimiento> obtenerMovimientoPorId(Long id) {
        return movimientoRepository.findById(id);
    }
    
    /**
     * Obtiene los últimos 10 movimientos
     */
    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerUltimosMovimientos() {
        return movimientoRepository.findTop10ByOrderByFechaDesc();
    }
    
    /**
     * Obtiene movimientos por tipo
     */
    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerMovimientosPorTipo(TipoMovimiento tipo) {
        return movimientoRepository.findByTipoOrderByFechaDesc(tipo);
    }
    
    /**
     * Obtiene movimientos por categoría
     */
    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerMovimientosPorCategoria(Long categoriaId) {
        Categoria categoria = categoriaService.obtenerCategoriaPorId(categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
        return movimientoRepository.findByCategoriaOrderByFechaDesc(categoria);
    }
    
    /**
     * Busca movimientos por descripción
     */
    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> buscarMovimientos(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return obtenerTodosLosMovimientos();
        }
        return movimientoRepository.findByDescripcionContainingIgnoreCaseOrderByFechaDesc(texto.trim());
    }
    
    /**
     * Calcula el balance total (ingresos - gastos)
     */
    @Override
    @Transactional(readOnly = true)
    public BigDecimal calcularBalanceTotal() {
        return movimientoRepository.calcularBalanceTotal();
    }
    
    /**
     * Calcula el total de ingresos
     */
    @Override
    @Transactional(readOnly = true)
    public BigDecimal calcularTotalIngresos() {
        return movimientoRepository.sumMontoByTipo(TipoMovimiento.INGRESO);
    }
    
    /**
     * Calcula el total de gastos
     */
    @Override
    @Transactional(readOnly = true)
    public BigDecimal calcularTotalGastos() {
        return movimientoRepository.sumMontoByTipo(TipoMovimiento.GASTO);
    }
    
    /**
     * Genera el reporte de gastos por categoría del mes actual
     */
    @Override
    @Transactional(readOnly = true)
    public Map<String, BigDecimal> obtenerGastosPorCategoriaDelMes() {
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime finMes = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);
        
        List<Object[]> resultados = movimientoRepository.sumMontoByTipoAndFechaGroupByCategoria(
                TipoMovimiento.GASTO, inicioMes, finMes);
        
        Map<String, BigDecimal> gastosPorCategoria = new LinkedHashMap<>();
        for (Object[] resultado : resultados) {
            Categoria categoria = (Categoria) resultado[0];
            BigDecimal monto = (BigDecimal) resultado[1];
            gastosPorCategoria.put(categoria.getNombre(), monto);
        }
        
        return gastosPorCategoria;
    }
    
    /**
     * Obtiene resumen mensual de movimientos
     */
    @Override
    @Transactional(readOnly = true)
    public Map<String, BigDecimal> obtenerResumenMensual() {
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime finMes = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);
        
        BigDecimal ingresosMes = movimientoRepository.sumMontoByTipoAndFechaBetween(
                TipoMovimiento.INGRESO, inicioMes, finMes);
        BigDecimal gastosMes = movimientoRepository.sumMontoByTipoAndFechaBetween(
                TipoMovimiento.GASTO, inicioMes, finMes);
        BigDecimal balance = ingresosMes.subtract(gastosMes);
        
        Map<String, BigDecimal> resumen = new LinkedHashMap<>();
        resumen.put("ingresos", ingresosMes);
        resumen.put("gastos", gastosMes);
        resumen.put("balance", balance);
        
        return resumen;
    }
    
    /**
     * Actualiza un movimiento existente
     */
    @Override
    public Movimiento actualizarMovimiento(Long id, String nuevaDescripcion, BigDecimal nuevoMonto, Long nuevaCategoriaId) {
        Movimiento movimiento = movimientoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movimiento no encontrado"));
        
        if (nuevaDescripcion != null && !nuevaDescripcion.trim().isEmpty()) {
            movimiento.setDescripcion(nuevaDescripcion.trim());
        }
        
        if (nuevoMonto != null && nuevoMonto.compareTo(BigDecimal.ZERO) > 0) {
            movimiento.setMonto(nuevoMonto.setScale(2, RoundingMode.HALF_UP));
        }
        
        if (nuevaCategoriaId != null) {
            Categoria nuevaCategoria = categoriaService.obtenerCategoriaPorId(nuevaCategoriaId)
                    .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
            movimiento.setCategoria(nuevaCategoria);
        }
        
        return movimientoRepository.save(movimiento);
    }
    
    /**
     * Elimina un movimiento
     */
    @Override
    public void eliminarMovimiento(Long id) {
        if (!movimientoRepository.existsById(id)) {
            throw new IllegalArgumentException("Movimiento no encontrado");
        }
        movimientoRepository.deleteById(id);
    }
    
    /**
     * Obtiene movimientos del mes actual
     */
    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerMovimientosDelMes() {
        return movimientoRepository.findMovimientosDelMesActual();
    }
    
    /**
     * Obtiene movimientos por período
     */
    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerMovimientosPorPeriodo(LocalDate inicio, LocalDate fin) {
        LocalDateTime fechaInicio = inicio.atStartOfDay();
        LocalDateTime fechaFin = fin.atTime(LocalTime.MAX);
        return movimientoRepository.findByFechaBetweenOrderByFechaDesc(fechaInicio, fechaFin);
    }
}