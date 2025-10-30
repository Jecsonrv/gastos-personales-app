import { useState, useEffect } from "react";

interface AppSettings {
    currency: string;
    language: string;
    dateFormat: string;
}

const DEFAULT_SETTINGS: AppSettings = {
    currency: "USD",
    language: "es",
    dateFormat: "DD/MM/YYYY",
};

/**
 * Hook para usar la configuración de la aplicación con actualización automática
 */
export function useAppConfig() {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        // Cargar configuración inicial
        const loadSettings = () => {
            const savedSettings = localStorage.getItem("app-settings");
            if (savedSettings) {
                try {
                    const parsedSettings = JSON.parse(savedSettings);
                    setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
                } catch (error) {
                    // Error silenciado
                }
            }
        };

        loadSettings();

        // Escuchar cambios en la configuración
        const handleSettingsChange = (event: CustomEvent) => {
            setSettings(event.detail);
        };

        window.addEventListener(
            "settingsChanged",
            handleSettingsChange as EventListener
        );

        return () => {
            window.removeEventListener(
                "settingsChanged",
                handleSettingsChange as EventListener
            );
        };
    }, []);

    return settings;
}

/**
 * Formatea moneda usando la configuración actual
 */
export function formatCurrencyWithConfig(
    amount: number,
    settings?: AppSettings
): string {
    const config =
        settings || JSON.parse(localStorage.getItem("app-settings") || "{}");
    const currency = config.currency || "USD";

    const currencyConfig = {
        USD: { locale: "en-US", symbol: "$", code: "USD" },
        EUR: { locale: "es-ES", symbol: "€", code: "EUR" },
        GBP: { locale: "en-GB", symbol: "£", code: "GBP" },
        MXN: { locale: "es-MX", symbol: "$", code: "MXN" },
        COP: { locale: "es-CO", symbol: "$", code: "COP" },
        PEN: { locale: "es-PE", symbol: "S/", code: "PEN" },
        CLP: { locale: "es-CL", symbol: "$", code: "CLP" },
        ARS: { locale: "es-AR", symbol: "$", code: "ARS" },
        BRL: { locale: "pt-BR", symbol: "R$", code: "BRL" },
        CAD: { locale: "en-CA", symbol: "$", code: "CAD" },
        AUD: { locale: "en-AU", symbol: "$", code: "AUD" },
    };

    const currencyInfo =
        currencyConfig[currency as keyof typeof currencyConfig] ||
        currencyConfig.USD;

    try {
        // Para monedas que usan $ pero no son USD, mostrar el código
        if (currencyInfo.symbol === "$" && currency !== "USD") {
            return `${currencyInfo.code} ${currencyInfo.symbol}${amount.toFixed(
                2
            )}`;
        }

        // Para USD, solo mostrar el símbolo
        if (currency === "USD") {
            return `${currencyInfo.symbol}${amount.toFixed(2)}`;
        }

        // Para otras monedas con símbolos únicos
        return `${currencyInfo.symbol}${amount.toFixed(2)}`;
    } catch (error) {
        // Fallback si hay error
        return `${currencyInfo.code} ${currencyInfo.symbol}${amount.toFixed(
            2
        )}`;
    }
}

/**
 * Formatea fecha usando la configuración actual
 */
export function formatDateWithConfig(
    date: string | Date,
    settings?: AppSettings
): string {
    const config =
        settings || JSON.parse(localStorage.getItem("app-settings") || "{}");
    const dateFormat = config.dateFormat || "DD/MM/YYYY";

    try {
        let dateObj: Date;

        if (typeof date === "string") {
            // Si la fecha viene en formato ISO o tiene T, procesarla correctamente
            if (date.includes("T")) {
                dateObj = new Date(date);
            } else if (date.includes("-")) {
                // Si es solo una fecha (YYYY-MM-DD), agregar la hora para evitar problemas de zona horaria
                dateObj = new Date(date + "T00:00:00");
            } else {
                // Otros formatos, intentar parsear directamente
                dateObj = new Date(date);
            }
        } else {
            dateObj = new Date(date);
        }

        // Verificar si la fecha es válida
        if (isNaN(dateObj.getTime())) {
            return "Invalid Date";
        }

        const day = dateObj.getDate().toString().padStart(2, "0");
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObj.getFullYear();

        switch (dateFormat) {
            case "DD/MM/YYYY":
                return `${day}/${month}/${year}`;
            case "MM/DD/YYYY":
                return `${month}/${day}/${year}`;
            case "YYYY-MM-DD":
                return `${year}-${month}-${day}`;
            case "DD-MM-YYYY":
                return `${day}-${month}-${year}`;
            default:
                return `${day}/${month}/${year}`;
        }
    } catch (error) {
        return "Invalid Date";
    }
}
