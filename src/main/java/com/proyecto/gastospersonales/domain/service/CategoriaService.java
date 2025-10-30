package com.proyecto.gastospersonales.domain.service;

import java.util.List;
import java.util.Optional;

import com.proyecto.gastospersonales.domain.model.Categoria;

/**
 * Interfaz del servicio de dominio para categorías
 * Define las operaciones de negocio relacionadas con categorías
 */
public interface CategoriaService {
    
    List<Categoria> obtenerTodasLasCategorias();
    
    Optional<Categoria> obtenerCategoriaPorId(Long id);
    
    Optional<Categoria> buscarCategoriaPorNombre(String nombre);
    
    List<Categoria> obtenerCategoriasPredefinidas();
    
    List<Categoria> obtenerCategoriasPersonalizadas();
    
    Categoria crearCategoria(String nombre, String descripcion);
    
    Categoria actualizarCategoria(Long id, String nuevoNombre, String nuevaDescripcion);
    
    void eliminarCategoria(Long id, Long userId);
    
    List<Categoria> buscarCategoriasPorTexto(String texto);
    
    List<Categoria> obtenerCategoriasVacias();
    
    List<Categoria> obtenerCategoriasConMovimientos();
    
    List<Categoria> obtenerCategoriasParaGastos();
    
    List<Categoria> obtenerCategoriasParaIngresos();
    
    boolean existeCategoriaPorNombre(String nombre);
    
    void inicializarCategoriasPredefinidas();
}