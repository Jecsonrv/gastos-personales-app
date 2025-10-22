package com.proyecto.gastospersonales.interfaz.web;

/**
 * DTO para recibir datos de categorías desde el frontend
 */
public class CategoriaRequest {
    private String nombre;
    private String descripcion;
    
    public CategoriaRequest() {}
    
    public CategoriaRequest(String nombre, String descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }
    
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