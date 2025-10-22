import { useSimpleAuth } from "../contexts/SimpleAuthContext";

export function SimpleDashboard() {
    const { user, isAuthenticated, logout } = useSimpleAuth();

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    🎉 ¡Bienvenido a Gastos Personales Application!
                </h1>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Panel Principal
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Esta es tu aplicación de gestión de finanzas personales. 
                        Aquí puedes administrar tus ingresos y gastos de manera eficiente.
                    </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
                        ✅ Login Exitoso
                    </h3>
                    <div className="text-green-700 dark:text-green-400">
                        <p><strong>Estado de autenticación:</strong> {isAuthenticated ? 'Autenticado' : 'No autenticado'}</p>
                        {user && (
                            <>
                                <p><strong>Usuario:</strong> {user.nombreUsuario}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>ID:</strong> {user.id}</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                            💰 Movimientos
                        </h4>
                        <p className="text-blue-700 dark:text-blue-400">
                            Registra y consulta tus ingresos y gastos
                        </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">
                            🏷️ Categorias
                        </h4>
                        <p className="text-purple-700 dark:text-purple-400">
                            Organiza tus gastos por categorias
                        </p>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-2">
                            📊 Reportes
                        </h4>
                        <p className="text-orange-700 dark:text-orange-400">
                            Visualiza estadísticas y análisis
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center space-y-4">
                    <p className="text-gray-500 dark:text-gray-400">
                        🚀 La aplicación está funcionando correctamente
                    </p>
                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}