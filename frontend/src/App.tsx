import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { SimpleAuthProvider } from "./contexts/SimpleAuthContext";
import { SimpleProtectedRoute } from "./components/SimpleProtectedRoute";
import { SimpleLoginPage } from "./pages/SimpleLoginPage";
import { FullLayout } from "./components/layout/FullLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { MovimientosPage } from "./pages/MovimientosPage";
import { CategoriasPage } from "./pages/CategoriasPage";
import { ReportesPage } from "./pages/ReportesPage";
import { ConfiguracionPage } from "./pages/ConfiguracionPage";

function App() {
    return (
        <SimpleAuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 transition-colors">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<SimpleLoginPage />} />
                        
                        {/* Protected Routes with Layout */}
                        <Route
                            path="/"
                            element={
                                <SimpleProtectedRoute>
                                    <FullLayout />
                                </SimpleProtectedRoute>
                            }
                        >
                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="movimientos" element={<MovimientosPage />} />
                            <Route path="categorias" element={<CategoriasPage />} />
                            <Route path="reportes" element={<ReportesPage />} />
                            <Route path="configuracion" element={<ConfiguracionPage />} />
                        </Route>
                        
                        {/* Catch all */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </div>
            </Router>
        </SimpleAuthProvider>
    );
}

export default App;
