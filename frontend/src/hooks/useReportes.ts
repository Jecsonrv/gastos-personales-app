import { useQuery } from "@tanstack/react-query";
import { apiService } from "../services/api";
import { authService } from "../services/auth";

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
    const token = authService.getToken();

    return useQuery({
        queryKey: QUERY_KEYS.resumenFinanciero(),
        queryFn: () => apiService.getResumenFinanciero(),
        enabled: !!token,
        retry: (failureCount, error) => {
            const status = (error as { status?: number } | undefined)?.status;
            if (status === 401 || status === 403) {
                return false;
            }
            return failureCount < 3;
        },
        staleTime: 2 * 60 * 1000, // 2 minutos - datos del dashboard
    });
}

// Hook para obtener resumen mensual
export function useResumenMensual(year?: number) {
    const token = authService.getToken();

    return useQuery({
        queryKey: QUERY_KEYS.resumenMensual(year),
        queryFn: () => apiService.getResumenMensual(year),
        enabled: !!token,
        retry: (failureCount, error) => {
            const status = (error as { status?: number } | undefined)?.status;
            if (status === 401 || status === 403) {
                return false;
            }
            return failureCount < 3;
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}

// Hook para obtener resumen por categorías
export function useResumenCategorias() {
    const token = authService.getToken();

    return useQuery({
        queryKey: QUERY_KEYS.resumenCategorias(),
        queryFn: () => apiService.getResumenPorCategorias(),
        enabled: !!token,
        retry: (failureCount, error) => {
            const status = (error as { status?: number } | undefined)?.status;
            if (status === 401 || status === 403) {
                return false;
            }
            return failureCount < 3;
        },
        staleTime: 5 * 60 * 1000,
    });
}

// Hook para obtener últimos movimientos
export function useUltimosMovimientos(limit: number = 5) {
    const token = authService.getToken();

    return useQuery({
        queryKey: QUERY_KEYS.ultimosMovimientos(limit),
        queryFn: () => apiService.getUltimosMovimientos(limit),
        enabled: !!token,
        retry: (failureCount, error) => {
            const status = (error as { status?: number } | undefined)?.status;
            if (status === 401 || status === 403) {
                return false;
            }
            return failureCount < 3;
        },
        staleTime: 1 * 60 * 1000, // 1 minuto - datos frecuentemente cambiantes
    });
}
