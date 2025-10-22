// URLs de la API
export const API_BASE_URL = "http://localhost:8080/api";

export const API_ENDPOINTS = {
    MOVIMIENTOS: "/movimientos",
    CATEGORIAS: "/categorias",
    REPORTES: "/reportes",
    AUTH: "/auth",
} as const;

// Configuración de la aplicación
export const APP_CONFIG = {
    NAME: "Gestor de Gastos Personales",
    VERSION: "2.0.0",
    PAGINATION_SIZE: 10,
    DATE_FORMAT: "dd/MM/yyyy",
    CURRENCY: "USD",
} as const;

// Colores predeterminados para categorías
export const CATEGORIA_COLORS = [
    "#ef4444", // red-500
    "#f97316", // orange-500
    "#f59e0b", // amber-500
    "#eab308", // yellow-500
    "#84cc16", // lime-500
    "#22c55e", // green-500
    "#10b981", // emerald-500
    "#14b8a6", // teal-500
    "#06b6d4", // cyan-500
    "#0ea5e9", // sky-500
    "#3b82f6", // blue-500
    "#6366f1", // indigo-500
    "#8b5cf6", // violet-500
    "#a855f7", // purple-500
    "#d946ef", // fuchsia-500
    "#ec4899", // pink-500
] as const;

// Íconos predeterminados para categorías
export const CATEGORIA_ICONS = [
    "ShoppingCart",
    "Home",
    "Car",
    "Utensils",
    "Coffee",
    "Shirt",
    "Gamepad2",
    "Heart",
    "GraduationCap",
    "Plane",
    "Gift",
    "Smartphone",
    "DollarSign",
    "TrendingUp",
    "PiggyBank",
    "Wallet",
] as const;

// Tipos de movimiento
export const TIPOS_MOVIMIENTO = {
    INGRESO: "INGRESO",
    GASTO: "GASTO",
} as const;

// Mensajes de la aplicación
export const MESSAGES = {
    SUCCESS: {
        MOVIMIENTO_CREATED: "Movimiento creado exitosamente",
        MOVIMIENTO_UPDATED: "Movimiento actualizado exitosamente",
        MOVIMIENTO_DELETED: "Movimiento eliminado exitosamente",
        CATEGORIA_CREATED: "Categoría creada exitosamente",
        CATEGORIA_UPDATED: "Categoría actualizada exitosamente",
        CATEGORIA_DELETED: "Categoría eliminada exitosamente",
        LOGIN_SUCCESS: "Inicio de sesión exitoso",
        LOGOUT_SUCCESS: "Sesión cerrada exitosamente",
    },
    ERROR: {
        GENERIC: "Ha ocurrido un error inesperado",
        NETWORK: "Error de conexión con el servidor",
        VALIDATION: "Por favor, revisa los datos ingresados",
        NOT_FOUND: "El recurso solicitado no fue encontrado",
        UNAUTHORIZED: "No tienes permisos para realizar esta acción",
        LOGIN_FAILED: "Usuario o contraseña incorrectos",
        SESSION_EXPIRED: "Tu sesión ha expirado, por favor inicia sesión nuevamente",
    },
    CONFIRM: {
        DELETE_MOVIMIENTO:
            "¿Estás seguro de que deseas eliminar este movimiento?",
        DELETE_CATEGORIA:
            "¿Estás seguro de que deseas eliminar esta categoría?",
    },
} as const;

// Configuración de gráficos
export const CHART_CONFIG = {
    COLORS: {
        PRIMARY: "#3b82f6",
        SUCCESS: "#10b981",
        WARNING: "#f59e0b",
        DANGER: "#ef4444",
        INFO: "#06b6d4",
    },
    RESPONSIVE: {
        XS: { width: 280, height: 200 },
        SM: { width: 400, height: 250 },
        MD: { width: 600, height: 300 },
        LG: { width: 800, height: 400 },
    },
} as const;
