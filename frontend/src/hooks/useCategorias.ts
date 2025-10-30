import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";
import type { CategoriaCreateDTO, CategoriaUpdateDTO } from "../types";

// Query keys
const QUERY_KEYS = {
    categorias: ["categorias"] as const,
    categoriaById: (id: number) => ["categorias", id] as const,
};

// Hook para obtener todas las categorías
export function useCategorias() {
    return useQuery({
        queryKey: QUERY_KEYS.categorias,
        queryFn: () => apiService.getCategorias(),
        staleTime: 10 * 60 * 1000, // 10 minutos - las categorías cambian menos frecuentemente
    });
}

// Hook para obtener una categoría por ID
export function useCategoria(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.categoriaById(id),
        queryFn: () => apiService.getCategoriaById(id),
        enabled: !!id,
    });
}

// Hook para crear categoría
export function useCreateCategoria() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CategoriaCreateDTO) =>
            apiService.createCategoria(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categorias });
        },
    });
}

// Hook para actualizar categoría
export function useUpdateCategoria() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CategoriaUpdateDTO) =>
            apiService.updateCategoria(data),
        onSuccess: (updatedCategoria) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categorias });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.categoriaById(updatedCategoria.id),
            });
            queryClient.invalidateQueries({ queryKey: ["movimientos"] });
        },
    });
}

// Hook para eliminar categoría
export function useDeleteCategoria() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apiService.deleteCategoria(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categorias });
            queryClient.invalidateQueries({ queryKey: ["movimientos"] });
            queryClient.invalidateQueries({ queryKey: ["reportes"] });
        },
    });
}
