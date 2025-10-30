package com.proyecto.gastospersonales.interfaz.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
import com.proyecto.gastospersonales.domain.service.UsuarioService;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Controlador REST para la gestión de categorías
 * Preparado para la futura implementación del frontend con React
 */
@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}) // React/Vite dev servers
public class CategoriaRestController {
    private static final Logger logger = LoggerFactory.getLogger(CategoriaRestController.class);
    
    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private UsuarioService usuarioService;

    private Optional<com.proyecto.gastospersonales.domain.model.Usuario> getAuthenticatedUsuario(UserDetails userDetails) {
        if (userDetails == null) {
            return Optional.empty();
        }
        return usuarioService.findByUsername(userDetails.getUsername());
    }
    
    /**
     * Obtiene todas las categorías
     */
    @GetMapping
    public ResponseEntity<List<Categoria>> obtenerTodasLasCategorias(HttpServletRequest request) {
        try {
            // Debug: log incoming Authorization header and security context

            String authHeader = request.getHeader("Authorization");
            logger.info("CategoriaRestController: Authorization header='{}' for request {} {}", authHeader, request.getMethod(), request.getRequestURI());
            logger.info("CategoriaRestController: SecurityContext authentication={}", SecurityContextHolder.getContext().getAuthentication());

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
    public ResponseEntity<Object> crearCategoria(@RequestBody CategoriaRequest request) {
        try {
            Categoria nuevaCategoria = categoriaService.crearCategoria(
                request.getNombre(),
                request.getDescripcion()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCategoria);
        } catch (IllegalArgumentException e) {
            // Return the validation message to client for better UX/debugging
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Clase interna para solicitud de creación de categoría
     */
    public static class CategoriaRequest {
        private String nombre;
        private String descripcion;

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public String getDescripcion() {
            return descripcion;
        }

        public void setDescripcion(String descripcion) {
            this.descripcion = descripcion;
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
    public ResponseEntity<?> eliminarCategoria(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return getAuthenticatedUsuario(userDetails)
                .map(usuario -> {
                    try {
                        categoriaService.eliminarCategoria(id, usuario.getId());
                        return ResponseEntity.noContent().build();
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().build();
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}