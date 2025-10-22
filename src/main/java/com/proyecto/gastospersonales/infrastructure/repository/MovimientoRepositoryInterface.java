package com.proyecto.gastospersonales.infrastructure.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyecto.gastospersonales.domain.model.Categoria;
import com.proyecto.gastospersonales.domain.model.Movimiento;
import com.proyecto.gastospersonales.domain.model.TipoMovimiento;

/**
 * Interfaz del repositorio para manejar las operaciones de persistencia de Movimiento
 * Incluye consultas personalizadas para reportes y análisis financiero
 */
@Repository
public interface MovimientoRepositoryInterface extends JpaRepository<Movimiento, Long> {
    
    /**
     * Consultas por tipo de movimiento
     */
    List<Movimiento> findByTipoOrderByFechaDesc(TipoMovimiento tipo);
    
    List<Movimiento> findByTipoAndFechaBetweenOrderByFechaDesc(
            TipoMovimiento tipo, LocalDateTime fechaInicio, LocalDateTime fechaFin);
    
    /**
     * Consultas por categoría
     */
    List<Movimiento> findByCategoriaOrderByFechaDesc(Categoria categoria);
    
    List<Movimiento> findByCategoriaAndTipoOrderByFechaDesc(Categoria categoria, TipoMovimiento tipo);
    
    /**
     * Consultas por rango de fechas
     */
    List<Movimiento> findByFechaBetweenOrderByFechaDesc(LocalDateTime fechaInicio, LocalDateTime fechaFin);
    
    List<Movimiento> findByFechaAfterOrderByFechaDesc(LocalDateTime fecha);
    
    /**
     * Consultas por descripción
     */
    List<Movimiento> findByDescripcionContainingIgnoreCaseOrderByFechaDesc(String descripcion);
    
    /**
     * Consultas de suma y agregación
     */
    @Query("SELECT COALESCE(SUM(m.monto), 0) FROM Movimiento m WHERE m.tipo = :tipo")
    BigDecimal sumMontoByTipo(@Param("tipo") TipoMovimiento tipo);
    
    @Query("SELECT COALESCE(SUM(m.monto), 0) FROM Movimiento m WHERE m.tipo = :tipo AND m.fecha BETWEEN :fechaInicio AND :fechaFin")
    BigDecimal sumMontoByTipoAndFechaBetween(
            @Param("tipo") TipoMovimiento tipo, 
            @Param("fechaInicio") LocalDateTime fechaInicio, 
            @Param("fechaFin") LocalDateTime fechaFin);
    
    @Query("SELECT COALESCE(SUM(m.monto), 0) FROM Movimiento m WHERE m.categoria = :categoria AND m.tipo = :tipo")
    BigDecimal sumMontoByCategoriaAndTipo(@Param("categoria") Categoria categoria, @Param("tipo") TipoMovimiento tipo);
    
    /**
     * Consulta para balance total
     */
    @Query("SELECT COALESCE(" +
           "(SELECT SUM(m1.monto) FROM Movimiento m1 WHERE m1.tipo = 'INGRESO') - " +
           "(SELECT SUM(m2.monto) FROM Movimiento m2 WHERE m2.tipo = 'GASTO'), 0)")
    BigDecimal calcularBalanceTotal();
    
    /**
     * Consulta para balance mensual
     */
    @Query("SELECT COALESCE(" +
           "(SELECT SUM(m1.monto) FROM Movimiento m1 WHERE m1.tipo = 'INGRESO' AND m1.fecha BETWEEN :fechaInicio AND :fechaFin) - " +
           "(SELECT SUM(m2.monto) FROM Movimiento m2 WHERE m2.tipo = 'GASTO' AND m2.fecha BETWEEN :fechaInicio AND :fechaFin), 0)")
    BigDecimal calcularBalancePorPeriodo(@Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);
    
    /**
     * Consultas para reportes por categoría
     */
    @Query("SELECT m.categoria, SUM(m.monto) as total " +
           "FROM Movimiento m " +
           "WHERE m.tipo = :tipo " +
           "GROUP BY m.categoria " +
           "ORDER BY total DESC")
    List<Object[]> sumMontoByTipoGroupByCategoria(@Param("tipo") TipoMovimiento tipo);
    
    @Query("SELECT m.categoria, SUM(m.monto) as total " +
           "FROM Movimiento m " +
           "WHERE m.tipo = :tipo AND m.fecha BETWEEN :fechaInicio AND :fechaFin " +
           "GROUP BY m.categoria " +
           "ORDER BY total DESC")
    List<Object[]> sumMontoByTipoAndFechaGroupByCategoria(
            @Param("tipo") TipoMovimiento tipo, 
            @Param("fechaInicio") LocalDateTime fechaInicio, 
            @Param("fechaFin") LocalDateTime fechaFin);
    
    /**
     * Consultas estadísticas
     */
    @Query("SELECT AVG(m.monto) FROM Movimiento m WHERE m.tipo = :tipo")
    BigDecimal promedioMontoByTipo(@Param("tipo") TipoMovimiento tipo);
    
    @Query("SELECT MAX(m.monto) FROM Movimiento m WHERE m.tipo = :tipo")
    BigDecimal maxMontoByTipo(@Param("tipo") TipoMovimiento tipo);
    
    @Query("SELECT MIN(m.monto) FROM Movimiento m WHERE m.tipo = :tipo")
    BigDecimal minMontoByTipo(@Param("tipo") TipoMovimiento tipo);
    
    @Query("SELECT COUNT(m) FROM Movimiento m WHERE m.tipo = :tipo")
    long countByTipo(@Param("tipo") TipoMovimiento tipo);
    
    /**
     * Últimos movimientos
     */
    List<Movimiento> findTop10ByOrderByFechaDesc();
    
    List<Movimiento> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
    
    List<Movimiento> findTop5ByTipoOrderByMontoDesc(TipoMovimiento tipo);
    
    /**
     * Movimientos del mes actual
     */
    @Query("SELECT m FROM Movimiento m WHERE YEAR(m.fecha) = YEAR(CURRENT_DATE) AND MONTH(m.fecha) = MONTH(CURRENT_DATE) ORDER BY m.fecha DESC")
    List<Movimiento> findMovimientosDelMesActual();
    
    /**
     * Movimientos del año actual
     */
    @Query("SELECT m FROM Movimiento m WHERE YEAR(m.fecha) = YEAR(CURRENT_DATE) ORDER BY m.fecha DESC")
    List<Movimiento> findMovimientosDelAnioActual();
    
    /**
     * Consulta general ordenada por fecha
     */
    List<Movimiento> findAllByOrderByFechaDesc();
}