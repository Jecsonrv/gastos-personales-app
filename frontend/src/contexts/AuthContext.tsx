import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthState, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types";
import { authService } from "../services/auth";
import { MESSAGES } from "../constants";

interface AuthContextType extends AuthState {
    login: (credentials: LoginRequest) => Promise<LoginResponse>;
    register: (userData: RegisterRequest) => Promise<RegisterResponse>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        isLoading: true,
    });

    // Check if user is authenticated on app start
    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async (): Promise<void> => {
        try {
            setAuthState(prev => ({ ...prev, isLoading: true }));
            
            // Check if there's a saved user in localStorage
            const savedUser = localStorage.getItem('auth-user');
            if (!savedUser) {
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    isLoading: false,
                });
                return;
            }

            // Validate session with backend
            const user = await authService.validateSession();
            setAuthState({
                isAuthenticated: true,
                user,
                isLoading: false,
            });
        } catch (error) {
            console.error('Session validation failed:', error);
            // Clear invalid session
            localStorage.removeItem('auth-user');
            setAuthState({
                isAuthenticated: false,
                user: null,
                isLoading: false,
            });
        }
    };

    const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            setAuthState(prev => ({ ...prev, isLoading: true }));
            
            const response = await authService.login(credentials);
            
            if (response.success && response.usuario) {
                // Save user to localStorage for persistence
                localStorage.setItem('auth-user', JSON.stringify(response.usuario));
                
                setAuthState({
                    isAuthenticated: true,
                    user: response.usuario,
                    isLoading: false,
                });
                
                return {
                    success: true,
                    message: MESSAGES.SUCCESS.LOGIN_SUCCESS,
                    usuario: response.usuario,
                };
            } else {
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    isLoading: false,
                });
                
                return {
                    success: false,
                    message: response.message || MESSAGES.ERROR.LOGIN_FAILED,
                };
            }
        } catch (error) {
            console.error('Login failed:', error);
            setAuthState({
                isAuthenticated: false,
                user: null,
                isLoading: false,
            });
            
            return {
                success: false,
                message: MESSAGES.ERROR.LOGIN_FAILED,
            };
        }
    };

    const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
        try {
            const response = await authService.register(userData);
            return response;
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                success: false,
                message: "Error al registrar usuario",
            };
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout request failed:', error);
            // Continue with local logout even if server request fails
        } finally {
            // Clear local state and storage
            localStorage.removeItem('auth-user');
            setAuthState({
                isAuthenticated: false,
                user: null,
                isLoading: false,
            });
        }
    };

    const value: AuthContextType = {
        ...authState,
        login,
        register,
        logout,
        checkSession,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}