import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

export function DebugInfo() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    return (
        <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded-lg text-sm z-50 max-w-sm">
            <h3 className="font-bold mb-2">Debug Info</h3>
            <div className="space-y-1">
                <p>Location: {location.pathname}</p>
                <p>isAuthenticated: {isAuthenticated.toString()}</p>
                <p>isLoading: {isLoading.toString()}</p>
                <p>User: {user ? user.nombreUsuario : 'null'}</p>
                <p>LocalStorage: {localStorage.getItem('auth-user') ? 'has user' : 'empty'}</p>
            </div>
        </div>
    );
}