package com.proyecto.gastospersonales.interfaz.web;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.gastospersonales.domain.model.Movimiento;
import com.proyecto.gastospersonales.domain.model.TipoMovimiento;
import com.proyecto.gastospersonales.domain.model.Usuario;
import com.proyecto.gastospersonales.domain.service.MovimientoService;
import com.proyecto.gastospersonales.domain.service.UsuarioService;

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

    @Autowired
    private UsuarioService usuarioService;

    private Optional<Usuario> getAuthenticatedUsuario(UserDetails userDetails) {
        if (userDetails == null) {
            return Optional.empty();
        }
        return usuarioService.findByUsername(userDetails.getUsername());
    }

    /**
     * Obtiene todos los movimientos
     */
    @GetMapping
    public ResponseEntity<List<Movimiento>> obtenerTodosLosMovimientos(@AuthenticationPrincipal UserDetails userDetails) {
        return getAuthenticatedUsuario(userDetails)
                .<ResponseEntity<List<Movimiento>>>map(usuario -> {
                    try {
                        List<Movimiento> movimientos = movimientoService.obtenerTodosLosMovimientos(usuario.getId());
                        return ResponseEntity.ok(movimientos);
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
    
    /**
     * Obtiene un movimiento por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Movimiento> obtenerMovimientoPorId(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return getAuthenticatedUsuario(userDetails)
                .<ResponseEntity<Movimiento>>map(usuario -> {
                    try {
                        Optional<Movimiento> movimiento = movimientoService.obtenerMovimientoPorId(id, usuario.getId());

                        return movimiento.map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
    
    /**
     * Registra un nuevo gasto
     */
    @PostMapping("/gastos")
    public ResponseEntity<?> registrarGasto(
            @RequestParam String descripcion,
            @RequestParam BigDecimal monto,
            @RequestParam Long categoriaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @AuthenticationPrincipal UserDetails userDetails) {
        return getAuthenticatedUsuario(userDetails)
                .map(usuario -> {
                    try {
                        Movimiento gasto = movimientoService.registrarGasto(descripcion, monto, categoriaId, usuario.getId(), fecha);

                        return ResponseEntity.status(HttpStatus.CREATED).body(gasto);
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error al registrar gasto"));
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Token inválido")));
    }
    
    /**
     * Registra un nuevo ingreso
     */
    @PostMapping("/ingresos")
    public ResponseEntity<?> registrarIngreso(
            @RequestParam String descripcion,
            @RequestParam BigDecimal monto,
            @RequestParam Long categoriaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @AuthenticationPrincipal UserDetails userDetails) {
        return getAuthenticatedUsuario(userDetails)
                .map(usuario -> {
                    try {
                        Movimiento ingreso = movimientoService.registrarIngreso(descripcion, monto, categoriaId, usuario.getId(), fecha);

                        return ResponseEntity.status(HttpStatus.CREATED).body(ingreso);
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error al registrar ingreso"));
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Token inválido")));
    }
    
    /**
     * Obtiene movimientos por tipo
     */
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Movimiento>> obtenerMovimientosPorTipo(@PathVariable TipoMovimiento tipo, @AuthenticationPrincipal UserDetails userDetails) {
        return getAuthenticatedUsuario(userDetails)
                .<ResponseEntity<List<Movimiento>>>map(usuario -> {
                    try {
                        List<Movimiento> movimientos = movimientoService.obtenerMovimientosPorTipo(tipo, usuario.getId());

                        return ResponseEntity.ok(movimientos);
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
    
    /**
     * Busca movimientos por texto
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Movimiento>> buscarMovimientos(@RequestParam String q, @AuthenticationPrincipal UserDetails userDetails) {
        return getAuthenticatedUsuario(userDetails)
                .<ResponseEntity<List<Movimiento>>>map(usuario -> {
                    try {
                        List<Movimiento> movimientos = movimientoService.buscarMovimientos(q, usuario.getId());

                        return ResponseEntity.ok(movimientos);
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
    
    /**
     * Obtiene estadísticas generales
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas(@AuthenticationPrincipal UserDetails userDetails) {
        return getAuthenticatedUsuario(userDetails)
                .<ResponseEntity<Map<String, Object>>>map(usuario -> {
                    try {
                        Map<String, Object> estadisticas = Map.of(
                                "totalIngresos", movimientoService.calcularTotalIngresos(usuario.getId()),
                                "totalGastos", movimientoService.calcularTotalGastos(usuario.getId()),
                                "balance", movimientoService.calcularBalanceTotal(usuario.getId()),
                                "resumenMensual", movimientoService.obtenerResumenMensual(usuario.getId()),
                                "gastosPorCategoria", movimientoService.obtenerGastosPorCategoriaDelMes(usuario.getId())
                        );
                        return ResponseEntity.ok(estadisticas);
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
    
    /**
     * Obtiene los últimos movimientos
     */
    @GetMapping("/recientes")
    public ResponseEntity<List<Movimiento>> obtenerUltimosMovimientos(@AuthenticationPrincipal UserDetails userDetails) {
        return getAuthenticatedUsuario(userDetails)
                .<ResponseEntity<List<Movimiento>>>map(usuario -> {
                    try {
                        List<Movimiento> movimientos = movimientoService.obtenerUltimosMovimientos(usuario.getId());

                        return ResponseEntity.ok(movimientos);
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
    
    /**
     * Actualiza un movimiento
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarMovimiento(
            @PathVariable Long id,
            @RequestParam(required = false) String descripcion,
            @RequestParam(required = false) BigDecimal monto,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam(required = false) TipoMovimiento tipo,
            @AuthenticationPrincipal UserDetails userDetails) {
        return getAuthenticatedUsuario(userDetails)
                .map(usuario -> {
                    try {
                        Movimiento movimientoActualizado = movimientoService.actualizarMovimiento(
                                id, descripcion, monto, categoriaId, fecha, tipo, usuario.getId());
                        return ResponseEntity.ok(movimientoActualizado);
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error al actualizar movimiento"));
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Token inválido")));
    }
    
    /**
     * Elimina un movimiento
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarMovimiento(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return getAuthenticatedUsuario(userDetails)
                .map(usuario -> {
                    try {
                        movimientoService.eliminarMovimiento(id, usuario.getId());
                        return ResponseEntity.noContent().build();
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error al eliminar movimiento"));
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Token inválido")));
    }
}