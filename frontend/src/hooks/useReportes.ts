import { useQuery } from "@tanstack/react-query";
import { apiService } from "../services/api";

// Query keys
const QUERY_KEYS = {
    resumenFinanciero: () => ["reportes", "financiero"] as const,
    resumenMensual: (year?: number) => ["reportes", "mensual", year] as const,
    resumenCategorias: () => ["reportes", "categorias"] as const,
    ultimosMovimientos: (limit: number) =>
        ["movimientos", "recientes", limit] as const,
};

// Hook para obtener resumen financiero general
export function useResumenFinanciero() {
    return useQuery({
        queryKey: QUERY_KEYS.resumenFinanciero(),
        queryFn: () => apiService.getResumenFinanciero(),
        staleTime: 2 * 60 * 1000, // 2 minutos - datos del dashboard
    });
}

// Hook para obtener resumen mensual
export function useResumenMensual(year?: number) {
    return useQuery({
        queryKey: QUERY_KEYS.resumenMensual(year),
        queryFn: () => apiService.getResumenMensual(year),
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}

// Hook para obtener resumen por categorías
export function useResumenCategorias() {
    return useQuery({
        queryKey: QUERY_KEYS.resumenCategorias(),
        queryFn: () => apiService.getResumenPorCategorias(),
        staleTime: 5 * 60 * 1000,
    });
}

// Hook para obtener últimos movimientos
export function useUltimosMovimientos(limit: number = 5) {
    return useQuery({
        queryKey: QUERY_KEYS.ultimosMovimientos(limit),
        queryFn: () => apiService.getUltimosMovimientos(limit),
        staleTime: 1 * 60 * 1000, // 1 minuto - datos frecuentemente cambiantes
    });
}
