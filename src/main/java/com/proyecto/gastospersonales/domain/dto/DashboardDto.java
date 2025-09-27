package com.proyecto.gastospersonales.domain.dto;

import java.math.BigDecimal;

/**
 * DTO para el dashboard con información resumida
 */
public class DashboardDto {
    private final BigDecimal totalIngresos;
    private final BigDecimal totalGastos;
    private final BigDecimal balance;
    private final int totalMovimientos;
    private final BigDecimal ingresosDelMes; 
    private final BigDecimal gastosDelMes;
    private final BigDecimal balanceDelMes;

    public DashboardDto(BigDecimal totalIngresos, BigDecimal totalGastos, 
                       int totalMovimientos, BigDecimal ingresosDelMes, BigDecimal gastosDelMes) {
        this.totalIngresos = totalIngresos != null ? totalIngresos : BigDecimal.ZERO;
        this.totalGastos = totalGastos != null ? totalGastos : BigDecimal.ZERO;
        this.totalMovimientos = totalMovimientos;
        this.ingresosDelMes = ingresosDelMes != null ? ingresosDelMes : BigDecimal.ZERO;
        this.gastosDelMes = gastosDelMes != null ? gastosDelMes : BigDecimal.ZERO;
        this.balance = this.totalIngresos.subtract(this.totalGastos);
        this.balanceDelMes = this.ingresosDelMes.subtract(this.gastosDelMes);
    }

    public BigDecimal getTotalIngresos() {
        return totalIngresos;
    }

    public BigDecimal getTotalGastos() {
        return totalGastos;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public int getTotalMovimientos() {
        return totalMovimientos;
    }

    public BigDecimal getIngresosDelMes() {
        return ingresosDelMes;
    }

    public BigDecimal getGastosDelMes() {
        return gastosDelMes;
    }

    public BigDecimal getBalanceDelMes() {
        return balanceDelMes;
    }
}