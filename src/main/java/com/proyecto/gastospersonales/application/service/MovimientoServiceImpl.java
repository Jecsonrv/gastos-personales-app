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
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.gastospersonales.domain.model.Categoria;
import com.proyecto.gastospersonales.domain.model.Movimiento;
import com.proyecto.gastospersonales.domain.model.TipoMovimiento;
import com.proyecto.gastospersonales.domain.model.Usuario;
import com.proyecto.gastospersonales.domain.service.CategoriaService;
import com.proyecto.gastospersonales.domain.service.MovimientoService;
import com.proyecto.gastospersonales.domain.service.UsuarioService;
import com.proyecto.gastospersonales.infrastructure.repository.MovimientoRepositoryInterface;

/**
 * Implementación de la lógica de negocio para los movimientos financieros
 * Actúa como la capa de aplicación en Clean Architecture
 */
@Service
@Transactional
public class MovimientoServiceImpl implements MovimientoService {

    private final MovimientoRepositoryInterface movimientoRepository;
    private final CategoriaService categoriaService;
    private final UsuarioService usuarioService;

    @Autowired
    public MovimientoServiceImpl(MovimientoRepositoryInterface movimientoRepository, @Lazy CategoriaService categoriaService, UsuarioService usuarioService) {
        this.movimientoRepository = movimientoRepository;
        this.categoriaService = categoriaService;
        this.usuarioService = usuarioService;
    }
    
    /**
     * Registra un nuevo gasto
     */
    @Override
    public Movimiento registrarGasto(String descripcion, BigDecimal monto, Long categoriaId, Long userId, LocalDate fecha) {
        return registrarMovimiento(descripcion, monto, TipoMovimiento.GASTO, categoriaId, userId, fecha);
    }
    
    /**
     * Registra un nuevo ingreso
     */
    @Override
    public Movimiento registrarIngreso(String descripcion, BigDecimal monto, Long categoriaId, Long userId, LocalDate fecha) {
        return registrarMovimiento(descripcion, monto, TipoMovimiento.INGRESO, categoriaId, userId, fecha);
    }
    
    /**
     * Registra un movimiento (gasto o ingreso)
     */
    private Movimiento registrarMovimiento(String descripcion, BigDecimal monto, TipoMovimiento tipo, Long categoriaId, Long userId, LocalDate fecha) {
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

        // Buscar el usuario
        Usuario usuario = usuarioService.obtenerPorId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        
        // Crear el movimiento
        Movimiento movimiento = new Movimiento(
                descripcion.trim(), 
                monto.setScale(2, RoundingMode.HALF_UP), 
                tipo, 
                categoria,
                usuario,
                fecha.atStartOfDay()
        );
        
        return movimientoRepository.save(movimiento);
    }
    
    /**
     * Obtiene todos los movimientos ordenados por fecha descendente
     */
    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerTodosLosMovimientos(Long userId) {
        return movimientoRepository.findAllByUsuarioIdOrderByFechaDesc(userId);
    }
    
    /**
     * Obtiene un movimiento por ID
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Movimiento> obtenerMovimientoPorId(Long id, Long userId) {
        return movimientoRepository.findByIdAndUsuarioId(id, userId);
    }
    
    /**
     * Obtiene los últimos 10 movimientos
     */
    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerUltimosMovimientos(Long userId) {
        return movimientoRepository.findTop10ByUsuarioIdOrderByFechaDesc(userId);
    }
    
    /**
     * Obtiene movimientos por tipo
     */
    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerMovimientosPorTipo(TipoMovimiento tipo, Long userId) {
        return movimientoRepository.findByTipoAndUsuarioIdOrderByFechaDesc(tipo, userId);
    }
    
