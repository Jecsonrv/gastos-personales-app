import { useState } from "react";
import { useSimpleAuth } from "../contexts/SimpleAuthContext";

export function ConfiguracionPage() {
    const { user, logout } = useSimpleAuth();
    const [activeTab, setActiveTab] = useState('perfil');
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        limiteGastos: true
    });
    const [preferences, setPreferences] = useState({
        moneda: 'USD',
        idioma: 'es',
        tema: 'light',
        formatoFecha: 'DD/MM/YYYY'
    });

    const handleSavePreferences = () => {
        // Aquí podrías guardar las preferencias en el backend
        alert('✅ Configuracion guardada correctamente');
    };

    const handleExportData = () => {
        // Aquí podrías implementar la exportación de datos
        alert('📤 Exportando datos... (función en desarrollo)');
    };

    const handleDeleteAccount = () => {
        const confirmDelete = window.confirm(
            '⚠️ ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'
        );
        if (confirmDelete) {
            alert('❌ Eliminación de cuenta (función en desarrollo)');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    ⚙️ Configuracion
                </h1>
                <p className="text-gray-600 mt-2">
                    Personaliza tu experiencia en la aplicación
                </p>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('perfil')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'perfil'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        👤 Perfil
                    </button>
                    <button
                        onClick={() => setActiveTab('preferencias')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'preferencias'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        🎨 Preferencias
                    </button>
                    <button
                        onClick={() => setActiveTab('notificaciones')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'notificaciones'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        🔔 Notificaciones
                    </button>
                    <button
                        onClick={() => setActiveTab('datos')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'datos'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        📊 Datos
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow">
                {/* Perfil Tab */}
                {activeTab === 'perfil' && (
                    <div className="p-6 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">Información del Perfil</h2>
                        
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-3xl">👤</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {user?.nombreUsuario || 'Usuario'}
                                </h3>
                                <p className="text-gray-600">{user?.email || 'email@ejemplo.com'}</p>
                                <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                                    Cambiar foto de perfil
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre de Usuario
                                </label>
                                <input
                                    type="text"
                                    defaultValue={user?.nombreUsuario || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    defaultValue={user?.email || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <button className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left text-gray-600 hover:bg-gray-50">
                                    ••••••••••
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono (Opcional)
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+1 234 567 8900"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSavePreferences}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                )}

                {/* Preferencias Tab */}
                {activeTab === 'preferencias' && (
                    <div className="p-6 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">Preferencias de la Aplicación</h2>
                        
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    🌍 Moneda Principal
                                </label>
                                <select
                                    value={preferences.moneda}
                                    onChange={(e) => setPreferences({...preferences, moneda: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="USD">USD - Dólar Estadounidense</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GTQ">GTQ - Quetzal Guatemalteco</option>
                                    <option value="MXN">MXN - Peso Mexicano</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    🗣️ Idioma
                                </label>
                                <select
                                    value={preferences.idioma}
                                    onChange={(e) => setPreferences({...preferences, idioma: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="es">Español</option>
                                    <option value="en">English</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    🎨 Tema
                                </label>
                                <select
                                    value={preferences.tema}
                                    onChange={(e) => setPreferences({...preferences, tema: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="light">Claro</option>
                                    <option value="dark">Oscuro</option>
                                    <option value="auto">Automático</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📅 Formato de Fecha
                                </label>
                                <select
                                    value={preferences.formatoFecha}
                                    onChange={(e) => setPreferences({...preferences, formatoFecha: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSavePreferences}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Guardar Preferencias
                            </button>
                        </div>
                    </div>
                )}

                {/* Notificaciones Tab */}
                {activeTab === 'notificaciones' && (
                    <div className="p-6 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">Configuracion de Notificaciones</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📧</span>
                                    <div>
                                        <p className="font-medium text-gray-900">Notificaciones por Email</p>
                                        <p className="text-sm text-gray-500">Recibir resúmenes semanales y alertas importantes</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.email}
                                        onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📱</span>
                                    <div>
                                        <p className="font-medium text-gray-900">Notificaciones Push</p>
                                        <p className="text-sm text-gray-500">Recibir notificaciones en el navegador</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.push}
                                        onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">⚠️</span>
                                    <div>
                                        <p className="font-medium text-gray-900">Alertas de Límite de Gastos</p>
                                        <p className="text-sm text-gray-500">Notificar cuando superes límites establecidos</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.limiteGastos}
                                        onChange={(e) => setNotifications({...notifications, limiteGastos: e.target.checked})}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSavePreferences}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Guardar Notificaciones
                            </button>
                        </div>
                    </div>
                )}

                {/* Datos Tab */}
                {activeTab === 'datos' && (
                    <div className="p-6 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">Gestión de Datos</h2>
                        
                        <div className="space-y-6">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">📤</span>
                                    <h3 className="font-semibold text-blue-900">Exportar Datos</h3>
                                </div>
                                <p className="text-blue-700 mb-4">
                                    Descarga una copia de todos tus datos financieros en formato CSV o JSON.
                                </p>
                                <button
                                    onClick={handleExportData}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Exportar Datos
                                </button>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">📥</span>
                                    <h3 className="font-semibold text-green-900">Importar Datos</h3>
                                </div>
                                <p className="text-green-700 mb-4">
                                    Importa tus datos financieros desde archivos CSV o desde otras aplicaciones.
                                </p>
                                <input
                                    type="file"
                                    accept=".csv,.json"
                                    className="mb-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    Importar Datos
                                </button>
                            </div>

                            <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">🔄</span>
                                    <h3 className="font-semibold text-yellow-900">Copia de Seguridad</h3>
                                </div>
                                <p className="text-yellow-700 mb-4">
                                    Crear una copia de seguridad completa de tu cuenta y datos.
                                </p>
                                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                                    Crear Backup
                                </button>
                            </div>

                            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">⚠️</span>
                                    <h3 className="font-semibold text-red-900">Zona Peligrosa</h3>
                                </div>
                                <p className="text-red-700 mb-4">
                                    Las siguientes acciones son permanentes y no se pueden deshacer.
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            if (window.confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
                                                alert('🗑️ Eliminación de datos (función en desarrollo)');
                                            }
                                        }}
                                        className="block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Eliminar Todos los Datos
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="block px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors"
                                    >
                                        Eliminar Cuenta Permanentemente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Session Management */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestión de Sesión</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600">
                            Sesión iniciada como <strong>{user?.nombreUsuario}</strong>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Última actividad: Ahora mismo
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}