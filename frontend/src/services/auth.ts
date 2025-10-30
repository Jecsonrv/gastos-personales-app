import axios from "axios";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types";

const API_URL = "http://localhost:8080/api/auth";

class AuthService {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/login`, credentials);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    }

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/register`, data);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    getCurrentUser(): AuthResponse | null {
        const userStr = localStorage.getItem("user");
        if (userStr) return JSON.parse(userStr);
        return null;
    }

    getToken(): string | null {
        return localStorage.getItem("token");
    }
}

export const authService = new AuthService();
