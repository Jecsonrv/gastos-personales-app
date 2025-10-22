import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface SimpleAuthState {
    isAuthenticated: boolean;
    user: { nombreUsuario: string; email: string; id: number } | null;
    isLoading: boolean;
}

interface SimpleAuthContextType extends SimpleAuthState {
    login: (credentials: { nombreUsuario: string; password: string }) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

interface SimpleAuthProviderProps {
    children: ReactNode;
}

export function SimpleAuthProvider({ children }: SimpleAuthProviderProps) {
    const [authState, setAuthState] = useState<SimpleAuthState>({
        isAuthenticated: false,
        user: null,
        isLoading: true, // Start with loading true
    });

    // Check localStorage on app start
    useEffect(() => {
        const savedUser = localStorage.getItem('auth-user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setAuthState({
                    isAuthenticated: true,
                    user,
                    isLoading: false,
                });
            } catch (error) {
                console.error('Failed to parse saved user:', error);
                localStorage.removeItem('auth-user');
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    isLoading: false,
                });
            }
        } else {
            setAuthState({
                isAuthenticated: false,
                user: null,
                isLoading: false,
            });
        }
    }, []);

    const login = async (credentials: { nombreUsuario: string; password: string }) => {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        
        try {
            // Real API call to backend
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': window.location.origin
                },
                credentials: 'include', // Important for cookies/sessions
                body: JSON.stringify({
                    nombreUsuario: credentials.nombreUsuario,
                    password: credentials.password
                })
            });

            const data = await response.json();

            if (data.success && data.usuario) {
                const user = {
                    id: data.usuario.id,
                    nombreUsuario: data.usuario.nombreUsuario,
                    email: data.usuario.email
                };

                // Save to localStorage for persistence
                localStorage.setItem('auth-user', JSON.stringify(user));
                
                setAuthState({
                    isAuthenticated: true,
                    user,
                    isLoading: false,
                });
                
                return { success: true, message: "Login exitoso" };
            } else {
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    isLoading: false,
                });
                
                return { success: false, message: data.message || "Credenciales incorrectas" };
            }
        } catch (error) {
            console.error('Login error:', error);
            setAuthState({
                isAuthenticated: false,
                user: null,
                isLoading: false,
            });
            
            return { success: false, message: "Error de conexión con el servidor" };
        }
    };

    const logout = async () => {
        try {
            // Call backend logout
            await fetch('http://localhost:8080/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local state regardless
            localStorage.removeItem('auth-user');
            setAuthState({
                isAuthenticated: false,
                user: null,
                isLoading: false,
            });
        }
    };

    const value: SimpleAuthContextType = {
        ...authState,
        login,
        logout,
    };

    return (
        <SimpleAuthContext.Provider value={value}>
            {children}
        </SimpleAuthContext.Provider>
    );
}

export function useSimpleAuth(): SimpleAuthContextType {
    const context = useContext(SimpleAuthContext);
    if (context === undefined) {
        throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
    }
    return context;
}