import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { Layout } from "./components/layout/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Movimientos } from "./pages/Movimientos";
import { Categorias } from "./pages/Categorias";
import { Reportes } from "./pages/Reportes";
import { Configuracion } from "./pages/Configuracion";
import { Profile } from "./pages/Profile";
import { ToastProvider } from "./components/ui";

// Crear cliente de React Query con opciones por defecto para mejorar
// la experiencia de navegación (evitar refetchs en mount y mantener datos en caché)
// Esto reduce el uso del PageLoader al navegar entre páginas cuando los
// datos ya están en cache, haciendo las transiciones prácticamente instantáneas.
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // No refetchear automáticamente al enfocar la ventana
            refetchOnWindowFocus: false,
            // No refetchear al montar si hay datos en cache (evita isLoading breve)
            refetchOnMount: false,
            // Tiempo durante el cual los datos se consideran frescos (5 minutos)
            staleTime: 5 * 60 * 1000,
            // Mantener datos previos cuando se hacen cambios de queries similares
            keepPreviousData: true,
            // Número de reintentos cortos en caso de fallo
            retry: 1,
        },
    },
});

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
                <Route path="perfil" element={<Profile />} />
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
                        <ToastProvider>
                            <AppRoutes />
                        </ToastProvider>
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
