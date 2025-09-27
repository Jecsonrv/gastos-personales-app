package com.proyecto.gastospersonales.domain.dto;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Representa el resumen de gastos agrupados por categoría.
 */
public class CategoriaResumenDto {

    private final String nombre;
    private final BigDecimal monto;
    private final BigDecimal porcentaje;

    public CategoriaResumenDto(String nombre, BigDecimal monto, BigDecimal porcentaje) {
        this.nombre = nombre;
        this.monto = monto;
        this.porcentaje = porcentaje;
    }

    public String getNombre() {
        return nombre;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public BigDecimal getPorcentaje() {
        return porcentaje;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CategoriaResumenDto that)) {
            return false;
        }
        return Objects.equals(nombre, that.nombre)
                && Objects.equals(monto, that.monto)
                && Objects.equals(porcentaje, that.porcentaje);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nombre, monto, porcentaje);
    }

    @Override
    public String toString() {
        return "CategoriaResumenDto{"
                + "nombre='" + nombre + '\''
                + ", monto=" + monto
                + ", porcentaje=" + porcentaje
                + '}';
    }
}