# Instrucciones para Convertir el Proyecto a "Fine" con Autenticación

## Resumen

Se ha implementado parcialmente el sistema de autenticación. Este documento contiene todas las instrucciones para completar la implementación.

## Archivos Ya Creados (Backend)

### Modelos y Repositorios
- ✅ `domain/model/Usuario.java` - Modelo de usuario
- ✅ `infrastructure/repository/UsuarioRepositoryInterface.java` - Repositorio
- ✅ `domain/service/UsuarioService.java` - Interfaz de servicio
- ✅ `application/service/UsuarioServiceImpl.java` - Implementación del servicio

### DTOs
- ✅ `domain/dto/LoginRequest.java`
- ✅ `domain/dto/RegisterRequest.java`
- ✅ `domain/dto/AuthResponse.java`

### Controladores
- ✅ `interfaz/web/AuthRestController.java` - Endpoints de autenticación

### Modelos Modificados
- ✅ `domain/model/Categoria.java` - Agregada relación con Usuario

---

## Archivos Pendientes de Modificar/Crear

### Backend - Modelo Movimiento

**Archivo:** `src/main/java/com/proyecto/gastospersonales/domain/model/Movimiento.java`

Agregar al inicio con los demás imports:
```java
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
```

Agregar después de la relación con Categoria:
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "usuario_id", nullable = false)
@JsonBackReference
private Usuario usuario;
```

Agregar getter y setter:
```java
public Usuario getUsuario() {
    return usuario;
}

public void setUsuario(Usuario usuario) {
    this.usuario = usuario;
}
```

---

### Frontend - Tipos

**Archivo:** `frontend/src/types/index.ts`

Agregar al final del archivo:
```typescript
// Auth types
export interface Usuario {
    id: number;
    username: string;
    email: string;
    nombre: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    nombre: string;
}

export interface AuthResponse {
    id: number;
    username: string;
    email: string;
    nombre: string;
    token: string;
}
```

---

### Frontend - Servicio de Autenticación

**Archivo:** `frontend/src/services/auth.ts` (CREAR NUEVO)

```typescript
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
```

---

### Frontend - Contexto de Autenticación

**Archivo:** `frontend/src/contexts/AuthContext.tsx` (CREAR NUEVO)

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "../services/auth";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

interface AuthContextType {
    user: AuthResponse | null;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthResponse | null>(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    const login = async (credentials: LoginRequest) => {
        const userData = await authService.login(credentials);
        setUser(userData);
    };

    const register = async (data: RegisterRequest) => {
        const userData = await authService.register(data);
        setUser(userData);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
```

---

### Frontend - Página de Login

**Archivo:** `frontend/src/pages/Login.tsx` (CREAR NUEVO)

```typescript
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui";
import { Button, Input } from "../components/ui";

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login({ username, password });
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.error || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">
                        Fine
                    </CardTitle>
                    <p className="text-center text-muted-foreground mt-2">
                        Inicia sesión en tu cuenta
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Usuario
                            </label>
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ingresa tu usuario"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Contraseña
                            </label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ingresa tu contraseña"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            ¿No tienes cuenta?{" "}
                            <Link
                                to="/register"
                                className="text-primary hover:underline"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
```

---

### Frontend - Página de Registro

**Archivo:** `frontend/src/pages/Register.tsx` (CREAR NUEVO)

```typescript
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui";
import { Button, Input } from "../components/ui";

export function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        nombre: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await register(formData);
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.error || "Error al registrarse");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">
                        Fine
                    </CardTitle>
                    <p className="text-center text-muted-foreground mt-2">
                        Crea tu cuenta
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Nombre Completo
                            </label>
                            <Input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) =>
                                    setFormData({ ...formData, nombre: e.target.value })
                                }
                                placeholder="Tu nombre"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Usuario
                            </label>
                            <Input
                                type="text"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                placeholder="Elige un usuario"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Contraseña
                            </label>
                            <Input
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                placeholder="Mínimo 4 caracteres"
                                required
                                minLength={4}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Registrando..." : "Crear Cuenta"}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            ¿Ya tienes cuenta?{" "}
                            <Link
                                to="/login"
                                className="text-primary hover:underline"
                            >
                                Inicia sesión
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
```

