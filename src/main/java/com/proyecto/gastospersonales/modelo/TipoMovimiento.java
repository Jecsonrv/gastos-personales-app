package com.proyecto.gastospersonales.modelo;

/**
 * Enumeración que define los tipos de movimientos financieros
 * INGRESO: Para salarios, bonos, ingresos extra, etc.
 * GASTO: Para todos los gastos y compras
 */
public enum TipoMovimiento {
    INGRESO("Ingreso"),
    GASTO("Gasto");
    
    private final String descripcion;
    
    TipoMovimiento(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    @Override
    public String toString() {
        return descripcion;
    }
}