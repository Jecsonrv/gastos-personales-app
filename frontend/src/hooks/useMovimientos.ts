import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";
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
    return useQuery<Movimiento[]>({
        queryKey: [...QUERY_KEYS.movimientos, filtros],
        queryFn: () => apiService.getMovimientos(filtros),
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}

// Hook para obtener un movimiento por ID
export function useMovimiento(id: number) {
    return useQuery<Movimiento | undefined>({
        queryKey: QUERY_KEYS.movimientoById(id),
        queryFn: () => apiService.getMovimientoById(id),
        enabled: !!id,
    });
}

// Hook para obtener últimos movimientos
export function useUltimosMovimientos(limit: number = 5) {
    return useQuery<Movimiento[]>({
        queryKey: QUERY_KEYS.ultimosMovimientos(limit),
        queryFn: () => apiService.getUltimosMovimientos(limit),
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
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.movimientos });
            queryClient.invalidateQueries({ queryKey: ["resumen"] });
            queryClient.invalidateQueries({ queryKey: ["reportes"] });
        },
        onError: (error) => {
            console.error("Error creating movimiento:", error);
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
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.movimientos });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.movimientoById(updatedMovimiento.id),
            });
            queryClient.invalidateQueries({ queryKey: ["resumen"] });
            queryClient.invalidateQueries({ queryKey: ["reportes"] });
        },
        onError: (error) => {
            console.error("Error updating movimiento:", error);
        },
    });
}

// Hook para eliminar movimiento
export function useDeleteMovimiento() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiService.deleteMovimiento(id),
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.movimientos });
            queryClient.invalidateQueries({ queryKey: ["resumen"] });
            queryClient.invalidateQueries({ queryKey: ["reportes"] });
        },
        onError: (error) => {
            console.error("Error deleting movimiento:", error);
        },
    });
}