---

### Frontend - Modificar App.tsx

**Archivo:** `frontend/src/App.tsx`

Reemplazar completamente con:
```typescript
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/layout/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Movimientos } from "./pages/Movimientos";
import { Categorias } from "./pages/Categorias";
import { Reportes } from "./pages/Reportes";
import { Configuracion } from "./pages/Configuracion";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" /> : <Login />}
            />
            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/" /> : <Register />}
            />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Layout />
                    </PrivateRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="movimientos" element={<Movimientos />} />
                <Route path="categorias" element={<Categorias />} />
                <Route path="reportes" element={<Reportes />} />
                <Route path="configuracion" element={<Configuracion />} />
            </Route>
        </Routes>
    );
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider>
                    <AuthProvider>
                        <AppRoutes />
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
```

---

### Frontend - Modificar Layout para agregar Logout

**Archivo:** `frontend/src/components/layout/Layout.tsx`

Buscar donde está el sidebar y agregar al final (antes del cierre del sidebar):
```typescript
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

// ... dentro del componente Layout
const { logout, user } = useAuth();

// Agregar al final del sidebar, después de los demás NavItems:
<div className="mt-auto border-t border-border pt-4">
    <div className="px-4 py-2 text-sm text-muted-foreground">
        {user?.nombre || user?.username}
    </div>
    <button
        onClick={logout}
        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors text-left"
    >
        <LogOut className="w-5 h-5" />
        <span>Cerrar Sesión</span>
    </button>
</div>
```

---

## Actualizaciones de Branding a "Fine"

### 1. package.json (frontend)
Cambiar `"name": "gastos-personales"` por `"name": "fine"`

### 2. pom.xml (backend)
Cambiar `<artifactId>gastos-personales</artifactId>` por `<artifactId>fine</artifactId>`

### 3. index.html (frontend)
Cambiar `<title>Gestor de Gastos</title>` por `<title>Fine - Finanzas Personales</title>`

### 4. README.md
Cambiar el título de "Gestor de Gastos Personales" a "Fine - Gestión de Finanzas Personales"

---

## Base de Datos

La base de datos se actualizará automáticamente con Hibernate. Al iniciar la aplicación, se crearán las tablas:
- `usuarios`
- `categoria` (con columna `usuario_id`)
- `movimiento` (con columna `usuario_id`)

---

## Pasos para Ejecutar

1. **Iniciar PostgreSQL**

2. **Backend:**
   ```bash
   mvnw.cmd spring-boot:run
   ```

3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Abrir navegador:**
   - http://localhost:5173

5. **Registrar primer usuario:**
   - Click en "Regístrate aquí"
   - Completar formulario
   - Automáticamente iniciará sesión

---

## Notas Importantes

1. **Sesiones:** Las sesiones se guardan en memoria del servidor. Se perderán al reiniciar el backend.

2. **Contraseñas:** Por simplicidad, se guardan en texto plano. Para producción, usar BCrypt.

3. **Categorías predefinidas:** Se crean para todos los usuarios (usuario_id = null).

4. **Categorías personalizadas:** Cada usuario puede crear sus propias categorías.

5. **Datos aislados:** Cada usuario solo ve sus propios movimientos y categorías.

---

## Archivos Eliminados

- ✅ `frontend-vanilla/` (completo)
- ✅ `DOCUMENTACION_PROYECTO.md`
- ✅ `DOCUMENTACION_PROYECTO.pdf`
- ✅ `PROJECT_OVERVIEW.md`
- ✅ `CONFIGURATION.md`
- ✅ `CAMBIOS_REALIZADOS.md`

---

## Próximos Pasos Opcionales

1. Agregar hash de contraseñas con BCrypt
2. Implementar JWT en lugar de tokens UUID
3. Agregar persistencia de sesiones en BD
4. Implementar "Recordarme" con cookies
5. Agregar recuperación de contraseña
6. Implementar roles de usuario
