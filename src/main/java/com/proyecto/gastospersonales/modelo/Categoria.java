package com.proyecto.gastospersonales.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Entidad que representa una categoría de gastos/ingresos
 * Ejemplos: Alimentación, Transporte, Entretenimiento, etc.
 */
@Entity
@Table(name = "categoria")
public class Categoria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre de la categoría es obligatorio")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @Column(nullable = false, unique = true, length = 50)
    private String nombre;
    
    @Size(max = 200, message = "La descripción no puede exceder 200 caracteres")
    @Column(length = 200)
    private String descripcion;
    
    @Column(name = "es_predefinida", nullable = false)
    private Boolean esPredefinida = false;
    
    // Relación uno a muchos con movimientos
    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Movimiento> movimientos = new ArrayList<>();
    
    // Constructores
    public Categoria() {}
    
    public Categoria(String nombre, String descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.esPredefinida = false;
    }
    
    public Categoria(String nombre, String descripcion, Boolean esPredefinida) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.esPredefinida = esPredefinida;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
    
    public Boolean getEsPredefinida() {
        return esPredefinida;
    }
    
    public void setEsPredefinida(Boolean esPredefinida) {
        this.esPredefinida = esPredefinida;
    }
    
    public List<Movimiento> getMovimientos() {
        return movimientos;
    }
    
    public void setMovimientos(List<Movimiento> movimientos) {
        this.movimientos = movimientos;
    }
    
    // Métodos de utilidad
    public void agregarMovimiento(Movimiento movimiento) {
        movimientos.add(movimiento);
        movimiento.setCategoria(this);
    }
    
    public void removerMovimiento(Movimiento movimiento) {
        movimientos.remove(movimiento);
        movimiento.setCategoria(null);
    }
    
    public int getCantidadMovimientos() {
        return movimientos.size();
    }
    
    // Equals y HashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Categoria categoria = (Categoria) o;
        return Objects.equals(id, categoria.id) && 
               Objects.equals(nombre, categoria.nombre);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id, nombre);
    }
    
    @Override
    public String toString() {
        return nombre;
    }
}