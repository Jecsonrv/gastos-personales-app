import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "../services/auth";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";
import { useProfile } from "../hooks/useUsuario";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
    user: AuthResponse | null;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    setUser: (user: AuthResponse | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const { data: profile, isLoading, isError } = useProfile();
    const [user, setUser] = useState<AuthResponse | null>(null);

    useEffect(() => {
        if (profile) {
            // Update AuthContext's user state from react-query's profile data
            // This ensures consistency across the app
            setUser({
                id: profile.id,
                username: profile.username,
                email: profile.email,
                nombre: profile.nombre,
                token: authService.getToken() || "", // Token is still from localStorage
            });
        } else if (!isLoading && isError) {
            // If profile fetching fails (e.g., token expired/invalid), log out
            logout();
        }
    }, [profile, isLoading, isError]);

    const login = async (credentials: LoginRequest) => {
        const userData = await authService.login(credentials);
        // After successful login, invalidate profile query to refetch user data
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        setUser(userData);
    };

    const register = async (data: RegisterRequest) => {
        const userData = await authService.register(data);
        // After successful registration, invalidate profile query to refetch user data
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        setUser(userData);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        queryClient.removeQueries({ queryKey: ["profile"] }); // Clear profile cache on logout
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
