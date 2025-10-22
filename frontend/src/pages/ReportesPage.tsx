import { useState, useEffect } from "react";

interface EstadisticasData {
    totalIngresos: number;
    totalGastos: number;
    balance: number;
    gastosPorCategoria: { [key: string]: number };
    ingresosPorMes: { [key: string]: number };
}

interface MovimientoReciente {
    id: number;
    descripcion: string;
    monto: number;
    tipo: 'GASTO' | 'INGRESO';
    categoria: {
        nombre: string;
    };
    fechaFormateada: string;
    montoFormateado: string;
}

export function ReportesPage() {
    const [estadisticas, setEstadisticas] = useState<EstadisticasData | null>(null);
    const [movimientos, setMovimientos] = useState<MovimientoReciente[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('mes');

    useEffect(() => {
        loadReportData();
    }, [period]);

    const loadReportData = async () => {
        try {
            setLoading(true);
            
            // Cargar estadísticas
            const estadisticasResponse = await fetch('http://localhost:8080/api/movimientos/estadisticas', {
                credentials: 'include'
            });
            const estadisticasData = await estadisticasResponse.json();
            setEstadisticas(estadisticasData);

            // Cargar movimientos recientes para análisis
            const movimientosResponse = await fetch('http://localhost:8080/api/movimientos', {
                credentials: 'include'
            });
            const movimientosData = await movimientosResponse.json();
            setMovimientos(movimientosData);

        } catch (error) {
            console.error('Error loading report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoriasList = () => {
        if (!estadisticas?.gastosPorCategoria) return [];
        return Object.entries(estadisticas.gastosPorCategoria).map(([nombre, monto]) => ({
            nombre,
            monto,
            porcentaje: (monto / estadisticas.totalGastos) * 100
        }));
    };

    const getTopCategorias = () => {
        return getCategoriasList()
            .sort((a, b) => b.monto - a.monto)
            .slice(0, 5);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        📊 Reportes y Análisis
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Analiza tu comportamiento financiero
                    </p>
                </div>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="semana">Esta semana</option>
                    <option value="mes">Este mes</option>
                    <option value="trimestre">Este trimestre</option>
                    <option value="año">Este año</option>
                </select>
            </div>

            {/* Summary Overview */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100">Ingresos Totales</p>
                            <p className="text-3xl font-bold">
                                ${estadisticas?.totalIngresos?.toFixed(2) || '0.00'}
                            </p>
                        </div>
                        <div className="text-4xl opacity-80">💰</div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100">Gastos Totales</p>
                            <p className="text-3xl font-bold">
                                ${Math.abs(estadisticas?.totalGastos || 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="text-4xl opacity-80">💸</div>
                    </div>
                </div>

                <div className={`rounded-lg p-6 text-white ${
                    (estadisticas?.balance || 0) >= 0 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-r from-orange-500 to-orange-600'
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="opacity-80">Balance Neto</p>
                            <p className="text-3xl font-bold">
                                ${estadisticas?.balance?.toFixed(2) || '0.00'}
                            </p>
                        </div>
                        <div className="text-4xl opacity-80">
                            {(estadisticas?.balance || 0) >= 0 ? '📈' : '📉'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Gastos por Categoria */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        💳 Gastos por Categoria
                    </h2>
                    {getTopCategorias().length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">📊</div>
                            <p className="text-gray-500">No hay datos suficientes para mostrar</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {getTopCategorias().map((categoria, index) => (
                                <div key={categoria.nombre} className="flex items-center gap-4">
                                    <div className="w-8 text-center">
                                        <span className="text-lg">
                                            {['🥇', '🥈', '🥉', '🏅', '⭐'][index] || '📌'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-gray-900">
                                                {categoria.nombre}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                ${categoria.monto.toFixed(2)} ({categoria.porcentaje.toFixed(1)}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${categoria.porcentaje}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tendencias Recientes */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        📈 Tendencias Recientes
                    </h2>
                    <div className="space-y-6">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">💰</span>
                                <h3 className="font-semibold text-blue-900">Promedio de Ingresos</h3>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                                ${((estadisticas?.totalIngresos || 0) / Math.max(movimientos.filter(m => m.tipo === 'INGRESO').length, 1)).toFixed(2)}
                            </p>
                            <p className="text-sm text-blue-600 mt-1">Por transacción de ingreso</p>
                        </div>

                        <div className="p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">💸</span>
                                <h3 className="font-semibold text-red-900">Promedio de Gastos</h3>
                            </div>
                            <p className="text-2xl font-bold text-red-600">
                                ${(Math.abs(estadisticas?.totalGastos || 0) / Math.max(movimientos.filter(m => m.tipo === 'GASTO').length, 1)).toFixed(2)}
                            </p>
                            <p className="text-sm text-red-600 mt-1">Por transacción de gasto</p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">📊</span>
                                <h3 className="font-semibold text-green-900">Total de Transacciones</h3>
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                                {movimientos.length}
                            </p>
                            <p className="text-sm text-green-600 mt-1">Movimientos registrados</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resumen Financiero */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    📋 Resumen del Período
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center p-4 border rounded-lg">
                        <div className="text-3xl mb-2">🏦</div>
                        <p className="text-sm text-gray-600">Ratio Ahorro</p>
                        <p className="text-lg font-bold text-blue-600">
                            {estadisticas?.totalIngresos 
                                ? (((estadisticas.balance || 0) / estadisticas.totalIngresos) * 100).toFixed(1)
                                : '0'
                            }%
                        </p>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                        <div className="text-3xl mb-2">🎯</div>
                        <p className="text-sm text-gray-600">Categorias Activas</p>
                        <p className="text-lg font-bold text-purple-600">
                            {Object.keys(estadisticas?.gastosPorCategoria || {}).length}
                        </p>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                        <div className="text-3xl mb-2">⚖️</div>
                        <p className="text-sm text-gray-600">Estado Financiero</p>
                        <p className={`text-lg font-bold ${
                            (estadisticas?.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {(estadisticas?.balance || 0) >= 0 ? 'Positivo' : 'Déficit'}
                        </p>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                        <div className="text-3xl mb-2">📅</div>
                        <p className="text-sm text-gray-600">Período</p>
                        <p className="text-lg font-bold text-indigo-600 capitalize">
                            {period}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}