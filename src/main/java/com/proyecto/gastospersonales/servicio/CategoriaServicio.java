package com.proyecto.gastospersonales.servicio;

import com.proyecto.gastospersonales.modelo.Categoria;
import com.proyecto.gastospersonales.repositorio.CategoriaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Servicio que maneja la lógica de negocio para las categorías
 * Incluye validaciones y operaciones complejas
 */
@Service
@Transactional
public class CategoriaServicio {
    
    @Autowired
    private CategoriaRepositorio categoriaRepositorio;
    
    /**
     * Obtiene todas las categorías ordenadas por nombre
     */
    @Transactional(readOnly = true)
    public List<Categoria> obtenerTodasLasCategorias() {
        return categoriaRepositorio.findAllByOrderByNombre();
    }
    
    /**
     * Obtiene una categoría por ID
     */
    @Transactional(readOnly = true)
    public Optional<Categoria> obtenerCategoriaPorId(Long id) {
        return categoriaRepositorio.findById(id);
    }
    
    /**
     * Busca una categoría por nombre (ignora mayúsculas/minúsculas)
     */
    @Transactional(readOnly = true)
    public Optional<Categoria> buscarCategoriaPorNombre(String nombre) {
        return categoriaRepositorio.findByNombreIgnoreCase(nombre);
    }
    
    /**
     * Obtiene solo las categorías predefinidas del sistema
     */
    @Transactional(readOnly = true)
    public List<Categoria> obtenerCategoriasPredefinidas() {
        return categoriaRepositorio.findByEsPredefinidalOrderByNombre(true);
    }
    
    /**
     * Obtiene solo las categorías personalizadas (creadas por el usuario)
     */
    @Transactional(readOnly = true)
    public List<Categoria> obtenerCategoriasPersonalizadas() {
        return categoriaRepositorio.findByEsPredefinidalOrderByNombre(false);
    }
    
    /**
     * Crea una nueva categoría validando que no exista otra con el mismo nombre
     */
    public Categoria crearCategoria(String nombre, String descripcion) {
        // Validar que el nombre no esté vacío
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la categoría no puede estar vacío");
        }
        
        // Validar que no exista una categoría con el mismo nombre
        if (categoriaRepositorio.existsByNombreIgnoreCase(nombre.trim())) {
            throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + nombre);
        }
        
        // Crear la nueva categoría
        Categoria nuevaCategoria = new Categoria(nombre.trim(), descripcion);
        return categoriaRepositorio.save(nuevaCategoria);
    }
    
    /**
     * Actualiza una categoría existente
     */
    public Categoria actualizarCategoria(Long id, String nuevoNombre, String nuevaDescripcion) {
        Categoria categoria = categoriaRepositorio.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));
        
        // Validar que no se está intentando modificar una categoría predefinida
        if (categoria.getEsPredefinida()) {
            throw new IllegalArgumentException("No se puede modificar una categoría predefinida del sistema");
        }
        
        // Validar el nuevo nombre si es diferente al actual
        if (nuevoNombre != null && !nuevoNombre.trim().equals(categoria.getNombre())) {
            if (categoriaRepositorio.existsByNombreIgnoreCase(nuevoNombre.trim())) {
                throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + nuevoNombre);
            }
            categoria.setNombre(nuevoNombre.trim());
        }
        
        // Actualizar la descripción
        if (nuevaDescripcion != null) {
            categoria.setDescripcion(nuevaDescripcion.trim());
        }
        
        return categoriaRepositorio.save(categoria);
    }
    
    /**
     * Elimina una categoría si no tiene movimientos asociados
     */
    public void eliminarCategoria(Long id) {
        Categoria categoria = categoriaRepositorio.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));
        
        // Validar que no se está intentando eliminar una categoría predefinida
        if (categoria.getEsPredefinida()) {
            throw new IllegalArgumentException("No se puede eliminar una categoría predefinida del sistema");
        }
        
        // Validar que no tenga movimientos asociados
        if (categoria.getCantidadMovimientos() > 0) {
            throw new IllegalArgumentException("No se puede eliminar la categoría '" + categoria.getNombre() + 
                    "' porque tiene " + categoria.getCantidadMovimientos() + " movimientos asociados");
        }
        
        categoriaRepositorio.delete(categoria);
    }
    
    /**
     * Busca categorías que contengan el texto especificado
     */
    @Transactional(readOnly = true)
    public List<Categoria> buscarCategoriasPorTexto(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return obtenerTodasLasCategorias();
        }
        return categoriaRepositorio.findByNombreContainingIgnoreCaseOrderByNombre(texto.trim());
    }
    
    /**
     * Obtiene categorías que no tienen movimientos asociados
     */
    @Transactional(readOnly = true)
    public List<Categoria> obtenerCategoriasVacias() {
        return categoriaRepositorio.findCategoriasVacias();
    }
    
    /**
     * Obtiene categorías que tienen al menos un movimiento
     */
    @Transactional(readOnly = true)
    public List<Categoria> obtenerCategoriasConMovimientos() {
        return categoriaRepositorio.findCategoriasConMovimientos();
    }
    
    /**
     * Cuenta el total de categorías personalizadas
     */
    @Transactional(readOnly = true)
    public long contarCategoriasPersonalizadas() {
        return categoriaRepositorio.countCategoriasPersonalizadas();
    }
    
    /**
     * Verifica si existe una categoría con el nombre especificado
     */
    @Transactional(readOnly = true)
    public boolean existeCategoriaPorNombre(String nombre) {
        return categoriaRepositorio.existsByNombreIgnoreCase(nombre);
    }
    
    /**
     * Inicializa las categorías predefinidas del sistema si no existen
     */
    public void inicializarCategoriasPredefinidas() {
        String[] categoriasPredefinidas = {
                "Alimentación", "Transporte", "Entretenimiento", 
                "Salud", "Educación", "Otros"
        };
        
        String[] descripcionesPredefinidas = {
                "Gastos relacionados con comida y bebida",
                "Gastos de movilización y transporte",
                "Gastos de ocio, entretenimiento y diversión",
                "Gastos médicos y de salud",
                "Gastos educativos y de formación",
                "Otros gastos no categorizados"
        };
        
        for (int i = 0; i < categoriasPredefinidas.length; i++) {
            if (!existeCategoriaPorNombre(categoriasPredefinidas[i])) {
                Categoria categoria = new Categoria(
                        categoriasPredefinidas[i], 
                        descripcionesPredefinidas[i], 
                        true
                );
                categoriaRepositorio.save(categoria);
            }
        }
    }
}