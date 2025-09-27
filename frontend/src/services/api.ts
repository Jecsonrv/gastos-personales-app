import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../constants";
import type {
    Movimiento,
    Categoria,
    MovimientoCreateDTO,
    MovimientoUpdateDTO,
    CategoriaCreateDTO,
    CategoriaUpdateDTO,
    ResumenFinanciero,
    CategoriaResumen,
    ResumenMensual,
    FiltroMovimientos,
    TipoMovimiento,
} from "../types";

// Types for API responses
interface MovimientoRawDTO {
    id?: number;
    descripcion?: string;
    monto?: number;
    amount?: number;
    fecha?: string;
    fechaMovimiento?: string;
    fechaMov?: string;
    fechaMovimientoISO?: string;
    tipo?: TipoMovimiento;
    tipoMovimiento?: TipoMovimiento;
    esGasto?: boolean;
    categoria?: Categoria;
    fechaCreacion?: string;
}

interface EstadisticasDTO {
    totalIngresos?: number | { doubleValue?: number };
    totalGastos?: number | { doubleValue?: number };
    balance?: number | { doubleValue?: number };
    gastosPorCategoria?: Record<string, number>;
    // Can be either an array of monthly summaries or a single object with totals
    resumenMensual?: any | any[] | Record<string, unknown>;
    ingresos?: number;
    gastos?: number;
}

interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
}

class ApiError extends Error {
    public status?: number;
    public originalError?: unknown;

    constructor(message: string, status?: number, originalError?: unknown) {
        super(message);
        this.status = status;
        this.originalError = originalError;
        this.name = "ApiError";
    }
}

/**
 * Safely converts a value to number, handling various backend response formats
 */
function toNumberSafe(value: unknown): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number" && !isNaN(value)) return value;
    if (typeof value === "string") {
        const parsed = Number(value);
        return isNaN(parsed) ? 0 : parsed;
    }
    if (typeof value === "object" && value !== null) {
        const doubleValue = (value as unknown as Record<string, unknown>)
            .doubleValue as unknown;
        if (typeof doubleValue === "number") return doubleValue;
    }
    return 0;
}

/**
 * Creates a default Categoria object
 */
function createDefaultCategoria(): Categoria {
    return {
        id: -1,
        nombre: "",
        activa: true,
        fechaCreacion: new Date().toISOString(),
    };
}

/**
 * Creates a default Movimiento object
 */
function createDefaultMovimiento(): Movimiento {
    return {
        id: -1,
        descripcion: "",
        monto: 0,
        fechaMovimiento: new Date().toISOString(),
        tipo: "INGRESO" as TipoMovimiento,
        categoria: createDefaultCategoria(),
        fechaCreacion: new Date().toISOString(),
    };
}

/**
 * Maps raw DTO from backend to normalized Movimiento object
 */
function mapMovimientoDto(dto: unknown): Movimiento {
    if (!dto || typeof dto !== "object") {
        return createDefaultMovimiento();
    }

    const data = dto as MovimientoRawDTO;

    // Extract fecha with multiple possible field names
    const fechaRaw =
        data.fecha ??
        data.fechaMovimiento ??
        data.fechaMov ??
        data.fechaMovimientoISO;

    // Determine tipo with fallback logic
    const tipo: TipoMovimiento =
        data.tipo ??
        data.tipoMovimiento ??
        (data.esGasto ? "GASTO" : "INGRESO");

    return {
        id: toNumberSafe(data.id),
        descripcion: data.descripcion?.trim() || "",
        monto: toNumberSafe(data.monto ?? data.amount),
        fechaMovimiento: fechaRaw ? String(fechaRaw) : new Date().toISOString(),
        tipo,
        categoria: data.categoria || createDefaultCategoria(),
        fechaCreacion: data.fechaCreacion || new Date().toISOString(),
    };
}

/**
 * Builds query parameters object, filtering out undefined values
 */
function buildParams(
    params: Record<string, unknown>
): Record<string, string | number> {
    const result: Record<string, string | number> = {};

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            result[key] =
                typeof value === "string" || typeof value === "number"
                    ? value
                    : String(value);
        }
    });

    return result;
}

