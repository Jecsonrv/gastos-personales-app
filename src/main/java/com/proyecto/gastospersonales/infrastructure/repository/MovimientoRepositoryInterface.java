package com.proyecto.gastospersonales.infrastructure.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
    List<Movimiento> findByTipoAndUsuarioIdOrderByFechaDesc(TipoMovimiento tipo, Long userId);
    
    List<Movimiento> findByTipoAndFechaBetweenAndUsuarioIdOrderByFechaDesc(
            TipoMovimiento tipo, LocalDateTime fechaInicio, LocalDateTime fechaFin, Long userId);
    
    /**
     * Consultas por categoría
     */
    List<Movimiento> findByCategoriaAndUsuarioIdOrderByFechaDesc(Categoria categoria, Long userId);
    
    List<Movimiento> findByCategoriaAndTipoAndUsuarioIdOrderByFechaDesc(Categoria categoria, TipoMovimiento tipo, Long userId);
    
    /**
     * Consultas por rango de fechas
     */
    List<Movimiento> findByFechaBetweenAndUsuarioIdOrderByFechaDesc(LocalDateTime fechaInicio, LocalDateTime fechaFin, Long userId);
    
    List<Movimiento> findByFechaAfterAndUsuarioIdOrderByFechaDesc(LocalDateTime fecha, Long userId);
    
    /**
     * Consultas por descripción
     */
    List<Movimiento> findByDescripcionContainingIgnoreCaseAndUsuarioIdOrderByFechaDesc(String descripcion, Long userId);
    
    /**
     * Consultas de suma y agregación
     */
    @Query("SELECT COALESCE(SUM(m.monto), 0) FROM Movimiento m WHERE m.tipo = :tipo AND m.usuario.id = :userId")
    BigDecimal sumMontoByTipoAndUsuarioId(@Param("tipo") TipoMovimiento tipo, @Param("userId") Long userId);
    
    @Query("SELECT COALESCE(SUM(m.monto), 0) FROM Movimiento m WHERE m.tipo = :tipo AND m.fecha BETWEEN :fechaInicio AND :fechaFin AND m.usuario.id = :userId")
    BigDecimal sumMontoByTipoAndFechaBetweenAndUsuarioId(
            @Param("tipo") TipoMovimiento tipo, 
            @Param("fechaInicio") LocalDateTime fechaInicio, 
            @Param("fechaFin") LocalDateTime fechaFin,
            @Param("userId") Long userId);
    
    @Query("SELECT COALESCE(SUM(m.monto), 0) FROM Movimiento m WHERE m.categoria = :categoria AND m.tipo = :tipo AND m.usuario.id = :userId")
    BigDecimal sumMontoByCategoriaAndTipo(@Param("categoria") Categoria categoria, @Param("tipo") TipoMovimiento tipo, @Param("userId") Long userId);
    
    /**
     * Consulta para balance total
     */
    @Query("SELECT COALESCE(" +
           "(SELECT SUM(m1.monto) FROM Movimiento m1 WHERE m1.tipo = 'INGRESO' AND m1.usuario.id = :userId) - " +
           "(SELECT SUM(m2.monto) FROM Movimiento m2 WHERE m2.tipo = 'GASTO' AND m2.usuario.id = :userId), 0)")
    BigDecimal calcularBalanceTotalByUsuarioId(@Param("userId") Long userId);
    
    /**
     * Consulta para balance mensual
     */
    @Query("SELECT COALESCE(" +
           "(SELECT SUM(m1.monto) FROM Movimiento m1 WHERE m1.tipo = 'INGRESO' AND m1.fecha BETWEEN :fechaInicio AND :fechaFin AND m1.usuario.id = :userId) - " +
           "(SELECT SUM(m2.monto) FROM Movimiento m2 WHERE m2.tipo = 'GASTO' AND m2.fecha BETWEEN :fechaInicio AND :fechaFin AND m2.usuario.id = :userId), 0)")
    BigDecimal calcularBalancePorPeriodo(@Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin, @Param("userId") Long userId);
    
    /**
     * Consultas para reportes por categoría
     */
    @Query("SELECT m.categoria, SUM(m.monto) as total " +
           "FROM Movimiento m " +
           "WHERE m.tipo = :tipo AND m.usuario.id = :userId " +
           "GROUP BY m.categoria " +
           "ORDER BY total DESC")
    List<Object[]> sumMontoByTipoGroupByCategoria(@Param("tipo") TipoMovimiento tipo, @Param("userId") Long userId);
    
    @Query("SELECT m.categoria, SUM(m.monto) as total " +
           "FROM Movimiento m " +
           "WHERE m.tipo = :tipo AND m.fecha BETWEEN :fechaInicio AND :fechaFin AND m.usuario.id = :userId " +
           "GROUP BY m.categoria " +
           "ORDER BY total DESC")
    List<Object[]> sumMontoByTipoAndFechaBetweenAndUsuarioIdGroupByCategoria(
            @Param("tipo") TipoMovimiento tipo, 
            @Param("fechaInicio") LocalDateTime fechaInicio, 
            @Param("fechaFin") LocalDateTime fechaFin,
            @Param("userId") Long userId);
    
    /**
     * Consultas estadísticas
     */
    @Query("SELECT AVG(m.monto) FROM Movimiento m WHERE m.tipo = :tipo AND m.usuario.id = :userId")
    BigDecimal promedioMontoByTipo(@Param("tipo") TipoMovimiento tipo, @Param("userId") Long userId);
    
    @Query("SELECT MAX(m.monto) FROM Movimiento m WHERE m.tipo = :tipo AND m.usuario.id = :userId")
    BigDecimal maxMontoByTipo(@Param("tipo") TipoMovimiento tipo, @Param("userId") Long userId);
    
    @Query("SELECT MIN(m.monto) FROM Movimiento m WHERE m.tipo = :tipo AND m.usuario.id = :userId")
    BigDecimal minMontoByTipo(@Param("tipo") TipoMovimiento tipo, @Param("userId") Long userId);
    
    @Query("SELECT COUNT(m) FROM Movimiento m WHERE m.tipo = :tipo AND m.usuario.id = :userId")
    long countByTipo(@Param("tipo") TipoMovimiento tipo, @Param("userId") Long userId);
    
    /**
     * Últimos movimientos
     */
    List<Movimiento> findTop10ByUsuarioIdOrderByFechaDesc(Long userId);
    
    List<Movimiento> findTop5ByTipoAndUsuarioIdOrderByMontoDesc(TipoMovimiento tipo, Long userId);
    
    /**
     * Movimientos del mes actual
     */
    @Query("SELECT m FROM Movimiento m WHERE YEAR(m.fecha) = YEAR(CURRENT_DATE) AND MONTH(m.fecha) = MONTH(CURRENT_DATE) AND m.usuario.id = :userId ORDER BY m.fecha DESC")
    List<Movimiento> findMovimientosDelMesActualByUsuarioId(@Param("userId") Long userId);
    
    /**
     * Movimientos del año actual
     */
    @Query("SELECT m FROM Movimiento m WHERE YEAR(m.fecha) = YEAR(CURRENT_DATE) AND m.usuario.id = :userId ORDER BY m.fecha DESC")
    List<Movimiento> findMovimientosDelAnioActualByUsuarioId(@Param("userId") Long userId);
    
    /**
     * Consulta general ordenada por fecha
     */
    List<Movimiento> findAllByUsuarioIdOrderByFechaDesc(Long userId);

    Optional<Movimiento> findByIdAndUsuarioId(Long id, Long userId);

    boolean existsByIdAndUsuarioId(Long id, Long userId);
}