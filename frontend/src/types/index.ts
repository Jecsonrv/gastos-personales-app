// Tipos para las entidades del dominio

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

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}
