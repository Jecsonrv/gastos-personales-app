package com.proyecto.gastospersonales.interfaz.web;

import com.proyecto.gastospersonales.domain.service.CategoriaService;
import com.proyecto.gastospersonales.domain.model.Categoria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para la gestión de categorías
 * Preparado para la futura implementación del frontend con React
 */
@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}) // React/Vite dev servers
public class CategoriaRestController {
    
    @Autowired
    private CategoriaService categoriaService;
    
    /**
     * Obtiene todas las categorías
     */
    @GetMapping
    public ResponseEntity<List<Categoria>> obtenerTodasLasCategorias() {
        try {
            List<Categoria> categorias = categoriaService.obtenerTodasLasCategorias();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Crea una nueva categoría
     */
    @PostMapping
    public ResponseEntity<Categoria> crearCategoria(
            @RequestParam String nombre,
            @RequestParam(required = false) String descripcion) {
        try {
            Categoria nuevaCategoria = categoriaService.crearCategoria(nombre, descripcion);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCategoria);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Actualiza una categoría
     */
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizarCategoria(
            @PathVariable Long id,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String descripcion) {
        try {
            Categoria categoriaActualizada = categoriaService.actualizarCategoria(id, nombre, descripcion);
            return ResponseEntity.ok(categoriaActualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Elimina una categoría
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Long id) {
        try {
            categoriaService.eliminarCategoria(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}