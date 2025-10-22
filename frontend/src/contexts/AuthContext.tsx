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
            console.log('[AuthContext] Starting session check...');
            setAuthState(prev => ({ ...prev, isLoading: true }));
            
            // Check if there's a saved user in localStorage
            const savedUser = localStorage.getItem('auth-user');
            console.log('[AuthContext] Saved user in localStorage:', savedUser ? 'exists' : 'not found');
            
            if (!savedUser) {
                console.log('[AuthContext] No saved user, setting unauthenticated state');
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    isLoading: false,
                });
                return;
            }

            try {
                // Parse the saved user
                const parsedUser = JSON.parse(savedUser);
                console.log('[AuthContext] Parsed saved user:', parsedUser);
                
                // For now, trust the localStorage and validate in background
                setAuthState({
                    isAuthenticated: true,
                    user: parsedUser,
                    isLoading: false,
                });
                console.log('[AuthContext] User authenticated from localStorage');
                
                // Validate session with backend in background (don't await)
                authService.validateSession().catch((error: any) => {
                    console.warn('[AuthContext] Background session validation failed:', error);
                    // Only clear if it's definitely an auth error
                    if (error.message === 'Session expired') {
                        localStorage.removeItem('auth-user');
                        setAuthState({
                            isAuthenticated: false,
                            user: null,
                            isLoading: false,
                        });
                    }
                });
            } catch (parseError) {
                console.error('[AuthContext] Failed to parse saved user:', parseError);
                localStorage.removeItem('auth-user');
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    isLoading: false,
                });
            }
        } catch (error) {
            console.error('Session check failed:', error);
            setAuthState({
                isAuthenticated: false,
                user: null,
                isLoading: false,
            });
        }
    };

    const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            console.log('[AuthContext] Starting login process...', credentials);
            setAuthState(prev => ({ ...prev, isLoading: true }));
            
            const response = await authService.login(credentials);
            console.log('[AuthContext] Login response:', response);
            
            if (response.success && response.usuario) {
                // Save user to localStorage for persistence
                localStorage.setItem('auth-user', JSON.stringify(response.usuario));
                console.log('[AuthContext] User saved to localStorage');
                
                setAuthState({
                    isAuthenticated: true,
                    user: response.usuario,
                    isLoading: false,
                });
                console.log('[AuthContext] AuthState updated - user authenticated');
                
                return {
                    success: true,
                    message: MESSAGES.SUCCESS.LOGIN_SUCCESS,
                    usuario: response.usuario,
                };
            } else {
                console.log('[AuthContext] Login failed:', response.message);
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