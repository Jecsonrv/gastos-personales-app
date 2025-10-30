import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui";
import { Button, Input } from "../components/ui";
import { useToast } from "../components/ui/Toast";

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addToast } = useToast();
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
            const errorMessage = err.response?.data?.error || "Error al iniciar sesión";
            addToast(errorMessage, "error");
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-primary rounded-lg p-2 mr-3">
                            <svg
                                className="h-8 w-8 text-primary-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <CardTitle className="text-3xl font-bold text-center">
                            Fine
                        </CardTitle>
                    </div>
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
