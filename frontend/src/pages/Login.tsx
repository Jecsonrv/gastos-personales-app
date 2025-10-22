import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/auth";
import type { LoginRequest, RegisterRequest } from "../types";

interface PasswordStrength {
    score: number;
    message: string;
    color: string;
}

export function LoginPage() {
    const { login, isAuthenticated, isLoading } = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    // Login form state
    const [loginData, setLoginData] = useState<LoginRequest>({
        nombreUsuario: "",
        password: "",
    });

    // Registration form state
    const [registerData, setRegisterData] = useState<RegisterRequest>({
        nombreUsuario: "",
        email: "",
        password: "",
        nombreCompleto: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
        score: 0,
        message: "",
        color: "gray"
    });

    // Availability checks
    const [usernameAvailability, setUsernameAvailability] = useState<{
        checked: boolean;
        available: boolean;
        message: string;
    }>({ checked: false, available: false, message: "" });

    const [emailAvailability, setEmailAvailability] = useState<{
        checked: boolean;
        available: boolean;
        message: string;
    }>({ checked: false, available: false, message: "" });

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    // Password strength calculator
    const calculatePasswordStrength = (password: string): PasswordStrength => {
        if (password.length === 0) {
            return { score: 0, message: "", color: "gray" };
        }

        let score = 0;
        
        // Length
        if (password.length >= 8) score += 2;
        else if (password.length >= 6) score += 1;
        
        // Contains lowercase
        if (/[a-z]/.test(password)) score += 1;
        
        // Contains uppercase
        if (/[A-Z]/.test(password)) score += 1;
        
        // Contains numbers
        if (/\d/.test(password)) score += 1;
        
        // Contains special characters
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

        if (score <= 2) {
            return { score, message: "Contraseña débil", color: "red" };
        } else if (score <= 4) {
            return { score, message: "Contraseña moderada", color: "yellow" };
        } else {
            return { score, message: "Contraseña fuerte", color: "green" };
        }
    };

    // Check username availability with debounce
    useEffect(() => {
        if (!isLoginMode && registerData.nombreUsuario.length >= 3) {
            const timeoutId = setTimeout(async () => {
                try {
                    const result = await authService.checkUsernameAvailability(registerData.nombreUsuario);
                    setUsernameAvailability({
                        checked: true,
                        available: result.available,
                        message: result.message
                    });
                } catch (error) {
                    setUsernameAvailability({
                        checked: true,
                        available: false,
                        message: "Error al verificar disponibilidad"
                    });
                }
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [registerData.nombreUsuario, isLoginMode]);

    // Check email availability with debounce
    useEffect(() => {
        if (!isLoginMode && registerData.email.includes("@") && registerData.email.includes(".")) {
            const timeoutId = setTimeout(async () => {
                try {
                    const result = await authService.checkEmailAvailability(registerData.email);
                    setEmailAvailability({
                        checked: true,
                        available: result.available,
                        message: result.message
                    });
                } catch (error) {
                    setEmailAvailability({
                        checked: true,
                        available: false,
                        message: "Error al verificar disponibilidad"
                    });
                }
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [registerData.email, isLoginMode]);

    // Update password strength
    useEffect(() => {
        if (!isLoginMode) {
            setPasswordStrength(calculatePasswordStrength(registerData.password));
        }
    }, [registerData.password, isLoginMode]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");
        
        // Basic validation
        if (!loginData.nombreUsuario.trim() || !loginData.password.trim()) {
            setFormError("Por favor, ingresa usuario y contraseña");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const response = await login(loginData);
            
            if (!response.success) {
                setFormError(response.message || "Error al iniciar sesión");
            }
        } catch (error) {
            console.error("Login error:", error);
            setFormError("Error de conexión. Intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");
        setSuccessMessage("");
        
        // Validation
        if (!registerData.nombreUsuario.trim() || registerData.nombreUsuario.length < 3) {
            setFormError("El nombre de usuario debe tener al menos 3 caracteres");
            return;
        }

        if (!registerData.email.trim() || !registerData.email.includes("@")) {
            setFormError("Por favor, ingresa un email válido");
            return;
        }

        if (registerData.password.length < 6) {
            setFormError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (registerData.password !== confirmPassword) {
            setFormError("Las contraseñas no coinciden");
            return;
        }

        if (!registerData.nombreCompleto.trim()) {
            setFormError("El nombre completo es requerido");
            return;
        }

        if (usernameAvailability.checked && !usernameAvailability.available) {
            setFormError("El nombre de usuario no está disponible");
            return;
        }

        if (emailAvailability.checked && !emailAvailability.available) {
            setFormError("El email ya está registrado");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const response = await authService.register(registerData);
            
            if (response.success) {
                setSuccessMessage("¡Registro exitoso! Ahora puedes iniciar sesión");
                setIsLoginMode(true);
                // Reset forms
                setRegisterData({
                    nombreUsuario: "",
                    email: "",
                    password: "",
                    nombreCompleto: "",
                });
                setConfirmPassword("");
                setLoginData({
                    nombreUsuario: registerData.nombreUsuario,
                    password: "",
                });
            } else {
                setFormError(response.message || "Error al registrar usuario");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setFormError("Error de conexión. Intenta nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const switchMode = () => {
        setIsLoginMode(!isLoginMode);
        setFormError("");
        setSuccessMessage("");
        setUsernameAvailability({ checked: false, available: false, message: "" });
        setEmailAvailability({ checked: false, available: false, message: "" });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-6 py-12">
            <Card className="w-full max-w-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 p-8">
                <div className="text-center mb-10">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                        <svg
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Fine
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Gestión de Finanzas Personales
                    </p>
                </div>

                {/* Mode Switch */}
                <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1 mb-8">
                    <button
                        type="button"
                        onClick={() => setIsLoginMode(true)}
                        className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                            isLoginMode
                                ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsLoginMode(false)}
                        className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                            !isLoginMode
                                ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                    >
                        Registrarse
                    </button>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex">
                            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="ml-3 text-sm text-green-600 dark:text-green-400">
                                {successMessage}
                            </p>
                        </div>
                    </div>
                )}

                {/* Login Form */}
                {isLoginMode && (
                    <form onSubmit={handleLogin} className="space-y-8">
                        <div>
                            <label
                                htmlFor="loginUsuario"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                            >
                                Usuario
                            </label>
                            <Input
                                id="loginUsuario"
                                type="text"
                                value={loginData.nombreUsuario}
                                onChange={(e) => setLoginData(prev => ({ ...prev, nombreUsuario: e.target.value }))}
                                placeholder="Ingresa tu usuario"
                                required
                                disabled={isSubmitting}
                                className="w-full h-12 px-4 text-base"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="loginPassword"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                            >
                                Contraseña
                            </label>
                            <Input
                                id="loginPassword"
                                type="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="Ingresa tu contraseña"
                                required
                                disabled={isSubmitting}
                                className="w-full h-12 px-4 text-base"
                            />
                        </div>

                        {formError && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                                <div className="flex">
                                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="ml-3 text-sm text-red-600 dark:text-red-400">
                                        {formError}
                                    </p>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Iniciando sesión...
                                </div>
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </Button>
                    </form>
                )}

                {/* Registration Form */}
                {!isLoginMode && (
                    <form onSubmit={handleRegister} className="space-y-8">
                        <div>
                            <label
                                htmlFor="registerNombreCompleto"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                            >
                                Nombre Completo
                            </label>
                            <Input
                                id="registerNombreCompleto"
                                type="text"
                                value={registerData.nombreCompleto}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, nombreCompleto: e.target.value }))}
                                placeholder="Ingresa tu nombre completo"
                                required
                                disabled={isSubmitting}
                                className="w-full h-12 px-4 text-base"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="registerUsuario"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                            >
                                Nombre de Usuario
                            </label>
                            <Input
                                id="registerUsuario"
                                type="text"
                                value={registerData.nombreUsuario}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, nombreUsuario: e.target.value }))}
                                placeholder="Elige un nombre de usuario"
                                required
                                disabled={isSubmitting}
                                className="w-full h-12 px-4 text-base"
                                minLength={3}
                            />
                            {usernameAvailability.checked && (
                                <p className={`text-sm mt-3 ${usernameAvailability.available ? 'text-green-600' : 'text-red-600'}`}>
                                    {usernameAvailability.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="registerEmail"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                            >
                                Email
                            </label>
                            <Input
                                id="registerEmail"
                                type="email"
                                value={registerData.email}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="tu@email.com"
                                required
                                disabled={isSubmitting}
                                className="w-full h-12 px-4 text-base"
                            />
                            {emailAvailability.checked && (
                                <p className={`text-sm mt-3 ${emailAvailability.available ? 'text-green-600' : 'text-red-600'}`}>
                                    {emailAvailability.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="registerPassword"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                            >
                                Contraseña
                            </label>
                            <Input
                                id="registerPassword"
                                type="password"
                                value={registerData.password}
                                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="Crea una contraseña segura"
                                required
                                disabled={isSubmitting}
                                className="w-full h-12 px-4 text-base"
                                minLength={6}
                            />
                            {registerData.password && (
                                <div className="mt-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-300 ${
                                                    passwordStrength.color === 'red' ? 'bg-red-500' :
                                                    passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                                                    'bg-green-500'
                                                }`}
                                                style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                                            />
                                        </div>
                                        <span className={`text-sm font-medium ${
                                            passwordStrength.color === 'red' ? 'text-red-600' :
                                            passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                                            'text-green-600'
                                        }`}>
                                            {passwordStrength.message}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                            >
                                Confirmar Contraseña
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirma tu contraseña"
                                required
                                disabled={isSubmitting}
                                className="w-full h-12 px-4 text-base"
                            />
                            {confirmPassword && registerData.password !== confirmPassword && (
                                <p className="text-sm mt-3 text-red-600">
                                    Las contraseñas no coinciden
                                </p>
                            )}
                        </div>

                        {formError && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <div className="flex">
                                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="ml-3 text-sm text-red-600 dark:text-red-400">
                                        {formError}
                                    </p>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registrando...
                                </div>
                            ) : (
                                "Crear Cuenta"
                            )}
                        </Button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isLoginMode ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                        <button
                            type="button"
                            onClick={switchMode}
                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            {isLoginMode ? "Regístrate aquí" : "Inicia sesión"}
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    );
}