package com.proyecto.gastospersonales.repositorio;

import com.proyecto.gastospersonales.modelo.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para manejar las operaciones de persistencia de Categoria
 * Extiende JpaRepository para obtener operaciones CRUD básicas
 */
@Repository
public interface CategoriaRepositorio extends JpaRepository<Categoria, Long> {
    
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
     * Elimina categorías que contengan el texto especificado en el nombre
     */
    @Modifying
    @Query("DELETE FROM Categoria c WHERE c.nombre LIKE %?1%")
    void deleteByNombreContaining(String texto);
    
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
     * Elimina categorías con nombres que contengan caracteres problemáticos usando SQL nativo
     */
    @Modifying
    @Query(value = "DELETE FROM categoria WHERE nombre LIKE '%??%' OR nombre LIKE '%ó%' OR nombre LIKE '%á%' OR nombre LIKE '%í%'", nativeQuery = true)
    void eliminarCategoriasConCaracteresProblematicos();
}