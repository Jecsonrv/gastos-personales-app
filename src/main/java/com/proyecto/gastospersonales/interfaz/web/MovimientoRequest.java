package com.proyecto.gastospersonales.interfaz.web;

import java.math.BigDecimal;

/**
 * DTO para recibir datos de movimientos desde el frontend
 */
public class MovimientoRequest {
    private String descripcion;
    private BigDecimal monto;
    private String tipo;
    private Long categoriaId;
    
    public MovimientoRequest() {}
    
    public MovimientoRequest(String descripcion, BigDecimal monto, String tipo, Long categoriaId) {
        this.descripcion = descripcion;
        this.monto = monto;
        this.tipo = tipo;
        this.categoriaId = categoriaId;
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
    
    public String getTipo() {
        return tipo;
    }
    
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    
    public Long getCategoriaId() {
        return categoriaId;
    }
    
    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }
}