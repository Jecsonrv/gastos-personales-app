package com.proyecto.gastospersonales.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Utilidad para limpiar datos problemáticos en la base de datos
 * 
 * NOTA: Esta clase fue utilizada durante el desarrollo para resolver problemas
 * de categorías duplicadas con caracteres de codificación. Ya cumplió su propósito
 * pero se mantiene para futuras tareas de mantenimiento si fuera necesario.
 * 
 * Para usar: Descomentar la llamada en GastosPersonalesApplication.inicializarDatos()
 */
@Component
public class LimpiadorBaseDatos {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    /**
     * Ejecuta la limpieza agresiva de categorías duplicadas
     */
    @Transactional
    public void ejecutarLimpiezaAgresiva() {
        try {
            System.out.println("🧹 INICIANDO LIMPIEZA AGRESIVA DE BASE DE DATOS...");
            
            // Mostrar categorías ANTES
            System.out.println("\n=== CATEGORÍAS ANTES DE LA LIMPIEZA ===");
            List<Map<String, Object>> categoriasAntes = jdbcTemplate.queryForList(
                "SELECT id, nombre, es_predefinida FROM categoria ORDER BY nombre"
            );
            for (Map<String, Object> cat : categoriasAntes) {
                System.out.println("ID: " + cat.get("id") + " | Nombre: '" + cat.get("nombre") + "' | Predefinida: " + cat.get("es_predefinida"));
            }
            
            // Eliminar por IDs específicos de las categorías problemáticas
            System.out.println("\n🗑️ Eliminando categorías problemáticas por ID específico...");
            int[] idsProblematicos = {1, 4, 9}; // Alimentaci??n, Educaci??n, Tecnolog??a
            
            for (int id : idsProblematicos) {
                try {
                    int deleted = jdbcTemplate.update("DELETE FROM categoria WHERE id = ?", id);
                    if (deleted > 0) {
                        System.out.println("✅ Eliminada categoría con ID: " + id);
                    } else {
                        System.out.println("⚠️ No se encontró categoría con ID: " + id);
                    }
                } catch (Exception e) {
                    System.err.println("❌ Error al eliminar ID " + id + ": " + e.getMessage());
                }
            }
            
            // Verificar si hay duplicados por nombre similar (ignorando case)
            System.out.println("\n� Buscando y eliminando duplicados por similitud...");
            
            // Buscar duplicados de Alimentacion
            List<Map<String, Object>> alimentacionDuplicados = jdbcTemplate.queryForList(
                "SELECT id, nombre FROM categoria WHERE LOWER(nombre) LIKE '%alimentac%' ORDER BY id"
            );
            eliminarDuplicadosMantenientoMenorId(alimentacionDuplicados, "Alimentacion");
            
            // Buscar duplicados de Educacion  
            List<Map<String, Object>> educacionDuplicados = jdbcTemplate.queryForList(
                "SELECT id, nombre FROM categoria WHERE LOWER(nombre) LIKE '%educac%' ORDER BY id"
            );
            eliminarDuplicadosMantenientoMenorId(educacionDuplicados, "Educacion");
            
            // Buscar duplicados de Tecnologia
            List<Map<String, Object>> tecnologiaDuplicados = jdbcTemplate.queryForList(
                "SELECT id, nombre FROM categoria WHERE LOWER(nombre) LIKE '%tecnolog%' ORDER BY id"
            );
            eliminarDuplicadosMantenientoMenorId(tecnologiaDuplicados, "Tecnologia");
            
            // Mostrar categorías DESPUÉS
            System.out.println("\n=== CATEGORÍAS DESPUÉS DE LA LIMPIEZA ===");
            List<Map<String, Object>> categoriasDespues = jdbcTemplate.queryForList(
                "SELECT id, nombre, es_predefinida FROM categoria ORDER BY nombre"
            );
            for (Map<String, Object> cat : categoriasDespues) {
                System.out.println("ID: " + cat.get("id") + " | Nombre: '" + cat.get("nombre") + "' | Predefinida: " + cat.get("es_predefinida"));
            }
            
            // Contar total
            int total = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM categoria", Integer.class);
            System.out.println("\n✅ LIMPIEZA COMPLETADA. Total de categorías: " + total);
            
        } catch (Exception e) {
            System.err.println("❌ Error durante la limpieza agresiva: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * Elimina duplicados manteniendo solo el de menor ID
     */
    private void eliminarDuplicadosMantenientoMenorId(List<Map<String, Object>> duplicados, String categoria) {
        if (duplicados.size() > 1) {
            System.out.println("🔧 Procesando duplicados de " + categoria + ": " + duplicados.size() + " encontrados");
            
            // Mantener el primero (menor ID) y eliminar el resto
            for (int i = 1; i < duplicados.size(); i++) {
                Integer id = (Integer) duplicados.get(i).get("id");
                String nombre = (String) duplicados.get(i).get("nombre");
                try {
                    int deleted = jdbcTemplate.update("DELETE FROM categoria WHERE id = ?", id);
                    if (deleted > 0) {
                        System.out.println("🗑️ Eliminado duplicado - ID: " + id + ", Nombre: '" + nombre + "'");
                    }
                } catch (Exception e) {
                    System.err.println("❌ Error al eliminar duplicado ID " + id + ": " + e.getMessage());
                }
            }
        }
    }
}