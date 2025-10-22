// Tipos para las entidades del dominio

export interface Usuario {
    id: number;
    nombreUsuario: string;
    email: string;
    fechaCreacion: string;
    ultimoAcceso?: string;
    activo: boolean;
}

export interface LoginRequest {
    nombreUsuario: string;
    password: string;
}

export interface RegisterRequest {
    nombreUsuario: string;
    email: string;
    password: string;
    nombreCompleto: string;
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    usuario?: Usuario;
    sessionId?: string;
}

export interface RegisterResponse {
    success: boolean;
    message?: string;
    usuario?: Usuario;
}

export interface UsernameAvailability {
    available: boolean;
    message: string;
}

export interface EmailAvailability {
    available: boolean;
    message: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: Usuario | null;
    isLoading: boolean;
}

export interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    color?: string;
    icono?: string;
    activa: boolean;
    // Indicates categories that are predefined by the system and shouldn't be modified
    esPredefinida?: boolean;
    fechaCreacion: string;
}

export interface Movimiento {
    id: number;
    descripcion: string;
    monto: number;
    fechaMovimiento: string;
    tipo: TipoMovimiento;
    categoria: Categoria;
    fechaCreacion: string;
}

export const TipoMovimiento = {
    INGRESO: "INGRESO",
    GASTO: "GASTO",
} as const;

export type TipoMovimiento =
    (typeof TipoMovimiento)[keyof typeof TipoMovimiento];

// DTOs para transferencia de datos
export interface MovimientoCreateDTO {
    descripcion: string;
    monto: number;
    fechaMovimiento: string;
    tipo: TipoMovimiento;
    categoriaId: number;
}

export interface MovimientoUpdateDTO extends Partial<MovimientoCreateDTO> {
    id: number;
}

export interface CategoriaCreateDTO {
    nombre: string;
    descripcion?: string;
    color?: string;
    icono?: string;
}

export interface CategoriaUpdateDTO extends Partial<CategoriaCreateDTO> {
    id: number;
}

// Tipos para resúmenes y estadísticas
export interface ResumenFinanciero {
    totalIngresos: number;
    totalGastos: number;
    balance: number;
    movimientosCount: number;
}

export interface CategoriaResumen {
    categoria: Categoria;
    totalGastos: number;
    totalIngresos: number;
    movimientosCount: number;
    porcentaje: number;
}

export interface ResumenMensual {
    mes: string;
    ano: number;
    totalIngresos: number;
    totalGastos: number;
    balance: number;
}

// Tipos para filtros y búsquedas
export interface FiltroMovimientos {
    categoriaId?: number;
    tipo?: TipoMovimiento;
    fechaDesde?: string;
    fechaHasta?: string;
    descripcion?: string;
}

// Tipos para la respuesta de la API
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}
