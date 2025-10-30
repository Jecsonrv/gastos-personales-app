import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "../../utils";
import { useTranslation } from "../../hooks/useTranslation";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function Layout() {
    const location = useLocation();
    const { t } = useTranslation();
    const { logout, user } = useAuth();

    const navigation = [
        {
            name: t("nav.dashboard"),
            href: "/",
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z"
                    />
                </svg>
            ),
        },
        {
            name: t("nav.movements"),
            href: "/movimientos",
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                </svg>
            ),
        },
        {
            name: t("nav.categories"),
            href: "/categorias",
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                </svg>
            ),
        },
        {
            name: t("nav.reports"),
            href: "/reportes",
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                </svg>
            ),
        },
        {
            name: t("nav.settings"),
            href: "/configuracion",
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-background transition-colors duration-200">
            {/* Desktop Sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-card pt-5 pb-4 overflow-y-auto border-r border-border">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <div className="flex items-center">
                            <div className="bg-primary rounded-lg p-2 mr-3">
                                <svg
                                    className="h-8 w-8 text-primary-foreground"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-card-foreground">
                                Fine
                            </h1>
                        </div>
                    </div>

                    <nav className="mt-8 flex-1 px-2 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary border-r-2 border-primary"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "mr-3 flex-shrink-0",
                                            isActive
                                                ? "text-primary"
                                                : "text-muted-foreground group-hover:text-accent-foreground"
                                        )}
                                    >
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="mt-auto border-t border-border pt-4">
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                            {user?.nombre || user?.username}
                        </div>
                        <Link
                            to="/perfil"
                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors text-left"
                        >
                            <User className="w-5 h-5" />
                            <span>Mi Perfil</span>
                        </Link>
                        <button
                            onClick={logout}
                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors text-left"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64 flex flex-col flex-1">
                <main className="flex-1 bg-background">
                    <div className="py-8 px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
