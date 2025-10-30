import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";
import { authService } from "../services/auth";
import type { Usuario, ChangePasswordRequest } from "../types";
import { useAuth } from "./useAuth";

// Query keys
const QUERY_KEYS = {
    profile: ["profile"] as const,
};

// Hook para obtener el perfil del usuario
export function useProfile() {
    const token = authService.getToken();

    return useQuery<Usuario>({
        queryKey: QUERY_KEYS.profile,
        queryFn: () => {
            console.log("Fetching profile...");
            return apiService.getProfile();
        },
        enabled: !!token,
        retry: (failureCount, error) => {
            const status = (error as { status?: number } | undefined)?.status;
            if (status === 401 || status === 403) {
                return false;
            }
            return failureCount < 3;
        },
    });
}

// Hook para actualizar el perfil del usuario
export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const { setUser } = useAuth();

    return useMutation({
        mutationFn: (data: Partial<Usuario>) => apiService.updateProfile(data),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
            // Update localStorage and AuthContext directly
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                const updatedAuthResponse = {
                    ...currentUser,
                    nombre: updatedUser.nombre,
                    email: updatedUser.email,
                };
                localStorage.setItem("user", JSON.stringify(updatedAuthResponse));
                setUser(updatedAuthResponse);
            }
        },
    });
}

// Hook para cambiar la contraseña del usuario
export function useChangePassword() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ChangePasswordRequest) => apiService.changePassword(data),
        onSuccess: () => {
            // Optionally invalidate profile or show a success message
            // queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
        },
    });
}
