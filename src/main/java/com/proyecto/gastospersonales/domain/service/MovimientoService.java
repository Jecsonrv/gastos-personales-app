package com.proyecto.gastospersonales.domain.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.proyecto.gastospersonales.domain.model.Movimiento;
import com.proyecto.gastospersonales.domain.model.TipoMovimiento;

/**
 * Interfaz del servicio de dominio para movimientos
 * Define las operaciones de negocio relacionadas con movimientos financieros
 */
public interface MovimientoService {
    
    Movimiento registrarGasto(String descripcion, BigDecimal monto, Long categoriaId, Long userId, LocalDate fecha);
    
    Movimiento registrarIngreso(String descripcion, BigDecimal monto, Long categoriaId, Long userId, LocalDate fecha);
    
    List<Movimiento> obtenerTodosLosMovimientos(Long userId);
    
    Optional<Movimiento> obtenerMovimientoPorId(Long id, Long userId);
    
    List<Movimiento> obtenerUltimosMovimientos(Long userId);
    
    List<Movimiento> obtenerMovimientosPorTipo(TipoMovimiento tipo, Long userId);
    
    List<Movimiento> obtenerMovimientosPorCategoria(Long categoriaId, Long userId);
    
    List<Movimiento> buscarMovimientos(String texto, Long userId);
    
    BigDecimal calcularBalanceTotal(Long userId);
    
    BigDecimal calcularTotalIngresos(Long userId);
    
    BigDecimal calcularTotalGastos(Long userId);
    
    Map<String, BigDecimal> obtenerGastosPorCategoriaDelMes(Long userId);
    
    Map<String, BigDecimal> obtenerResumenMensual(Long userId);
    
    Movimiento actualizarMovimiento(Long id, String nuevaDescripcion, BigDecimal nuevoMonto, Long nuevaCategoriaId, java.time.LocalDate nuevaFecha, com.proyecto.gastospersonales.domain.model.TipoMovimiento nuevoTipo, Long userId);
    
    void eliminarMovimiento(Long id, Long userId);
    
    List<Movimiento> obtenerMovimientosDelMes(Long userId);
    
    List<Movimiento> obtenerMovimientosPorPeriodo(LocalDate inicio, LocalDate fin, Long userId);
}