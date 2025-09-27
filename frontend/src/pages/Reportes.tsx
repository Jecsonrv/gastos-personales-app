import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    PageLoader,
    Loader,
} from "../components/ui";
import {
    useResumenCategorias,
    useResumenMensual,
    useResumenFinanciero,
} from "../hooks/useReportes";
import { useTranslation } from "../hooks/useTranslation";
import { useAppConfig } from "../hooks/useAppConfig";
import { formatCurrency } from "../utils";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import {
    Calendar,
    TrendingUp,
    PieChart as PieChartIcon,
    BarChart3,
} from "lucide-react";

// Colores para los gráficos
const COLORS = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#84cc16",
    "#f97316",
    "#6366f1",
];

export function Reportes() {
    const { t } = useTranslation();
    // config intentionally unused for now - kept for future formatting hooks
    void useAppConfig();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const { data: resumenCategorias, isLoading: isLoadingCategorias } =
        useResumenCategorias();
    const { data: resumenFinanciero } = useResumenFinanciero();
    const { data: resumenMensual, isLoading: isLoadingMensual } =
        useResumenMensual(selectedYear);

    // Preparar datos para el gráfico de categorías
    const categoriasChartData =
        resumenCategorias?.map((item, index) => ({
            name: item.categoria.nombre,
            gastos: Math.abs(item.totalGastos),
            ingresos: item.totalIngresos,
            color: item.categoria.color || COLORS[index % COLORS.length],
            movimientos: item.movimientosCount,
        })) || [];

    // Preparar datos para el gráfico mensual
    const mensualChartData =
        resumenMensual?.map((item) => ({
            mes:
                item.mes ||
                new Date(0, parseInt(item.mes) - 1).toLocaleString("es", {
                    month: "short",
                }),
            ingresos: item.totalIngresos,
            gastos: Math.abs(item.totalGastos),
            balance: item.balance,
        })) || [];

    // Obtener años disponibles para el selector
    const currentYear = new Date().getFullYear();
    const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

    if (isLoadingCategorias && isLoadingMensual) {
        return <PageLoader text={t("reports.loading")} />;
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    {t("reports.title")}
                </h2>
                <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <select
                        value={selectedYear}
                        onChange={(e) =>
                            setSelectedYear(parseInt(e.target.value))
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Resumen de totales */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    {t("dashboard.totalIncome")}
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(
                                        resumenFinanciero?.totalIngresos || 0
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <BarChart3 className="w-8 h-8 text-red-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    {t("reports.totalExpenses")}
                                </p>
                                <p className="text-2xl font-bold text-red-600">
                                    {formatCurrency(
                                        Math.abs(
                                            resumenFinanciero?.totalGastos || 0
                                        )
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <PieChartIcon className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    {t("dashboard.balance")}
                                </p>
                                <p
                                    className={`text-2xl font-bold ${
                                        (resumenCategorias?.reduce(
                                            (sum, cat) =>
                                                sum +
                                                cat.totalIngresos +
                                                cat.totalGastos,
                                            0
                                        ) || 0) >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {formatCurrency(
                                        resumenFinanciero?.balance || 0
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Gráfico de gastos por categoría */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("reports.categoryExpenses")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingCategorias ? (
                            <div className="h-[300px] flex items-center justify-center">
                                <Loader size="sm" text={t("reports.loading")} />
                            </div>
                        ) : categoriasChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoriasChartData.filter(
                                            (item) => item.gastos > 0
                                        )}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="gastos"
                                    >
                                        {categoriasChartData.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            )
                                        )}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => [
                                            formatCurrency(value),
                                            t("movements.expenses"),
                                        ]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                {t("reports.noData")}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Gráfico de evolución mensual */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t("reports.monthlyEvolution")} {selectedYear}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingMensual ? (
                            <div className="h-[300px] flex items-center justify-center">
                                <Loader size="sm" text={t("reports.loading")} />
                            </div>
                        ) : mensualChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={mensualChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        formatter={(
                                            value: number,
                                            name: string
                                        ) => [
                                            formatCurrency(value),
                                            name === "ingresos"
                                                ? t("movements.income")
                                                : name === "gastos"
                                                ? t("movements.expenses")
                                                : t("dashboard.balance"),
                                        ]}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="ingresos"
                                        stroke="#10b981"
                                        name={t("movements.income")}
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="gastos"
                                        stroke="#ef4444"
                                        name={t("movements.expenses")}
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="balance"
                                        stroke="#3b82f6"
                                        name={t("dashboard.balance")}
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                {t("reports.noData")} {selectedYear}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Tabla de categorías */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("reports.categoryBreakdown")}</CardTitle>
                </CardHeader>
                <CardContent>
                    {categoriasChartData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                            {t("movements.category")}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                            {t("movements.income")}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                            {t("movements.expenses")}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                            {t("dashboard.balance")}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                            {t("dashboard.movements")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {categoriasChartData.map((categoria) => (
                                        <tr
                                            key={categoria.name}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-2">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-4 h-4 rounded-full mr-2"
                                                        style={{
                                                            backgroundColor:
                                                                categoria.color,
                                                        }}
                                                    />
                                                    {categoria.name}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-green-600">
                                                {formatCurrency(
                                                    categoria.ingresos
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-red-600">
                                                {formatCurrency(
                                                    categoria.gastos
                                                )}
                                            </td>
                                            <td
                                                className={`px-4 py-2 ${
                                                    categoria.ingresos -
                                                        categoria.gastos >=
                                                    0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {formatCurrency(
                                                    categoria.ingresos -
                                                        categoria.gastos
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-gray-600">
                                                {categoria.movimientos}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            {t("reports.noData")}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