class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor - keep minimal logging
        this.client.interceptors.request.use(
            (config) => {
                // silent by default to avoid noisy logs in production
                return config;
            },
            (error) => {
                console.error("❌ Request Error:", error);
                return Promise.reject(
                    new ApiError("Request failed", undefined, error)
                );
            }
        );

        // Response interceptor - avoid verbose response logs
        this.client.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                console.error("❌ Response Error:", error);
                const status = error.response?.status;
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "API request failed";
                return Promise.reject(new ApiError(message, status, error));
            }
        );
    }

    // MOVIMIENTOS METHODS

    /**
     * Get movimiento by ID
     */
    async getMovimientoById(id: number): Promise<Movimiento> {
        if (!id || id <= 0) {
            throw new ApiError("Invalid movimiento ID");
        }

        try {
            const response: AxiosResponse<MovimientoRawDTO> =
                await this.client.get(`${API_ENDPOINTS.MOVIMIENTOS}/${id}`);
            return mapMovimientoDto(response.data);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError("Failed to get movimiento", undefined, error);
        }
    }

    /**
     * Create new movimiento
     */
    async createMovimiento(
        movimiento: MovimientoCreateDTO
    ): Promise<Movimiento> {
        if (!movimiento.descripcion?.trim()) {
            throw new ApiError("Descripción is required");
        }
        if (!movimiento.monto || movimiento.monto <= 0) {
            throw new ApiError("Monto must be greater than 0");
        }
        if (!movimiento.categoriaId || movimiento.categoriaId <= 0) {
            throw new ApiError("Valid categoria ID is required");
        }

        const endpoint =
            movimiento.tipo === "INGRESO"
                ? `${API_ENDPOINTS.MOVIMIENTOS}/ingresos`
                : `${API_ENDPOINTS.MOVIMIENTOS}/gastos`;

        const params = buildParams({
            descripcion: movimiento.descripcion.trim(),
            monto: movimiento.monto,
            categoriaId: movimiento.categoriaId,
        });

        try {
            const response: AxiosResponse<MovimientoRawDTO> =
                await this.client.post(endpoint, undefined, { params });
            return mapMovimientoDto(response.data);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError("Failed to create movimiento", undefined, error);
        }
    }

    /**
     * Update existing movimiento
     */
    async updateMovimiento(
        movimiento: MovimientoUpdateDTO
    ): Promise<Movimiento> {
        if (!movimiento.id || movimiento.id <= 0) {
            throw new ApiError("Valid movimiento ID is required");
        }

        const params = buildParams({
            descripcion: movimiento.descripcion?.trim(),
            monto: movimiento.monto,
            categoriaId: (movimiento as unknown as Record<string, unknown>)
                .categoriaId,
        });

        try {
            const response: AxiosResponse<MovimientoRawDTO> =
                await this.client.put(
                    `${API_ENDPOINTS.MOVIMIENTOS}/${movimiento.id}`,
                    undefined,
                    { params }
                );
            return mapMovimientoDto(response.data);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError("Failed to update movimiento", undefined, error);
        }
    }

    /**
     * Delete movimiento by ID
     */
    async deleteMovimiento(id: number): Promise<void> {
        if (!id || id <= 0) {
            throw new ApiError("Invalid movimiento ID");
        }

        try {
            await this.client.delete(`${API_ENDPOINTS.MOVIMIENTOS}/${id}`);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError("Failed to delete movimiento", undefined, error);
        }
    }

    /**
     * Get movimientos list with optional filters
     */
    async getMovimientos(filtros?: FiltroMovimientos): Promise<Movimiento[]> {
        const params = buildParams({
            categoriaId: filtros?.categoriaId,
            tipo: filtros?.tipo,
            fechaDesde: filtros?.fechaDesde,
            fechaHasta: filtros?.fechaHasta,
            descripcion: filtros?.descripcion?.trim(),
        });

        try {
            const response: AxiosResponse<
                MovimientoRawDTO[] | PaginatedResponse<MovimientoRawDTO>
            > = await this.client.get(API_ENDPOINTS.MOVIMIENTOS, { params });

            // Handle both array and paginated responses
            const data = Array.isArray(response.data)
                ? response.data
                : (response.data as PaginatedResponse<MovimientoRawDTO>)
                      .content || [];

            return data.map(mapMovimientoDto);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError("Failed to get movimientos", undefined, error);
        }
    }

    /**
     * Get recent movimientos
     */
    async getUltimosMovimientos(limit: number = 5): Promise<Movimiento[]> {
        if (limit <= 0 || limit > 100) {
            throw new ApiError("Limit must be between 1 and 100");
        }

        try {
            const response: AxiosResponse<MovimientoRawDTO[]> =
                await this.client.get(
                    `${API_ENDPOINTS.MOVIMIENTOS}/recientes`,
                    { params: { limit } }
                );
            return (response.data || []).map(mapMovimientoDto);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError(
                      "Failed to get recent movimientos",
                      undefined,
                      error
                  );
        }
    }

    // CATEGORÍAS METHODS

    /**
     * Get all categorias
     */
    async getCategorias(): Promise<Categoria[]> {
        try {
            const response: AxiosResponse<Categoria[]> = await this.client.get(
                API_ENDPOINTS.CATEGORIAS
            );
            return response.data || [];
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError("Failed to get categorias", undefined, error);
        }
    }

    /**
     * Get categoria by ID
     */
    async getCategoriaById(id: number): Promise<Categoria> {
        if (!id || id <= 0) {
            throw new ApiError("Invalid categoria ID");
        }

        try {
            const response: AxiosResponse<Categoria> = await this.client.get(
                `${API_ENDPOINTS.CATEGORIAS}/${id}`
            );
            return response.data;
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError("Failed to get categoria", undefined, error);
        }
    }

    /**
     * Create new categoria
     */
    async createCategoria(categoria: CategoriaCreateDTO): Promise<Categoria> {
        if (!categoria.nombre?.trim()) {
            throw new ApiError("Categoria nombre is required");
        }

        const payload: Record<string, unknown> = {
            nombre: categoria.nombre.trim(),
        };

        if (categoria.descripcion && categoria.descripcion.trim()) {
            payload.descripcion = categoria.descripcion.trim();
        }

        try {
            const response: AxiosResponse<Categoria> = await this.client.post(
                API_ENDPOINTS.CATEGORIAS,
                payload
            );
            return response.data;
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError("Failed to create categoria", undefined, error);
        }
    }

    /**
     * Update existing categoria
     */
    async updateCategoria(categoria: CategoriaUpdateDTO): Promise<Categoria> {
        if (!categoria.id || categoria.id <= 0) {
            throw new ApiError("Valid categoria ID is required");
        }

        const params = buildParams({
            nombre: categoria.nombre
                ? String(categoria.nombre).trim()
                : undefined,
            descripcion: categoria.descripcion
                ? String(categoria.descripcion).trim()
                : undefined,
        });

        try {
            console.debug("[api] updateCategoria -> sending PUT", {
                url: `${API_ENDPOINTS.CATEGORIAS}/${categoria.id}`,
                params,
            });
            const response: AxiosResponse<Categoria> = await this.client.put(
                `${API_ENDPOINTS.CATEGORIAS}/${categoria.id}`,
                undefined,
                { params }
            );
            console.debug("[api] updateCategoria -> response", {
                status: response.status,
                data: response.data,
            });
            return response.data;
        } catch (error) {
            // log detailed error info for debugging in devtools
            try {
                if (error instanceof ApiError) {
                    type AxiosErrorLike = {
                        response?: { status?: number; data?: unknown };
                        config?: unknown;
                    };
                    const orig =
                        error.originalError as unknown as AxiosErrorLike;
                    console.error("[api] updateCategoria -> ApiError", {
                        message: error.message,
                        apiErrorStatus: error.status,
                        originalResponseStatus: orig?.response?.status,
                        originalResponseData: orig?.response?.data,
                        originalConfig: orig?.config,
                    });
                } else {
                    console.error("[api] updateCategoria -> error", error);
                }
            } catch {
                console.error(
                    "[api] updateCategoria -> error (no details)",
                    error
                );
            }
            throw error instanceof ApiError
                ? error
                : new ApiError("Failed to update categoria", undefined, error);
        }
    }

    /**
     * Delete categoria by ID
     */
    async deleteCategoria(id: number): Promise<void> {
        if (!id || id <= 0) {
            throw new ApiError("Invalid categoria ID");
        }

        try {
            await this.client.delete(`${API_ENDPOINTS.CATEGORIAS}/${id}`);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError("Failed to delete categoria", undefined, error);
        }
    }

    // REPORTS AND STATISTICS METHODS

    /**
     * Get financial summary
     */
    async getResumenFinanciero(): Promise<ResumenFinanciero> {
        try {
            const [estadisticasResp, movimientosResp] = await Promise.all([
                this.client.get<EstadisticasDTO>(
                    `${API_ENDPOINTS.MOVIMIENTOS}/estadisticas`
                ),
                this.client.get<
                    MovimientoRawDTO[] | PaginatedResponse<MovimientoRawDTO>
                >(API_ENDPOINTS.MOVIMIENTOS),
            ]);

            const stats = estadisticasResp.data || {};

            // Count movimientos from response
            const movimientosData = Array.isArray(movimientosResp.data)
                ? movimientosResp.data
                : (movimientosResp.data as PaginatedResponse<MovimientoRawDTO>)
                      .content || [];

            return {
                totalIngresos: toNumberSafe(stats.totalIngresos),
                totalGastos: toNumberSafe(stats.totalGastos),
                balance: toNumberSafe(stats.balance),
                movimientosCount: movimientosData.length,
            };
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError(
                      "Failed to get financial summary",
                      undefined,
                      error
                  );
        }
    }

    /**
     * Get summary by categories
     */
    async getResumenPorCategorias(): Promise<CategoriaResumen[]> {
        try {
            // Prefer server-provided stats but compute full breakdown client-side
            // to guarantee movimientosCount and income/expense per category.
            const resp: AxiosResponse<
                MovimientoRawDTO[] | PaginatedResponse<MovimientoRawDTO>
            > = await this.client.get(API_ENDPOINTS.MOVIMIENTOS);

            const movimientosRaw = Array.isArray(resp.data)
                ? resp.data
                : (resp.data as PaginatedResponse<MovimientoRawDTO>).content ||
                  [];

            const movimientos = movimientosRaw.map(mapMovimientoDto);

            const mapByCategoria: Record<
                string,
                {
                    categoria: Categoria;
                    ingresos: number;
                    gastos: number;
                    count: number;
                }
            > = {};

            movimientos.forEach((m) => {
                const nombre = m.categoria?.nombre || "Sin categoría";
                const key = nombre;
                if (!mapByCategoria[key]) {
                    mapByCategoria[key] = {
                        categoria: m.categoria || createDefaultCategoria(),
                        ingresos: 0,
                        gastos: 0,
                        count: 0,
                    };
                }
                if (m.tipo === "INGRESO")
                    mapByCategoria[key].ingresos += m.monto || 0;
                else mapByCategoria[key].gastos += Math.abs(m.monto || 0);
                mapByCategoria[key].count += 1;
            });

            const entries = Object.values(mapByCategoria);
            const totalGastos =
                entries.reduce((s, e) => s + (e.gastos || 0), 0) || 0;

            return entries.map((e) => ({
                categoria: e.categoria,
                totalGastos: e.gastos,
                totalIngresos: e.ingresos,
                movimientosCount: e.count,
                porcentaje:
                    totalGastos > 0 ? (e.gastos / totalGastos) * 100 : 0,
            }));
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError(
                      "Failed to get category summary",
                      undefined,
                      error
                  );
        }
    }

    /**
     * Get monthly summary
     */
    async getResumenMensual(year?: number): Promise<ResumenMensual[]> {
        try {
            // Try to get server-provided monthly resumen first
            const statsResp: AxiosResponse<EstadisticasDTO> =
                await this.client.get(
                    `${API_ENDPOINTS.MOVIMIENTOS}/estadisticas`
                );

            const stats = statsResp.data || {};
            const resumenMensual = stats.resumenMensual;

            if (Array.isArray(resumenMensual) && resumenMensual.length > 0) {
                const items = (resumenMensual as unknown[]).map(
                    (item: unknown) => {
                        const obj = item as Record<string, unknown>;
                        return {
                            mes: String(obj.mes || obj.month || ""),
                            ano: Number(obj.ano || new Date().getFullYear()),
                            totalIngresos: toNumberSafe(
                                obj.ingresos ?? obj.totalIngresos
                            ),
                            totalGastos: toNumberSafe(
                                obj.gastos ?? obj.totalGastos
                            ),
                            balance: toNumberSafe(obj.balance),
                        };
                    }
                );
                return year ? items.filter((item) => item.ano === year) : items;
            }

            // If server didn't provide a monthly series, build it from movimientos
            const resp: AxiosResponse<
                MovimientoRawDTO[] | PaginatedResponse<MovimientoRawDTO>
            > = await this.client.get(API_ENDPOINTS.MOVIMIENTOS);

            const movimientosRaw = Array.isArray(resp.data)
                ? resp.data
                : (resp.data as PaginatedResponse<MovimientoRawDTO>).content ||
                  [];

            const movimientos = movimientosRaw.map(mapMovimientoDto);

            const targetYear = year || new Date().getFullYear();

            // Initialize months 1..12 with zeros
            const months = Array.from({ length: 12 }, (_, i) => ({
                mes: String(i + 1),
                ano: targetYear,
                totalIngresos: 0,
                totalGastos: 0,
                balance: 0,
            }));

            movimientos.forEach((m) => {
                const d = new Date(m.fechaMovimiento);
                const y = d.getFullYear();
                if (y !== targetYear) return;
                const monthIdx = d.getMonth();
                if (m.tipo === "INGRESO")
                    months[monthIdx].totalIngresos += m.monto || 0;
                else months[monthIdx].totalGastos += Math.abs(m.monto || 0);
                months[monthIdx].balance =
                    months[monthIdx].totalIngresos -
                    months[monthIdx].totalGastos;
            });

            return months;
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError(
                      "Failed to get monthly summary",
                      undefined,
                      error
                  );
        }
    }
}

// Export singleton instance
export const apiService = new ApiService();
export { ApiError };
export default ApiService;
