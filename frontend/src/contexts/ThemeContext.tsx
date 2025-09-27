import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    actualTheme: "dark" | "light"; // El tema real aplicado
};

const ThemeProviderContext = createContext<
    ThemeProviderContextType | undefined
>(undefined);

export { ThemeProviderContext };

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "app-theme",
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(storageKey);
            return (stored as Theme) || defaultTheme;
        }
        return defaultTheme;
    });

    const [actualTheme, setActualTheme] = useState<"dark" | "light">("light");

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (newTheme: "dark" | "light") => {
            root.classList.remove("light", "dark");
            root.classList.add(newTheme);
            setActualTheme(newTheme);
        };

        if (theme === "system") {
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
                ? "dark"
                : "light";

            applyTheme(systemTheme);

            // Escuchar cambios en la preferencia del sistema
            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)"
            );
            const handleChange = () => {
                const newSystemTheme = mediaQuery.matches ? "dark" : "light";
                applyTheme(newSystemTheme);
            };

            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        } else {
            applyTheme(theme);
        }
    }, [theme]);

    const value = {
        theme,
        setTheme: (newTheme: Theme) => {
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
        actualTheme,
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}