    /**
     * Obtiene movimientos por categoría
     */
    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerMovimientosPorCategoria(Long categoriaId, Long userId) {
        Categoria categoria = categoriaService.obtenerCategoriaPorId(categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
        return movimientoRepository.findByCategoriaAndUsuarioIdOrderByFechaDesc(categoria, userId);
    }
    
    /**
     * Busca movimientos por descripción
     */
    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> buscarMovimientos(String texto, Long userId) {
        if (texto == null || texto.trim().isEmpty()) {
            return obtenerTodosLosMovimientos(userId);
        }
        return movimientoRepository.findByDescripcionContainingIgnoreCaseAndUsuarioIdOrderByFechaDesc(texto.trim(), userId);
    }
    
    /**
     * Calcula el balance total (ingresos - gastos)
     */
    @Override
    @Transactional(readOnly = true)
    public BigDecimal calcularBalanceTotal(Long userId) {
        return movimientoRepository.calcularBalanceTotalByUsuarioId(userId);
    }
    
    /**
     * Calcula el total de ingresos
     */
    @Override
    @Transactional(readOnly = true)
    public BigDecimal calcularTotalIngresos(Long userId) {
        return movimientoRepository.sumMontoByTipoAndUsuarioId(TipoMovimiento.INGRESO, userId);
    }
    
    /**
     * Calcula el total de gastos
     */
    @Override
    @Transactional(readOnly = true)
    public BigDecimal calcularTotalGastos(Long userId) {
        return movimientoRepository.sumMontoByTipoAndUsuarioId(TipoMovimiento.GASTO, userId);
    }
    
    /**
     * Genera el reporte de gastos por categoría del mes actual
     */
    @Override
    @Transactional(readOnly = true)
    public Map<String, BigDecimal> obtenerGastosPorCategoriaDelMes(Long userId) {
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime finMes = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);
        
        List<Object[]> resultados = movimientoRepository.sumMontoByTipoAndFechaBetweenAndUsuarioIdGroupByCategoria(
                TipoMovimiento.GASTO, inicioMes, finMes, userId);
        
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
    public Map<String, BigDecimal> obtenerResumenMensual(Long userId) {
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime finMes = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);
        
        BigDecimal ingresosMes = movimientoRepository.sumMontoByTipoAndFechaBetweenAndUsuarioId(
                TipoMovimiento.INGRESO, inicioMes, finMes, userId);
        BigDecimal gastosMes = movimientoRepository.sumMontoByTipoAndFechaBetweenAndUsuarioId(
                TipoMovimiento.GASTO, inicioMes, finMes, userId);
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
    public Movimiento actualizarMovimiento(Long id, String nuevaDescripcion, BigDecimal nuevoMonto, Long nuevaCategoriaId, java.time.LocalDate nuevaFecha, com.proyecto.gastospersonales.domain.model.TipoMovimiento nuevoTipo, Long userId) {
        Movimiento movimiento = movimientoRepository.findByIdAndUsuarioId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Movimiento no encontrado o no pertenece al usuario"));

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

        if (nuevaFecha != null) {
            movimiento.setFecha(nuevaFecha.atStartOfDay());
        }

        if (nuevoTipo != null) {
            movimiento.setTipo(nuevoTipo);
        }

        return movimientoRepository.save(movimiento);
    }
    
    /**
     * Elimina un movimiento
     */
    @Override
    public void eliminarMovimiento(Long id, Long userId) {
        if (!movimientoRepository.existsByIdAndUsuarioId(id, userId)) {
            throw new IllegalArgumentException("Movimiento no encontrado o no pertenece al usuario");
        }
        movimientoRepository.deleteById(id);
    }
    
    /**
     * Obtiene movimientos del mes actual
     */
    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerMovimientosDelMes(Long userId) {
        return movimientoRepository.findMovimientosDelMesActualByUsuarioId(userId);
    }
    
    /**
     * Obtiene movimientos por período
     */
    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> obtenerMovimientosPorPeriodo(LocalDate inicio, LocalDate fin, Long userId) {
        LocalDateTime fechaInicio = inicio.atStartOfDay();
        LocalDateTime fechaFin = fin.atTime(LocalTime.MAX);
        return movimientoRepository.findByFechaBetweenAndUsuarioIdOrderByFechaDesc(fechaInicio, fechaFin, userId);
    }
}