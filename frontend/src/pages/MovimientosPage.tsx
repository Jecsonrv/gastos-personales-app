import { useState } from "react";
import { useMovimientos, useCreateMovimiento, useDeleteMovimiento } from "../hooks/useMovimientos";
import { useCategorias } from "../hooks/useCategorias";
import type { TipoMovimiento } from "../types";

export function MovimientosPage() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        descripcion: '',
        monto: '',
        categoriaId: '',
        tipo: 'GASTO' as TipoMovimiento,
        fechaMovimiento: new Date().toISOString().split('T')[0]
    });
    const [error, setError] = useState<string>("");

    // Use React Query hooks
    const { data: movimientos = [], isLoading: loadingMovimientos } = useMovimientos();
    const { data: categorias = [], isLoading: loadingCategorias } = useCategorias();
    const createMovimiento = useCreateMovimiento();
    const deleteMovimiento = useDeleteMovimiento();

    const loading = loadingMovimientos || loadingCategorias;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!formData.descripcion.trim()) {
            setError("La descripcion es obligatoria");
            return;
        }

        const monto = parseFloat(formData.monto);
        if (isNaN(monto) || monto <= 0) {
            setError("El monto debe ser mayor a 0");
            return;
        }

        const categoriaId = parseInt(formData.categoriaId);
        if (isNaN(categoriaId) || categoriaId <= 0) {
            setError("Selecciona una categoria");
            return;
        }

        try {
            await createMovimiento.mutateAsync({
                descripcion: formData.descripcion.trim(),
                monto: monto,
                categoriaId: categoriaId,
                tipo: formData.tipo,
                fechaMovimiento: formData.fechaMovimiento
            });
            
            setFormData({
                descripcion: '',
                monto: '',
                categoriaId: '',
                tipo: 'GASTO',
                fechaMovimiento: new Date().toISOString().split('T')[0]
            });
            setShowForm(false);
        } catch (err: any) {
            setError(err.message || 'Error al crear movimiento');
        }
    };

    const handleDelete = async (id: number, descripcion: string) => {
        if (!window.confirm(`¿Estas seguro de eliminar "${descripcion}"?`)) {
            return;
        }

        try {
            await deleteMovimiento.mutateAsync(id);
        } catch (err: any) {
            alert(err.message || 'Error al eliminar movimiento');
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
                <h1 className="text-3xl font-bold text-gray-900">💳 Movimientos</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    disabled={createMovimiento.isPending}
                >
                    {showForm ? 'Cancelar' : 'Nuevo Movimiento'}
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
                    <h2 className="text-xl font-semibold mb-4">Registrar Movimiento</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Tipo</label>
                                <select
                                    value={formData.tipo}
                                    onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as 'GASTO' | 'INGRESO' }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="GASTO">💸 Gasto</option>
                                    <option value="INGRESO">💰 Ingreso</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Categoria</label>
                                <select
                                    value={formData.categoriaId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, categoriaId: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Seleccionar categoria</option>
                                    {categorias.map(categoria => (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Descripcion</label>
                            <input
                                type="text"
                                value={formData.descripcion}
                                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Compra en supermercado"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Monto</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.monto}
                                onChange={(e) => setFormData(prev => ({ ...prev, monto: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                                required
                            />
                        </div>
                        
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                                disabled={createMovimiento.isPending}
                            >
                                {createMovimiento.isPending ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setError("");
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                                disabled={createMovimiento.isPending}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Historial de Movimientos</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {movimientos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No hay movimientos registrados
                        </div>
                    ) : (
                        movimientos.map((movimiento) => (
                            <div key={movimiento.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">
                                            {movimiento.tipo === 'INGRESO' ? '💰' : '💸'}
                                        </span>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {movimiento.descripcion}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {movimiento.categoria?.nombre || 'Sin categoria'} • {new Date(movimiento.fechaMovimiento).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <p className={`font-semibold ${
                                        movimiento.tipo === 'INGRESO' 
                                            ? 'text-green-600' 
                                            : 'text-red-600'
                                    }`}>
                                        {movimiento.tipo === 'INGRESO' ? '+' : '-'}${movimiento.monto.toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => handleDelete(movimiento.id, movimiento.descripcion)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                                        disabled={deleteMovimiento.isPending}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}