package com.proyecto.gastospersonales.interfaz.web;

import com.proyecto.gastospersonales.domain.service.MovimientoService;
import com.proyecto.gastospersonales.domain.model.Movimiento;
import com.proyecto.gastospersonales.domain.model.TipoMovimiento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controlador REST para la gestión de movimientos financieros
 * Preparado para la futura implementación del frontend con React
 */
@RestController
@RequestMapping("/api/movimientos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}) // React/Vite dev servers
public class MovimientoRestController {
    
    @Autowired
    private MovimientoService movimientoService;
    
    /**
     * Obtiene todos los movimientos
     */
    @GetMapping
    public ResponseEntity<List<Movimiento>> obtenerTodosLosMovimientos() {
        try {
            List<Movimiento> movimientos = movimientoService.obtenerTodosLosMovimientos();
            return ResponseEntity.ok(movimientos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene un movimiento por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Movimiento> obtenerMovimientoPorId(@PathVariable Long id) {
        try {
            Optional<Movimiento> movimiento = movimientoService.obtenerMovimientoPorId(id);
            return movimiento.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Registra un nuevo gasto
     */
    @PostMapping("/gastos")
    public ResponseEntity<Movimiento> registrarGasto(
            @RequestParam String descripcion,
            @RequestParam BigDecimal monto,
            @RequestParam Long categoriaId) {
        try {
            Movimiento gasto = movimientoService.registrarGasto(descripcion, monto, categoriaId);
            return ResponseEntity.status(HttpStatus.CREATED).body(gasto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Registra un nuevo ingreso
     */
    @PostMapping("/ingresos")
    public ResponseEntity<Movimiento> registrarIngreso(
            @RequestParam String descripcion,
            @RequestParam BigDecimal monto,
            @RequestParam Long categoriaId) {
        try {
            Movimiento ingreso = movimientoService.registrarIngreso(descripcion, monto, categoriaId);
            return ResponseEntity.status(HttpStatus.CREATED).body(ingreso);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene movimientos por tipo
     */
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Movimiento>> obtenerMovimientosPorTipo(@PathVariable TipoMovimiento tipo) {
        try {
            List<Movimiento> movimientos = movimientoService.obtenerMovimientosPorTipo(tipo);
            return ResponseEntity.ok(movimientos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Busca movimientos por texto
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Movimiento>> buscarMovimientos(@RequestParam String q) {
        try {
            List<Movimiento> movimientos = movimientoService.buscarMovimientos(q);
            return ResponseEntity.ok(movimientos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene estadísticas generales
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        try {
            Map<String, Object> estadisticas = Map.of(
                "totalIngresos", movimientoService.calcularTotalIngresos(),
                "totalGastos", movimientoService.calcularTotalGastos(),
                "balance", movimientoService.calcularBalanceTotal(),
                "resumenMensual", movimientoService.obtenerResumenMensual(),
                "gastosPorCategoria", movimientoService.obtenerGastosPorCategoriaDelMes()
            );
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene los últimos movimientos
     */
    @GetMapping("/recientes")
    public ResponseEntity<List<Movimiento>> obtenerUltimosMovimientos() {
        try {
            List<Movimiento> movimientos = movimientoService.obtenerUltimosMovimientos();
            return ResponseEntity.ok(movimientos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Actualiza un movimiento
     */
    @PutMapping("/{id}")
    public ResponseEntity<Movimiento> actualizarMovimiento(
            @PathVariable Long id,
            @RequestParam(required = false) String descripcion,
            @RequestParam(required = false) BigDecimal monto,
            @RequestParam(required = false) Long categoriaId) {
        try {
            Movimiento movimientoActualizado = movimientoService.actualizarMovimiento(
                    id, descripcion, monto, categoriaId);
            return ResponseEntity.ok(movimientoActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Elimina un movimiento
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMovimiento(@PathVariable Long id) {
        try {
            movimientoService.eliminarMovimiento(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}