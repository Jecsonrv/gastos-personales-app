import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { Movimientos } from "./pages/Movimientos";
import { Categorias } from "./pages/Categorias";
import { Reportes } from "./pages/Reportes";
import { Configuracion } from "./pages/Configuracion";
import { LoginPage } from "./pages/Login";

// Crear cliente de React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutos
        },
    },
});

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="app-theme">
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <Router>
                        <div className="min-h-screen bg-background transition-colors">
                            <Routes>
                                {/* Ruta de login pública */}
                                <Route path="/login" element={<LoginPage />} />

                                {/* Rutas protegidas */}
                                <Route
                                    path="/"
                                    element={
                                        <ProtectedRoute>
                                            <Layout />
                                        </ProtectedRoute>
                                    }
                                >
                                    <Route
                                        path="dashboard"
                                        element={<Dashboard />}
                                    />
                                    <Route
                                        path="movimientos"
                                        element={<Movimientos />}
                                    />
                                    <Route
                                        path="categorias"
                                        element={<Categorias />}
                                    />
                                    <Route path="reportes" element={<Reportes />} />
                                    <Route
                                        path="configuracion"
                                        element={<Configuracion />}
                                    />
                                    <Route
                                        path=""
                                        element={<Navigate to="/dashboard" replace />}
                                    />
                                </Route>

                                {/* Ruta 404 */}
                                <Route
                                    path="*"
                                    element={<Navigate to="/dashboard" replace />}
                                />
                            </Routes>
                        </div>
                    </Router>

                    {/* React Query DevTools - solo en desarrollo */}
                    {import.meta.env.DEV && (
                        <ReactQueryDevtools initialIsOpen={false} />
                    )}
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
