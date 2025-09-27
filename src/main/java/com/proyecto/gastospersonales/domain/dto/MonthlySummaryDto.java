package com.proyecto.gastospersonales.domain.dto;

import java.math.BigDecimal;

/**
 * DTO para representar resúmenes mensuales de movimientos financieros
 */
public class MonthlySummaryDto {
    private final String mes;
    private final BigDecimal ingresos;
    private final BigDecimal gastos;
    private final BigDecimal balance;

    public MonthlySummaryDto(String mes, BigDecimal ingresos, BigDecimal gastos) {
        this.mes = mes;
        this.ingresos = ingresos != null ? ingresos : BigDecimal.ZERO;
        this.gastos = gastos != null ? gastos : BigDecimal.ZERO;
        this.balance = this.ingresos.subtract(this.gastos);
    }

    public String getMes() {
        return mes;
    }

    public BigDecimal getIngresos() {
        return ingresos;
    }

    public BigDecimal getGastos() {
        return gastos;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    @Override
    public String toString() {
        return String.format("%s: Ingresos $%.2f, Gastos $%.2f, Balance $%.2f", 
                mes, ingresos, gastos, balance);
    }
}