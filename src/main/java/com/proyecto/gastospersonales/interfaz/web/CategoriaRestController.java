package com.proyecto.gastospersonales.interfaz.web;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import com.proyecto.gastospersonales.domain.model.Categoria;
import com.proyecto.gastospersonales.domain.service.CategoriaService;

/**
 * Controlador REST para la gestión de categorías
 * Preparado para la futura implementación del frontend con React
 */
@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true") // React/Vite dev servers
public class CategoriaRestController {
    
    @Autowired
    private CategoriaService categoriaService;
    private static final Logger logger = LoggerFactory.getLogger(CategoriaRestController.class);
    
    /**
     * Obtiene todas las categorías
     */
    @GetMapping
    public ResponseEntity<List<Categoria>> obtenerTodasLasCategorias() {
        try {
            List<Categoria> categorias = categoriaService.obtenerTodasLasCategorias();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            logger.error("Error obteniendo todas las categorias", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene una categoría por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerCategoriaPorId(@PathVariable Long id) {
        try {
            Optional<Categoria> categoria = categoriaService.obtenerCategoriaPorId(id);
            return categoria.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error obteniendo categoria por id {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene categorías predefinidas
     */
    @GetMapping("/predefinidas")
    public ResponseEntity<List<Categoria>> obtenerCategoriasPredefinidas() {
        try {
            List<Categoria> categorias = categoriaService.obtenerCategoriasPredefinidas();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            logger.error("Error obteniendo categorias predefinidas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene categorías personalizadas
     */
    @GetMapping("/personalizadas")
    public ResponseEntity<List<Categoria>> obtenerCategoriasPersonalizadas() {
        try {
            List<Categoria> categorias = categoriaService.obtenerCategoriasPersonalizadas();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            logger.error("Error obteniendo categorias personalizadas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene categorías para gastos
     */
    @GetMapping("/gastos")
    public ResponseEntity<List<Categoria>> obtenerCategoriasParaGastos() {
        try {
            List<Categoria> categorias = categoriaService.obtenerCategoriasParaGastos();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            logger.error("Error obteniendo categorias para gastos", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene categorías para ingresos
     */
    @GetMapping("/ingresos")
    public ResponseEntity<List<Categoria>> obtenerCategoriasParaIngresos() {
        try {
            List<Categoria> categorias = categoriaService.obtenerCategoriasParaIngresos();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            logger.error("Error obteniendo categorias para ingresos", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Crea una nueva categoría
     */
    @PostMapping
    public ResponseEntity<?> crearCategoria(@RequestBody CategoriaRequest request) {
        try {
            // Validar datos de entrada
            if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre de la categoría es requerido"));
            }
            
            Categoria nuevaCategoria = categoriaService.crearCategoria(request.getNombre(), request.getDescripcion());
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCategoria);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error al crear categoria con payload: {}", request, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error interno del servidor"));
        }
    }
    
    /**
     * Busca categorías por texto
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Categoria>> buscarCategorias(@RequestParam String q) {
        try {
            List<Categoria> categorias = categoriaService.buscarCategoriasPorTexto(q);
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            logger.error("Error buscando categorias con texto: {}", q, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene categorías vacías (sin movimientos)
     */
    @GetMapping("/vacias")
    public ResponseEntity<List<Categoria>> obtenerCategoriasVacias() {
        try {
            List<Categoria> categorias = categoriaService.obtenerCategoriasVacias();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            logger.error("Error obteniendo categorias vacias", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene categorías con movimientos
     */
    @GetMapping("/con-movimientos")
    public ResponseEntity<List<Categoria>> obtenerCategoriasConMovimientos() {
        try {
            List<Categoria> categorias = categoriaService.obtenerCategoriasConMovimientos();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            logger.error("Error obteniendo categorias con movimientos", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Actualiza una categoría
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCategoria(
            @PathVariable Long id,
            @RequestBody CategoriaRequest request) {
        try {
            // Validar ID
            if (id == null || id <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "ID de categoría inválido"));
            }
            
            // Validar datos de entrada
            if (request.getNombre() != null && request.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre de la categoría no puede estar vacío"));
            }
            
            Categoria categoriaActualizada = categoriaService.actualizarCategoria(
                id, request.getNombre(), request.getDescripcion());
            return ResponseEntity.ok(categoriaActualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error al actualizar categoria id={}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error interno del servidor"));
        }
    }
    
    /**
     * Elimina una categoría
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCategoria(@PathVariable Long id) {
        try {
            // Validar ID
            if (id == null || id <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "ID de categoría inválido"));
            }
            
            categoriaService.eliminarCategoria(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error al eliminar categoria id={}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error interno del servidor: " + e.getMessage()));
        }
    }
}