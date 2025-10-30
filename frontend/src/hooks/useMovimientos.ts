import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";
import { authService } from "../services/auth";
import type {
    MovimientoCreateDTO,
    MovimientoUpdateDTO,
    FiltroMovimientos,
    Movimiento,
} from "../types";

// Query keys
const QUERY_KEYS = {
    movimientos: ["movimientos"] as const,
    movimientoById: (id: number) => ["movimientos", id] as const,
    ultimosMovimientos: (limit: number) =>
        ["movimientos", "recientes", limit] as const,
};

// Hook para obtener todos los movimientos
export function useMovimientos(filtros?: FiltroMovimientos) {
    const token = authService.getToken();

    return useQuery<Movimiento[]>({
        queryKey: [...QUERY_KEYS.movimientos, filtros],
        queryFn: () => apiService.getMovimientos(filtros),
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

// Hook para obtener un movimiento por ID
export function useMovimiento(id: number) {
    const token = authService.getToken();

    return useQuery<Movimiento | undefined>({
        queryKey: QUERY_KEYS.movimientoById(id),
        queryFn: () => apiService.getMovimientoById(id),
        enabled: !!id && !!token,
        retry: (failureCount, error) => {
            const status = (error as { status?: number } | undefined)?.status;
            if (status === 401 || status === 403) {
                return false;
            }
            return failureCount < 3;
        },
    });
}

// Hook para obtener últimos movimientos
export function useUltimosMovimientos(limit: number = 5) {
    const token = authService.getToken();

    return useQuery<Movimiento[]>({
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
        staleTime: 2 * 60 * 1000, // 2 minutos
    });
}

// Hook para crear movimiento
export function useCreateMovimiento() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: MovimientoCreateDTO) =>
            apiService.createMovimiento(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.movimientos });
            queryClient.invalidateQueries({ queryKey: ["resumen"] });
            queryClient.invalidateQueries({ queryKey: ["reportes"] });
        },
    });
}

// Hook para actualizar movimiento
export function useUpdateMovimiento() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: MovimientoUpdateDTO) =>
            apiService.updateMovimiento(data),
        onSuccess: (updatedMovimiento) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.movimientos });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.movimientoById(updatedMovimiento.id),
            });
            queryClient.invalidateQueries({ queryKey: ["resumen"] });
            queryClient.invalidateQueries({ queryKey: ["reportes"] });
        },
    });
}

// Hook para eliminar movimiento
export function useDeleteMovimiento() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiService.deleteMovimiento(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.movimientos });
            queryClient.invalidateQueries({ queryKey: ["resumen"] });
            queryClient.invalidateQueries({ queryKey: ["reportes"] });
        },
    });
}
