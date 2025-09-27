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
import { Plus, Search, Edit2, Trash2, Tag, FolderPlus } from "lucide-react";
import {
    useCategorias,
    useCreateCategoria,
    useUpdateCategoria,
    useDeleteCategoria,
} from "../hooks/useCategorias";
import { useTranslation } from "../hooks/useTranslation";
import { type Categoria, type CategoriaCreateDTO } from "../types";

interface CategoriaFormData {
    nombre: string;
    descripcion: string;
}

export function Categorias() {
    const { t } = useTranslation();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");

    // Hooks de datos
    const { data: categorias, isLoading: isLoadingCategorias } =
        useCategorias();
    const createCategoria = useCreateCategoria();
    const updateCategoria = useUpdateCategoria();
    const deleteCategoria = useDeleteCategoria();

    // Estado del formulario
    const [formData, setFormData] = useState<CategoriaFormData>({
        nombre: "",
        descripcion: "",
    });

    // Filtrar categorías
    const filteredCategorias =
        categorias?.filter((categoria) => {
            return (
                categoria.nombre
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (categoria.descripcion &&
                    categoria.descripcion
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
            );
        }) || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const categoriaData: CategoriaCreateDTO = {
            nombre: formData.nombre,
            descripcion: formData.descripcion || undefined,
        };

        try {
            if (editingCategoria) {
                await updateCategoria.mutateAsync({
                    id: editingCategoria.id,
                    ...categoriaData,
                });
            } else {
                await createCategoria.mutateAsync(categoriaData);
            }
            resetForm();
        } catch (error) {
            console.error("Error al guardar categoría:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: "",
            descripcion: "",
        });
        setEditingCategoria(null);
        setIsFormVisible(false);
    };

    const handleEdit = (categoria: Categoria) => {
        setFormData({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion || "",
        });
        setEditingCategoria(categoria);
        setIsFormVisible(true);
    };

    const handleDelete = async (id: number, force?: boolean) => {
        // Confirm with user. If force=true, show stronger warning.
        const message = force
            ? t("categories.deleteConfirmForce") ||
              t("categories.deleteConfirm")
            : t("categories.deleteConfirm");

        if (window.confirm(message)) {
            try {
                await deleteCategoria.mutateAsync(id);
            } catch (error) {
                console.error("Error al eliminar categoría:", error);
            }
        }
    };

    if (isLoadingCategorias) {
        return <PageLoader text={t("categories.loading")} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {t("categories.title")}
                    </h2>
                    <p className="text-muted-foreground">
                        {t("categories.subtitle")}
                    </p>
                </div>
                <Button
                    onClick={() => setIsFormVisible(true)}
                    className="flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>{t("categories.newCategory")}</span>
                </Button>
            </div>

            {/* Barra de búsqueda */}
            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        type="text"
                        placeholder={t("categories.search")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Lista de categorías */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCategorias.length === 0 ? (
                    <div className="col-span-full">
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <FolderPlus className="w-12 h-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground text-center">
                                    {searchTerm
                                        ? t("categories.noFilteredCategories")
                                        : t("categories.noCategories")}
                                </p>
                                {!searchTerm && (
                                    <Button
                                        onClick={() => setIsFormVisible(true)}
                                        className="mt-4"
                                        variant="outline"
                                    >
                                        {t("categories.createFirst")}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    filteredCategorias.map((categoria) => (
                        <Card
                            key={categoria.id}
                            className="hover:shadow-md transition-shadow"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Tag className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                {categoria.nombre}
                                            </CardTitle>
                                            {categoria.descripcion && (
                                                <p className="text-sm text-muted-foreground">
                                                    {categoria.descripcion}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleEdit(categoria)
                                            }
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleDelete(
                                                    categoria.id,
                                                    categoria.esPredefinida
                                                )
                                            }
                                            disabled={deleteCategoria.isPending}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>

            {/* Formulario Modal */}
            {isFormVisible && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <Card className="max-w-md w-full mx-4">
                        <CardHeader>
                            <CardTitle>
                                {editingCategoria
                                    ? t("categories.editCategory")
                                    : t("categories.newCategory")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        {t("categories.nameRequired")}
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                nombre: e.target.value,
                                            })
                                        }
                                        placeholder={t(
                                            "categories.namePlaceholder"
                                        )}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        {t("categories.descriptionOptional")}
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
                                        placeholder={t(
                                            "categories.descriptionPlaceholder"
                                        )}
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={
                                            createCategoria.isPending ||
                                            updateCategoria.isPending
                                        }
                                    >
                                        {createCategoria.isPending ||
                                        updateCategoria.isPending
                                            ? t("categories.saving")
                                            : editingCategoria
                                            ? t("categories.update")
                                            : t("categories.create")}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={resetForm}
                                        className="flex-1"
                                    >
                                        {t("categories.cancel")}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
