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
import { CHART_CONFIG } from "../constants";
import { getColorForCategory } from "../utils/colors";
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
    BarChart3,
    Calendar,
    TrendingUp,
    PieChart as PieChartIcon,
} from "lucide-react";

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
            // Use backend color if provided, otherwise assign deterministic color by name
            color:
                item.categoria.color ||
                getColorForCategory(item.categoria.nombre, index),
            movimientos: item.movimientosCount,
        })) || [];

    // Preparar datos para el gráfico mensual
    const monthNames = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
    ];

    const mensualChartData =
        resumenMensual?.map((item, idx) => {
            // item.mes can be string or number; attempt to parse to int (1-12)
            const parsed = Number(item.mes);
            const mesLabel =
                Number.isFinite(parsed) && parsed >= 1 && parsed <= 12
                    ? monthNames[parsed - 1]
                    : item.mes || monthNames[idx % 12];

            return {
                mes: mesLabel,
                ingresos: item.totalIngresos,
                gastos: Math.abs(item.totalGastos),
                balance: item.balance,
            };
        }) || [];

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
                                    {/** Filter data first and map cells to filtered array to ensure colors align with slices */}
                                    {(() => {
                                        const pieData =
                                            categoriasChartData.filter(
                                                (item) => item.gastos > 0
                                            );
                                        return (
                                            <>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="gastos"
                                                >
                                                    {pieData.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    entry.color
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Pie>
                                            </>
                                        );
                                    })()}
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
                                    <XAxis
                                        dataKey="mes"
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        tickFormatter={(value) =>
                                            formatCurrency(value)
                                        }
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
                                        stroke={CHART_CONFIG.COLORS.SUCCESS}
                                        name={t("movements.income")}
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="gastos"
                                        stroke={CHART_CONFIG.COLORS.DANGER}
                                        name={t("movements.expenses")}
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="balance"
                                        stroke={CHART_CONFIG.COLORS.PRIMARY}
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
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                                            {t("movements.category")}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                                            {t("movements.income")}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                                            {t("movements.expenses")}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                                            {t("dashboard.balance")}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                                            {t("dashboard.movements")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
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
                                            <td className="px-4 py-2 text-green-600 dark:text-green-400">
                                                {formatCurrency(
                                                    categoria.ingresos
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-red-600 dark:text-red-400">
                                                {formatCurrency(
                                                    categoria.gastos
                                                )}
                                            </td>
                                            <td
                                                className={`px-4 py-2 ${
                                                    categoria.ingresos -
                                                        categoria.gastos >=
                                                    0
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-red-600 dark:text-red-400"
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
