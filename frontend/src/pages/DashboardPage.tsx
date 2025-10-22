import { useState, useEffect } from "react";
import { useSimpleAuth } from "../contexts/SimpleAuthContext";

interface ResumenFinanciero {
    totalIngresos: number;
    totalGastos: number;
    balance: number;
    movimientosCount: number;
}

interface UltimoMovimiento {
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

export function DashboardPage() {
    const { user } = useSimpleAuth();
    const [resumen, setResumen] = useState<ResumenFinanciero | null>(null);
    const [ultimosMovimientos, setUltimosMovimientos] = useState<UltimoMovimiento[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Cargar resumen financiero
            const resumenResponse = await fetch('http://localhost:8080/api/movimientos/estadisticas', {
                credentials: 'include'
            });
            const resumenData = await resumenResponse.json();
            
            // Transformar los datos del backend
            setResumen({
                totalIngresos: resumenData.totalIngresos || 0,
                totalGastos: Math.abs(resumenData.totalGastos || 0),
                balance: resumenData.balance || 0,
                movimientosCount: Object.keys(resumenData.gastosPorCategoria || {}).length
            });

            // Cargar últimos movimientos
            const movimientosResponse = await fetch('http://localhost:8080/api/movimientos/recientes?limit=5', {
                credentials: 'include'
            });
            const movimientosData = await movimientosResponse.json();
            setUltimosMovimientos(movimientosData);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
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
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    🏠 Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                    ¡Bienvenido de vuelta, {user?.nombreUsuario}! 👋
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Ingresos</p>
                            <p className="text-2xl font-bold text-green-600">
                                ${resumen?.totalIngresos?.toFixed(2) || '0.00'}
                            </p>
                        </div>
                        <div className="text-3xl">💰</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Gastos</p>
                            <p className="text-2xl font-bold text-red-600">
                                ${resumen?.totalGastos?.toFixed(2) || '0.00'}
                            </p>
                        </div>
                        <div className="text-3xl">💸</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Balance</p>
                            <p className={`text-2xl font-bold ${
                                (resumen?.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                ${resumen?.balance?.toFixed(2) || '0.00'}
                            </p>
                        </div>
                        <div className="text-3xl">⚖️</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Movimientos</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {ultimosMovimientos.length}
                            </p>
                        </div>
                        <div className="text-3xl">📊</div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Movimientos Recientes
                    </h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {ultimosMovimientos.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">💳</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay movimientos</h3>
                            <p className="text-gray-500">Crea tu primer movimiento para ver el resumen</p>
                        </div>
                    ) : (
                        ultimosMovimientos.map((movimiento) => (
                            <div key={movimiento.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl">
                                        {movimiento.tipo === 'INGRESO' ? '💰' : '💸'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {movimiento.descripcion}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {movimiento.categoria.nombre} • {movimiento.fechaFormateada}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${
                                        movimiento.tipo === 'INGRESO' 
                                            ? 'text-green-600' 
                                            : 'text-red-600'
                                    }`}>
                                        {movimiento.tipo === 'INGRESO' ? '+' : '-'}{movimiento.montoFormateado}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Acciones Rápidas
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <a
                        href="/movimientos"
                        className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                        <span className="text-2xl">💳</span>
                        <div>
                            <p className="font-medium text-blue-900">Nuevo Movimiento</p>
                            <p className="text-sm text-blue-600">Registrar gasto/ingreso</p>
                        </div>
                    </a>

                    <a
                        href="/categorias"
                        className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                        <span className="text-2xl">🏷️</span>
                        <div>
                            <p className="font-medium text-green-900">Nueva Categoria</p>
                            <p className="text-sm text-green-600">Organizar movimientos</p>
                        </div>
                    </a>

                    <a
                        href="/reportes"
                        className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                        <span className="text-2xl">📊</span>
                        <div>
                            <p className="font-medium text-purple-900">Ver Reportes</p>
                            <p className="text-sm text-purple-600">Análisis detallado</p>
                        </div>
                    </a>

                    <a
                        href="/configuracion"
                        className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <span className="text-2xl">⚙️</span>
                        <div>
                            <p className="font-medium text-gray-900">Configuracion</p>
                            <p className="text-sm text-gray-600">Ajustar preferencias</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}