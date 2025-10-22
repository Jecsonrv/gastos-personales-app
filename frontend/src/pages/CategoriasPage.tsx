import { useState } from "react";
import { useCategorias, useCreateCategoria, useDeleteCategoria } from "../hooks/useCategorias";

export function CategoriasPage() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });
    const [error, setError] = useState<string>("");

    // Use React Query hooks
    const { data: categorias = [], isLoading: loading } = useCategorias();
    const createCategoria = useCreateCategoria();
    const deleteCategoria = useDeleteCategoria();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!formData.nombre.trim()) {
            setError("El nombre es obligatorio");
            return;
        }

        try {
            await createCategoria.mutateAsync({
                nombre: formData.nombre.trim(),
                descripcion: formData.descripcion.trim() || undefined
            });
            
            setFormData({ nombre: '', descripcion: '' });
            setShowForm(false);
        } catch (err: any) {
            setError(err.message || 'Error al crear categoria');
        }
    };

    const handleDelete = async (id: number, nombre: string) => {
        if (!window.confirm(`¿Estas seguro de eliminar la categoria "${nombre}"?`)) {
            return;
        }

        try {
            await deleteCategoria.mutateAsync(id);
        } catch (err: any) {
            alert(err.message || 'Error al eliminar categoria');
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">🏷️ Categorias</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    disabled={createCategoria.isPending}
                >
                    {showForm ? 'Cancelar' : 'Nueva Categoria'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                    <button onClick={() => setError("")} className="absolute top-0 right-0 px-4 py-3">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
            )}

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Crear Categoria</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nombre</label>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Entretenimiento"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Descripcion</label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Descripcion de la categoria"
                                rows={3}
                                required
                            />
                        </div>
                        
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                                disabled={createCategoria.isPending}
                            >
                                {createCategoria.isPending ? 'Creando...' : 'Crear Categoria'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setError("");
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                                disabled={createCategoria.isPending}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categorias.map((categoria) => (
                    <div key={categoria.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-lg text-gray-900">
                                {categoria.nombre}
                            </h3>
                            {categoria.esPredefinida && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    Sistema
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            {categoria.descripcion || 'Sin descripcion'}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                ID: {categoria.id}
                            </span>
                            <div className="flex gap-2">
                                {!categoria.esPredefinida && (
                                    <button 
                                        onClick={() => handleDelete(categoria.id, categoria.nombre)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                                        disabled={deleteCategoria.isPending}
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {categorias.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏷️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay categorias</h3>
                    <p className="text-gray-500">Crea tu primera categoria para organizar tus movimientos</p>
                </div>
            )}
        </div>
    );
}