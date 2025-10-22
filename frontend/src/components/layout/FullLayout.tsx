import { Outlet, Link, useLocation } from "react-router-dom";
import { useSimpleAuth } from "../../contexts/SimpleAuthContext";

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Movimientos', href: '/movimientos', icon: '💳' },
    { name: 'Categorias', href: '/categorias', icon: '🏷️' },
    { name: 'Reportes', href: '/reportes', icon: '📊' },
    { name: 'Configuracion', href: '/configuracion', icon: '⚙️' },
];

export function FullLayout() {
    const { user, logout } = useSimpleAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
                <div className="flex h-16 items-center justify-center border-b border-gray-200">
                    <h1 className="text-xl font-bold text-blue-600">
                        💰 Fine
                    </h1>
                </div>
                
                <nav className="mt-8 px-4">
                    <ul className="space-y-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        className={`
                                            flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                            ${isActive 
                                                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        <span className="mr-3 text-lg">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User info and logout */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.nombreUsuario}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.email}
                                </p>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Cerrar sesión"
                            >
                                <span className="text-lg">🚪</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="pl-64">
                <main className="py-8 px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}