import { Navigate, useLocation } from "react-router-dom";
import { useSimpleAuth } from "../contexts/SimpleAuthContext";

interface SimpleProtectedRouteProps {
    children: React.ReactNode;
}

export function SimpleProtectedRoute({ children }: SimpleProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useSimpleAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Verificando sesión...
                    </p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render protected content
    return <>{children}</>;
}