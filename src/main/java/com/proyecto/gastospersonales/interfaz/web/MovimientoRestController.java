package com.proyecto.gastospersonales.interfaz.web;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.gastospersonales.domain.model.Movimiento;
import com.proyecto.gastospersonales.domain.model.TipoMovimiento;
import com.proyecto.gastospersonales.domain.model.Usuario;
import com.proyecto.gastospersonales.domain.service.MovimientoService;

import jakarta.servlet.http.HttpSession;

/**
 * Controlador REST para la gestión de movimientos financieros
 * Preparado para la futura implementación del frontend con React
 */
@RestController
@RequestMapping("/api/movimientos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"}) // React/Vite dev servers
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
     * Crea un nuevo movimiento (gasto o ingreso)
     */
    @PostMapping
    public ResponseEntity<Movimiento> crearMovimiento(
            @RequestBody MovimientoRequest request,
            HttpSession session) {
        try {
            Usuario usuario = (Usuario) session.getAttribute("usuario");
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            Movimiento movimiento;
            if ("GASTO".equalsIgnoreCase(request.getTipo())) {
                movimiento = movimientoService.registrarGasto(
                    request.getDescripcion(), 
                    request.getMonto(), 
                    request.getCategoriaId(), 
                    usuario.getId());
            } else if ("INGRESO".equalsIgnoreCase(request.getTipo())) {
                movimiento = movimientoService.registrarIngreso(
                    request.getDescripcion(), 
                    request.getMonto(), 
                    request.getCategoriaId(), 
                    usuario.getId());
            } else {
                return ResponseEntity.badRequest().build();
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(movimiento);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Registra un nuevo gasto
     */
    @PostMapping("/gastos")
    public ResponseEntity<Movimiento> registrarGasto(
            @RequestBody MovimientoRequest request,
            HttpSession session) {
        try {
            Usuario usuario = (Usuario) session.getAttribute("usuario");
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            Movimiento gasto = movimientoService.registrarGasto(
                request.getDescripcion(), 
                request.getMonto(), 
                request.getCategoriaId(), 
                usuario.getId());
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
            @RequestBody MovimientoRequest request,
            HttpSession session) {
        try {
            Usuario usuario = (Usuario) session.getAttribute("usuario");
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            Movimiento ingreso = movimientoService.registrarIngreso(
                request.getDescripcion(), 
                request.getMonto(), 
                request.getCategoriaId(), 
                usuario.getId());
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
    public ResponseEntity<List<Movimiento>> obtenerUltimosMovimientos(
            @RequestParam(defaultValue = "10") int limit,
            HttpSession session) {
        try {
            Usuario usuario = (Usuario) session.getAttribute("usuario");
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            List<Movimiento> movimientos = movimientoService.obtenerUltimosMovimientos(usuario.getId(), limit);
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
            @RequestBody MovimientoRequest request) {
        try {
            Movimiento movimientoActualizado = movimientoService.actualizarMovimiento(
                    id, request.getDescripcion(), request.getMonto(), request.getCategoriaId());
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