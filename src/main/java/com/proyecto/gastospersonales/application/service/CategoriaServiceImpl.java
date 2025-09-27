package com.proyecto.gastospersonales.application.service;

import com.proyecto.gastospersonales.domain.model.Categoria;
import com.proyecto.gastospersonales.domain.service.CategoriaService;
import com.proyecto.gastospersonales.infrastructure.repository.CategoriaRepositoryInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación de la lógica de negocio para las categorías
 * Actúa como la capa de aplicación en Clean Architecture
 */
@Service
@Transactional
public class CategoriaServiceImpl implements CategoriaService {
    
    @Autowired
    private CategoriaRepositoryInterface categoriaRepository;
    
    /**
     * Obtiene todas las categorías ordenadas por nombre
     */
    @Override
    @Transactional(readOnly = true)
    public List<Categoria> obtenerTodasLasCategorias() {
        return categoriaRepository.findAllByOrderByNombre();
    }
    
    /**
     * Obtiene una categoría por ID
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Categoria> obtenerCategoriaPorId(Long id) {
        return categoriaRepository.findById(id);
    }
    
    /**
     * Busca una categoría por nombre (ignora mayúsculas/minúsculas)
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Categoria> buscarCategoriaPorNombre(String nombre) {
        return categoriaRepository.findByNombreIgnoreCase(nombre);
    }
    
    /**
     * Obtiene solo las categorías predefinidas del sistema
     */
    @Override
    @Transactional(readOnly = true)
    public List<Categoria> obtenerCategoriasPredefinidas() {
        return categoriaRepository.findByEsPredefinidaOrderByNombre(true);
    }
    
    /**
     * Obtiene solo las categorías personalizadas (creadas por el usuario)
     */
    @Override
    @Transactional(readOnly = true)
    public List<Categoria> obtenerCategoriasPersonalizadas() {
        return categoriaRepository.findByEsPredefinidaOrderByNombre(false);
    }
    
    /**
     * Crea una nueva categoría validando que no exista otra con el mismo nombre
     */
    @Override
    public Categoria crearCategoria(String nombre, String descripcion) {
        // Validar que el nombre no esté vacío
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la categoría no puede estar vacío");
        }
        
        // Validar que no exista una categoría con el mismo nombre
        if (categoriaRepository.existsByNombreIgnoreCase(nombre.trim())) {
            throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + nombre);
        }
        
        // Crear la nueva categoría
        Categoria nuevaCategoria = new Categoria(nombre.trim(), descripcion);
        return categoriaRepository.save(nuevaCategoria);
    }
    
    /**
     * Actualiza una categoría existente
     */
    @Override
    public Categoria actualizarCategoria(Long id, String nuevoNombre, String nuevaDescripcion) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));
        
        // Validar el nuevo nombre si es diferente
        if (nuevoNombre != null && !nuevoNombre.trim().equals(categoria.getNombre())) {
            if (categoriaRepository.existsByNombreIgnoreCase(nuevoNombre.trim())) {
                throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + nuevoNombre);
            }
            categoria.setNombre(nuevoNombre.trim());
        }
        
        // Actualizar descripción
        if (nuevaDescripcion != null) {
            categoria.setDescripcion(nuevaDescripcion);
        }
        
        return categoriaRepository.save(categoria);
    }
    
    /**
     * Elimina una categoría si no tiene movimientos asociados
     */
    @Override
    public void eliminarCategoria(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));
        
        // Validar que no tenga movimientos asociados
        if (categoria.getCantidadMovimientos() > 0) {
            throw new IllegalArgumentException("No se puede eliminar la categoría '" + categoria.getNombre() + 
                    "' porque tiene " + categoria.getCantidadMovimientos() + " movimientos asociados");
        }
        
        categoriaRepository.delete(categoria);
    }
    
    /**
     * Busca categorías que contengan el texto especificado
     */
    @Override
    @Transactional(readOnly = true)
    public List<Categoria> buscarCategoriasPorTexto(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return obtenerTodasLasCategorias();
        }
        return categoriaRepository.findByNombreContainingIgnoreCaseOrderByNombre(texto.trim());
    }
    
    /**
     * Obtiene categorías que no tienen movimientos asociados
     */
    @Override
    @Transactional(readOnly = true)
    public List<Categoria> obtenerCategoriasVacias() {
        return categoriaRepository.findCategoriasVacias();
    }
    
    /**
     * Obtiene categorías que tienen al menos un movimiento
     */
    @Override
    @Transactional(readOnly = true)
    public List<Categoria> obtenerCategoriasConMovimientos() {
        return categoriaRepository.findCategoriasConMovimientos();
    }
    
    /**
     * Obtiene categorías apropiadas para gastos
     */
    @Override
    @Transactional(readOnly = true)
    public List<Categoria> obtenerCategoriasParaGastos() {
        List<Categoria> todasCategorias = obtenerTodasLasCategorias();
        return todasCategorias.stream()
                .filter(categoria -> !esCategoriaDeTipoIngreso(categoria.getNombre()))
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene categorías apropiadas para ingresos
     */
    @Override
    @Transactional(readOnly = true)
    public List<Categoria> obtenerCategoriasParaIngresos() {
        List<Categoria> todasCategorias = obtenerTodasLasCategorias();
        return todasCategorias.stream()
                .filter(categoria -> esCategoriaDeTipoIngreso(categoria.getNombre()))
                .collect(Collectors.toList());
    }
    
    /**
     * Verifica si existe una categoría con el nombre especificado
     */
    @Override
    @Transactional(readOnly = true)
    public boolean existeCategoriaPorNombre(String nombre) {
        return categoriaRepository.existsByNombreIgnoreCase(nombre);
    }
    
    /**
     * Inicializa las categorías predefinidas del sistema si no existen
     */
    @Override
    public void inicializarCategoriasPredefinidas() {
        String[] categoriasPredefinidas = {
                "Alimentacion", "Transporte", "Entretenimiento", 
                "Salud", "Educacion", "Servicios", "Ropa", 
                "Hogar", "Tecnologia", "Otros", "Salario",
                "Inversiones", "Negocios", "Otros Ingresos"
        };
        
        String[] descripcionesPredefinidas = {
                "Gastos relacionados con comida y bebida",
                "Gastos de movilizacion y transporte",
                "Gastos de ocio, entretenimiento y diversion",
                "Gastos medicos y de salud",
                "Gastos educativos y de formacion",
                "Servicios basicos como luz, agua, internet",
                "Gastos en vestimenta y calzado",
                "Gastos del hogar y decoracion",
                "Gastos en dispositivos y software",
                "Otros gastos no categorizados",
                "Ingresos por trabajo",
                "Ingresos por inversiones",
                "Ingresos por actividades comerciales",
                "Otros tipos de ingresos"
        };
        
        for (int i = 0; i < categoriasPredefinidas.length; i++) {
            String nombre = categoriasPredefinidas[i];
            String descripcion = descripcionesPredefinidas[i];
            
            if (!categoriaRepository.existsByNombreIgnoreCase(nombre)) {
                Categoria categoria = new Categoria(nombre, descripcion, true);
                categoriaRepository.save(categoria);
            }
        }
    }
    
    /**
     * Determina si una categoría es típicamente para ingresos
     */
    private boolean esCategoriaDeTipoIngreso(String nombreCategoria) {
        String[] categoriasIngreso = {
            "Salario", "Inversiones", "Negocios", "Otros Ingresos", "Regalos"
        };
        
        for (String categoria : categoriasIngreso) {
            if (categoria.equalsIgnoreCase(nombreCategoria)) {
                return true;
            }
        }
        return false;
    }
}