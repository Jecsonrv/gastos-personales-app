import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    PageLoader,
} from "../components/ui";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
} from "lucide-react";
import {
    useMovimientos,
    useCreateMovimiento,
    useUpdateMovimiento,
    useDeleteMovimiento,
} from "../hooks/useMovimientos";
import { useCategorias } from "../hooks/useCategorias";
import {
    useAppConfig,
    formatCurrencyWithConfig,
    formatDateWithConfig,
} from "../hooks/useAppConfig";
import { useTranslation } from "../hooks/useTranslation";
import {
    TipoMovimiento,
    type Movimiento,
    type MovimientoCreateDTO,
} from "../types";

interface MovimientoFormData {
    descripcion: string;
    monto: string;
    fechaMovimiento: string;
    tipo: TipoMovimiento;
    categoriaId: string;
}

export function Movimientos() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingMovimiento, setEditingMovimiento] =
        useState<Movimiento | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTipo, setFilterTipo] = useState<TipoMovimiento | "">("");

    // Hook para configuración con actualización automática
    const appConfig = useAppConfig();
    const { t } = useTranslation();

    // Hooks de datos
    const { data: movimientos, isLoading: isLoadingMovimientos } =
        useMovimientos();
    const { data: categorias, isLoading: isLoadingCategorias } =
        useCategorias();
    const createMovimiento = useCreateMovimiento();
    const updateMovimiento = useUpdateMovimiento();
    const deleteMovimiento = useDeleteMovimiento();

    // Estado del formulario
    const [formData, setFormData] = useState<MovimientoFormData>({
        descripcion: "",
        monto: "",
        fechaMovimiento: new Date().toISOString().split("T")[0],
        tipo: TipoMovimiento.GASTO,
        categoriaId: "",
    });

    // Filtrar movimientos
    const filteredMovimientos =
        movimientos?.filter((movimiento) => {
            const matchesSearch =
                movimiento.descripcion
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                movimiento.categoria.nombre
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const matchesTipo = !filterTipo || movimiento.tipo === filterTipo;
            return matchesSearch && matchesTipo;
        }) || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const movimientoData: MovimientoCreateDTO = {
            descripcion: formData.descripcion,
            monto: parseFloat(formData.monto),
            fechaMovimiento: formData.fechaMovimiento,
            tipo: formData.tipo,
            categoriaId: parseInt(formData.categoriaId),
        };

        try {
            if (editingMovimiento) {
                await updateMovimiento.mutateAsync({
                    id: editingMovimiento.id,
                    ...movimientoData,
                });
            } else {
                await createMovimiento.mutateAsync(movimientoData);
            }

            resetForm();
        } catch (error) {
            console.error("Error al guardar movimiento:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            descripcion: "",
            monto: "",
            fechaMovimiento: new Date().toISOString().split("T")[0],
            tipo: TipoMovimiento.GASTO,
            categoriaId: "",
        });
        setEditingMovimiento(null);
        setIsFormVisible(false);
    };

    const handleEdit = (movimiento: Movimiento) => {
        setFormData({
            descripcion: movimiento.descripcion,
            monto: movimiento.monto.toString(),
            fechaMovimiento: movimiento.fechaMovimiento.split("T")[0],
            tipo: movimiento.tipo,
            categoriaId: movimiento.categoria.id.toString(),
        });
        setEditingMovimiento(movimiento);
        setIsFormVisible(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm(t("movements.deleteConfirm"))) {
            try {
                await deleteMovimiento.mutateAsync(id);
            } catch (error) {
                console.error("Error al eliminar movimiento:", error);
            }
        }
    };

    if (isLoadingMovimientos || isLoadingCategorias) {
        return <PageLoader text={t("movements.loading")} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    {t("movements.title")}
                </h2>
                <Button
                    onClick={() => setIsFormVisible(true)}
                    className="flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>{t("movements.newMovement")}</span>
                </Button>
            </div>

            {/* Filtros */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                type="text"
                                placeholder={t("movements.search")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <select
                                value={filterTipo}
                                onChange={(e) =>
                                    setFilterTipo(
                                        e.target.value as TipoMovimiento | ""
                                    )
                                }
                                className="px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="">
                                    {t("movements.allTypes")}
                                </option>
                                <option value={TipoMovimiento.INGRESO}>
                                    {t("movements.income")}
                                </option>
                                <option value={TipoMovimiento.GASTO}>
                                    {t("movements.expenses")}
                                </option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Formulario Modal */}
            {isFormVisible && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <Card className="max-w-md w-full mx-4">
                        <CardHeader>
                            <CardTitle>
                                {editingMovimiento
                                    ? t("movements.editMovement")
                                    : t("movements.newMovement")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        {t("movements.description")}
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.descripcion}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                descripcion: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        {t("movements.amount")}
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.monto}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                monto: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        {t("movements.date")}
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.fechaMovimiento}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                fechaMovimiento: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        {t("movements.type")}
                                    </label>
                                    <select
                                        value={formData.tipo}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tipo: e.target
                                                    .value as TipoMovimiento,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                        required
                                    >
                                        <option value={TipoMovimiento.GASTO}>
                                            {t("movements.expense")}
                                        </option>
                                        <option value={TipoMovimiento.INGRESO}>
                                            {t("movements.income")}
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        {t("movements.category")}
                                    </label>
                                    <select
                                        value={formData.categoriaId}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                categoriaId: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                        required
                                    >
                                        <option value="">
                                            {t("movements.selectCategory")}
                                        </option>
                                        {categorias?.map((categoria) => (
                                            <option
                                                key={categoria.id}
                                                value={categoria.id}
                                            >
                                                {categoria.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={
                                            createMovimiento.isPending ||
                                            updateMovimiento.isPending
                                        }
                                    >
                                        {createMovimiento.isPending ||
                                        updateMovimiento.isPending
                                            ? t("movements.saving")
                                            : editingMovimiento
                                            ? t("movements.update")
                                            : t("movements.create")}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={resetForm}
                                        className="flex-1"
                                    >
                                        {t("movements.cancel")}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Lista de movimientos */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("movements.listTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredMovimientos.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">
                                {searchTerm || filterTipo
                                    ? t("movements.noFilteredMovements")
                                    : t("movements.noMovements")}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {t("movements.movement")}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {t("movements.category")}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {t("movements.date")}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {t("movements.amount")}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {t("movements.actions")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-background divide-y divide-border">
                                    {filteredMovimientos.map((movimiento) => (
                                        <tr
                                            key={movimiento.id}
                                            className="hover:bg-muted/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {/* Option B: icon-only (no colored circle) for light mode */}
                                                    {/* Option A: filled circle with stronger icon color for light mode */}
                                                    <div
                                                        className={`mr-3 p-2 rounded-full flex items-center justify-center ${
                                                            movimiento.tipo ===
                                                            TipoMovimiento.INGRESO
                                                                ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-800/40 dark:text-emerald-200"
                                                                : "bg-rose-100 text-rose-900 dark:bg-rose-800/40 dark:text-rose-200"
                                                        }`}
                                                    >
                                                        {movimiento.tipo ===
                                                        TipoMovimiento.INGRESO ? (
                                                            <ArrowUpRight className="w-5 h-5" />
                                                        ) : (
                                                            <ArrowDownRight className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-foreground">
                                                            {
                                                                movimiento.descripcion
                                                            }
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {movimiento.tipo}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                    {
                                                        movimiento.categoria
                                                            .nombre
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {formatDateWithConfig(
                                                    movimiento.fechaMovimiento,
                                                    appConfig
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`text-sm font-semibold ${
                                                        movimiento.tipo ===
                                                        TipoMovimiento.INGRESO
                                                            ? "text-green-600 dark:text-green-400"
                                                            : "text-red-600 dark:text-red-400"
                                                    }`}
                                                    aria-label={
                                                        movimiento.tipo ===
                                                        TipoMovimiento.INGRESO
                                                            ? t(
                                                                  "movements.income"
                                                              )
                                                            : t(
                                                                  "movements.expense"
                                                              )
                                                    }
                                                >
                                                    {movimiento.tipo ===
                                                    TipoMovimiento.INGRESO
                                                        ? "+"
                                                        : "-"}
                                                    {formatCurrencyWithConfig(
                                                        Math.abs(
                                                            movimiento.monto
                                                        ),
                                                        appConfig
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                movimiento
                                                            )
                                                        }
                                                        className="text-primary hover:text-primary/80 transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                movimiento.id
                                                            )
                                                        }
                                                        className="text-destructive hover:text-destructive/80 transition-colors"
                                                        disabled={
                                                            deleteMovimiento.isPending
                                                        }
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
