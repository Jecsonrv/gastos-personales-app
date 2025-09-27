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
    
    Movimiento registrarGasto(String descripcion, BigDecimal monto, Long categoriaId);
    
    Movimiento registrarIngreso(String descripcion, BigDecimal monto, Long categoriaId);
    
    List<Movimiento> obtenerTodosLosMovimientos();
    
    Optional<Movimiento> obtenerMovimientoPorId(Long id);
    
    List<Movimiento> obtenerUltimosMovimientos();
    
    List<Movimiento> obtenerMovimientosPorTipo(TipoMovimiento tipo);
    
    List<Movimiento> obtenerMovimientosPorCategoria(Long categoriaId);
    
    List<Movimiento> buscarMovimientos(String texto);
    
    BigDecimal calcularBalanceTotal();
    
    BigDecimal calcularTotalIngresos();
    
    BigDecimal calcularTotalGastos();
    
    Map<String, BigDecimal> obtenerGastosPorCategoriaDelMes();
    
    Map<String, BigDecimal> obtenerResumenMensual();
    
    Movimiento actualizarMovimiento(Long id, String nuevaDescripcion, BigDecimal nuevoMonto, Long nuevaCategoriaId);
    
    void eliminarMovimiento(Long id);
    
    List<Movimiento> obtenerMovimientosDelMes();
    
    List<Movimiento> obtenerMovimientosPorPeriodo(LocalDate inicio, LocalDate fin);
}