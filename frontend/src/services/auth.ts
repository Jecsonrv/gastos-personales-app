import axios from "axios";
import type { AxiosResponse } from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../constants";
import type { 
    Usuario, 
    LoginRequest, 
    LoginResponse, 
    RegisterRequest, 
    RegisterResponse,
    UsernameAvailability,
    EmailAvailability 
} from "../types";

class AuthService {
    private client = axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        withCredentials: true, // Important for session cookies
    });

    /**
     * Login user with credentials
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            const response: AxiosResponse<LoginResponse> = await this.client.post(
                `${API_ENDPOINTS.AUTH}/login`,
                credentials
            );
            
            return response.data;
        } catch (error: any) {
            console.error('Login error:', error);
            
            // Handle different types of errors
            if (error.response?.status === 401) {
                return {
                    success: false,
                    message: "Usuario o contraseña incorrectos",
                };
            }
            
            if (error.response?.status === 400) {
                return {
                    success: false,
                    message: error.response.data?.message || "Datos de login inválidos",
                };
            }
            
            return {
                success: false,
                message: "Error de conexión con el servidor",
            };
        }
    }

    /**
     * Register new user
     */
    async register(userData: RegisterRequest): Promise<RegisterResponse> {
        try {
            const response: AxiosResponse<RegisterResponse> = await this.client.post(
                `${API_ENDPOINTS.AUTH}/register`,
                userData
            );
            
            return response.data;
        } catch (error: any) {
            console.error('Registration error:', error);
            
            if (error.response?.status === 400) {
                return {
                    success: false,
                    message: error.response.data?.message || "Datos de registro inválidos",
                };
            }
            
            return {
                success: false,
                message: "Error de conexión con el servidor",
            };
        }
    }

    /**
     * Check if username is available
     */
    async checkUsernameAvailability(username: string): Promise<UsernameAvailability> {
        try {
            const response: AxiosResponse<UsernameAvailability> = await this.client.get(
                `${API_ENDPOINTS.AUTH}/check-username`,
                { params: { username } }
            );
            
            return response.data;
        } catch (error: any) {
            console.error('Username check error:', error);
            return {
                available: false,
                message: "Error al verificar disponibilidad"
            };
        }
    }

    /**
     * Check if email is available
     */
    async checkEmailAvailability(email: string): Promise<EmailAvailability> {
        try {
            const response: AxiosResponse<EmailAvailability> = await this.client.get(
                `${API_ENDPOINTS.AUTH}/check-email`,
                { params: { email } }
            );
            
            return response.data;
        } catch (error: any) {
            console.error('Email check error:', error);
            return {
                available: false,
                message: "Error al verificar disponibilidad"
            };
        }
    }

    /**
     * Logout current user
     */
    async logout(): Promise<void> {
        try {
            await this.client.post(`${API_ENDPOINTS.AUTH}/logout`);
        } catch (error) {
            console.error('Logout error:', error);
            // Don't throw error - local logout should continue
        }
    }

    /**
     * Validate current session
     */
    async validateSession(): Promise<Usuario> {
        try {
            const response: AxiosResponse<{ usuario: Usuario }> = await this.client.get(
                `${API_ENDPOINTS.AUTH}/session`
            );
            
            return response.data.usuario;
        } catch (error: any) {
            console.error('Session validation error:', error);
            
            if (error.response?.status === 401) {
                throw new Error('Session expired');
            }
            
            throw new Error('Session validation failed');
        }
    }

    /**
     * Get current user info
     */
    async getCurrentUser(): Promise<Usuario | null> {
        try {
            return await this.validateSession();
        } catch (error) {
            return null;
        }
    }
}

export const authService = new AuthService();
export default AuthService;