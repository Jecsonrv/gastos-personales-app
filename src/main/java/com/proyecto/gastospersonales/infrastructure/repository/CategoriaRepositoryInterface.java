package com.proyecto.gastospersonales.infrastructure.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.proyecto.gastospersonales.domain.model.Categoria;

@Repository
public interface CategoriaRepositoryInterface extends JpaRepository<Categoria, Long> {
    
    /**
     * Busca una categoría por su nombre (ignora mayúsculas/minúsculas)
     */
    Optional<Categoria> findByNombreIgnoreCase(String nombre);
    
    /**
     * Verifica si existe una categoría con el nombre dado
     */
    boolean existsByNombreIgnoreCase(String nombre);
    
    /**
     * Obtiene todas las categorías predefinidas del sistema
     */
    List<Categoria> findByEsPredefinidaOrderByNombre(Boolean esPredefinida);
    
    /**
     * Obtiene todas las categorías ordenadas por nombre
     */
    List<Categoria> findAllByOrderByNombre();
    
    /**
     * Busca categorías que contengan el texto en el nombre
     */
    List<Categoria> findByNombreContainingIgnoreCaseOrderByNombre(String texto);
    
    /**
     * Encuentra categorías por nombre exacto
     */
    List<Categoria> findByNombre(String nombre);
    
    /**
     * Obtiene categorías que no tienen movimientos asociados
     */
    @Query("SELECT c FROM Categoria c WHERE c.movimientos IS EMPTY")
    List<Categoria> findCategoriasVacias();
    
    /**
     * Obtiene categorías con al menos un movimiento
     */
    @Query("SELECT c FROM Categoria c WHERE SIZE(c.movimientos) > 0")
    List<Categoria> findCategoriasConMovimientos();
    
    /**
     * Cuenta cuántas categorías personalizadas (no predefinidas) existen
     */
    @Query("SELECT COUNT(c) FROM Categoria c WHERE c.esPredefinida = false")
    long countCategoriasPersonalizadas();
    
    /**
     * Obtiene categorías con su cantidad de movimientos
     */
    @Query("SELECT c, SIZE(c.movimientos) as cantidadMovimientos " +
           "FROM Categoria c " +
           "ORDER BY cantidadMovimientos DESC, c.nombre ASC")
    List<Object[]> findCategoriasConCantidadMovimientos();
    
    /**
     * Cuenta los movimientos asociados a una categoría específica
     */
    @Query("SELECT COUNT(m) FROM Movimiento m WHERE m.categoria.id = :categoriaId")
    long countMovimientosByCategoriaId(Long categoriaId);
}