package com.proyecto.gastospersonales.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

/**
 * Entidad principal que representa un movimiento financiero
 * Puede ser un gasto o un ingreso, siempre asociado a una categoría
 */
@Entity
@Table(name = "movimiento")
public class Movimiento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 3, max = 200, message = "La descripción debe tener entre 3 y 200 caracteres")
    @Column(nullable = false, length = 200)
    private String descripcion;
    
    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    @Digits(integer = 10, fraction = 2, message = "El monto debe tener máximo 10 dígitos enteros y 2 decimales")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monto;
    
    @NotNull(message = "La fecha es obligatoria")
    @PastOrPresent(message = "La fecha no puede ser futura")
    @Column(nullable = false)
    private LocalDateTime fecha;
    
    @NotNull(message = "El tipo de movimiento es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoMovimiento tipo;
    
    // Relación muchos a uno con categoría
    @NotNull(message = "La categoría es obligatoria")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;
    
    // Constructores
    public Movimiento() {
        this.fecha = LocalDateTime.now();
    }
    
    public Movimiento(String descripcion, BigDecimal monto, TipoMovimiento tipo, Categoria categoria) {
        this.descripcion = descripcion;
        this.monto = monto;
        this.tipo = tipo;
        this.categoria = categoria;
        this.fecha = LocalDateTime.now();
    }
    
    public Movimiento(String descripcion, BigDecimal monto, TipoMovimiento tipo, Categoria categoria, LocalDateTime fecha) {
        this.descripcion = descripcion;
        this.monto = monto;
        this.tipo = tipo;
        this.categoria = categoria;
        this.fecha = fecha;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public BigDecimal getMonto() {
        return monto;
    }
    
    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }
    
    public LocalDateTime getFecha() {
        return fecha;
    }
    
    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
    
    public TipoMovimiento getTipo() {
        return tipo;
    }
    
    public void setTipo(TipoMovimiento tipo) {
        this.tipo = tipo;
    }
    
    public Categoria getCategoria() {
        return categoria;
    }
    
    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
    
    // Métodos de utilidad
    public String getFechaFormateada() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return fecha.format(formatter);
    }
    
    public String getMontoFormateado() {
        return String.format("$%.2f", monto);
    }
    
    public boolean esGasto() {
        return tipo == TipoMovimiento.GASTO;
    }
    
    public boolean esIngreso() {
        return tipo == TipoMovimiento.INGRESO;
    }
    
    // Equals y HashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Movimiento that = (Movimiento) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(descripcion, that.descripcion) &&
               Objects.equals(monto, that.monto) &&
               Objects.equals(fecha, that.fecha);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id, descripcion, monto, fecha);
    }
    
    @Override
    public String toString() {
        return String.format("%s - %s - %s (%s) [%s]", 
                getFechaFormateada(), 
                descripcion, 
                getMontoFormateado(), 
                tipo.getDescripcion(), 
                categoria.getNombre());
    }
}