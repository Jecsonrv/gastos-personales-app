import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    PageLoader,
    Loader,
} from "../components/ui";
import {
    useResumenFinanciero,
    useUltimosMovimientos,
    useResumenMensual,
} from "../hooks/useReportes";
import {
    useAppConfig,
    formatCurrencyWithConfig,
    formatDateWithConfig,
} from "../hooks/useAppConfig";
import { useTranslation } from "../hooks/useTranslation";
import { TipoMovimiento } from "../types";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { useMemo } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

export function Dashboard() {
    const { data: resumen, isLoading: isLoadingResumen } =
        useResumenFinanciero();
    const { data: ultimosMovimientos, isLoading: isLoadingMovimientos } =
        useUltimosMovimientos(5);
    const { data: resumenMensual, isLoading: isLoadingMensual } =
        useResumenMensual(new Date().getFullYear());

    // Hook para configuración con actualización automática
    const appConfig = useAppConfig();
    const { t } = useTranslation();

    const normalizedMensual = useMemo(() => {
        if (!resumenMensual) return [];
        const mapped = resumenMensual
            .map((m) => {
                const mesNum = Number(m.mes);
                const ano = Number(m.ano) || new Date().getFullYear();
                const ingresos = Number(m.totalIngresos || 0) || 0;
                const totalGastos = Number(m.totalGastos || 0) || 0;
                const gastos = Math.abs(totalGastos);
                const balance = Number(m.balance ?? ingresos - totalGastos);

                let mesLabel = String(m.mes);
                if (!Number.isNaN(mesNum) && mesNum >= 1 && mesNum <= 12) {
                    try {
                        mesLabel = new Date(ano, mesNum - 1).toLocaleString(
                            undefined,
                            {
                                month: "short",
                            }
                        );
                    } catch (e) {
                        mesLabel = String(m.mes);
                    }
                }

                return {
                    mesNum: Number.isNaN(mesNum) ? 0 : mesNum,
                    ano,
                    mesLabel,
                    ingresos,
                    gastos,
                    balance,
                };
            })
            .sort((a, b) => a.ano - b.ano || a.mesNum - b.mesNum);

        return mapped;
    }, [resumenMensual]);

    if (isLoadingResumen) {
        return <PageLoader text={t("dashboard.loading")} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    {t("dashboard.title")}
                </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("dashboard.totalIncome")}
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatCurrencyWithConfig(
                                resumen?.totalIngresos || 0,
                                appConfig
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("dashboard.accumulatedIncome")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("dashboard.totalExpenses")}
                        </CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {formatCurrencyWithConfig(
                                resumen?.totalGastos || 0,
                                appConfig
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("dashboard.accumulatedExpenses")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("dashboard.balance")}
                        </CardTitle>
                        <DollarSign
                            className={`h-4 w-4 ${
                                (resumen?.balance || 0) >= 0
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                            }`}
                        />
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`text-2xl font-bold ${
                                (resumen?.balance || 0) >= 0
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                            }`}
                        >
                            {formatCurrencyWithConfig(
                                resumen?.balance || 0,
                                appConfig
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("dashboard.incomeExpenseDiff")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("dashboard.movements")}
                        </CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">
                            {resumen?.movimientosCount || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("dashboard.totalTransactions")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>{t("dashboard.summary")}</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {isLoadingMensual ? (
                            <div className="h-[300px] flex items-center justify-center">
                                <Loader
                                    size="sm"
                                    text={t("dashboard.loading")}
                                />
                            </div>
                        ) : resumenMensual && resumenMensual.length > 0 ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={normalizedMensual}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="mesLabel" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(
                                                value: number | string
                                            ) => {
                                                const num = Number(value) || 0;
                                                return formatCurrencyWithConfig(
                                                    num,
                                                    appConfig
                                                );
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="ingresos"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="gastos"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="balance"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                {t("dashboard.noChartData")}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>{t("dashboard.recentMovements")}</CardTitle>
                        <CardDescription>
                            {t("dashboard.recentMovementsDesc")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingMovimientos ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader
                                    size="sm"
                                    text={t("dashboard.loadingMovements")}
                                />
                            </div>
                        ) : ultimosMovimientos &&
                          ultimosMovimientos.length > 0 ? (
                            <div className="space-y-4">
                                {ultimosMovimientos.map((movimiento) => (
                                    <div
                                        key={movimiento.id}
                                        className="flex items-center"
                                    >
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {movimiento.descripcion}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {movimiento.categoria.nombre} •{" "}
                                                {formatDateWithConfig(
                                                    movimiento.fechaMovimiento,
                                                    appConfig
                                                )}
                                            </p>
                                        </div>
                                        <div
                                            className={`ml-auto font-medium ${
                                                movimiento.tipo ===
                                                TipoMovimiento.INGRESO
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-red-600 dark:text-red-400"
                                            }`}
                                        >
                                            {movimiento.tipo ===
                                            TipoMovimiento.INGRESO
                                                ? "+"
                                                : "-"}
                                            {formatCurrencyWithConfig(
                                                Math.abs(movimiento.monto),
                                                appConfig
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-muted-foreground">
                                    {t("dashboard.noRecentMovements")}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
