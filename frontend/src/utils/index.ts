import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function para combinar clases de CSS con Tailwind
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Exportar todas las funciones de formateo
export * from "./formatters";

/**
 * Formatea un número como moneda usando la configuración guardada
 */
export function formatCurrency(
    amount: number,
    currency?: string,
    locale?: string
): string {
    try {
        // Obtener configuración guardada
        const savedSettings = getCurrencySettings();
        const finalCurrency = currency || savedSettings.currency;
        const finalLocale = locale || savedSettings.locale;

        return new Intl.NumberFormat(finalLocale, {
            style: "currency",
            currency: finalCurrency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch (error) {
        // Fallback si hay error en el formateo
        const symbol = getCurrencySymbol(currency);
        return `${symbol}${amount.toFixed(2)}`;
    }
}

/**
 * Obtiene la configuración de moneda guardada
 */
function getCurrencySettings(): { currency: string; locale: string } {
    try {
        const savedSettings = localStorage.getItem("app-settings");
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            const currency = settings.currency || "USD";

            // Mapear monedas a locales apropiados
            const localeMap: { [key: string]: string } = {
                USD: "en-US",
                EUR: "de-DE",
                GBP: "en-GB",
                MXN: "es-MX",
                COP: "es-CO",
                PEN: "es-PE",
                CLP: "es-CL",
                ARS: "es-AR",
                BRL: "pt-BR",
                CAD: "en-CA",
                AUD: "en-AU",
            };

            return {
                currency,
                locale: localeMap[currency] || "en-US",
            };
        }
    } catch (error) {
        console.error("Error getting currency settings:", error);
    }

    return { currency: "USD", locale: "en-US" };
}

/**
 * Obtiene el símbolo de una moneda
 */
function getCurrencySymbol(currency?: string): string {
    const currencySymbols: { [key: string]: string } = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        MXN: "MX$",
        COP: "COP$",
        PEN: "S/",
        CLP: "CLP$",
        ARS: "ARS$",
        BRL: "R$",
        CAD: "C$",
        AUD: "A$",
    };

    const savedSettings = getCurrencySettings();
    const finalCurrency = currency || savedSettings.currency;
    return currencySymbols[finalCurrency] || "$";
}

/**
 * Formatea una fecha según la configuración del usuario
 */
export function formatDate(date: string | Date, format?: string): string {
    try {
        // Si la fecha viene como string, asegurarnos de que sea válida
        let dateObj: Date;

        if (typeof date === "string") {
            // Si la fecha viene en formato ISO o tiene T, procesarla correctamente
            if (date.includes("T")) {
                dateObj = new Date(date);
            } else {
                // Si es solo una fecha (YYYY-MM-DD), agregar la hora para evitar problemas de zona horaria
                dateObj = new Date(date + "T00:00:00");
            }
        } else {
            dateObj = new Date(date);
        }

        // Verificar si la fecha es válida
        if (isNaN(dateObj.getTime())) {
            return "Fecha inválida";
        }

        // Obtener formato de configuración guardada o usar el parámetro
        const dateFormat = format || getDateFormat();

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
        console.error("Error formatting date:", error);
        return "Fecha inválida";
    }
}

/**
 * Obtiene el formato de fecha de la configuración guardada
 */
function getDateFormat(): string {
    try {
        const savedSettings = localStorage.getItem("app-settings");
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            return settings.dateFormat || "DD/MM/YYYY";
        }
    } catch (error) {
        console.error("Error getting date format:", error);
    }
    return "DD/MM/YYYY";
}

/**
 * Formatea una fecha con hora
 */
export function formatDateTime(date: string | Date, format?: string): string {
    try {
        let dateObj: Date;

        if (typeof date === "string") {
            dateObj = date.includes("T")
                ? new Date(date)
                : new Date(date + "T00:00:00");
        } else {
            dateObj = new Date(date);
        }

        if (isNaN(dateObj.getTime())) {
            return "Fecha inválida";
        }

        const dateFormat = format || getDateFormat();
        const dateStr = formatDate(dateObj, dateFormat);
        const timeStr = dateObj.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });

        return `${dateStr} ${timeStr}`;
    } catch (error) {
        console.error("Error formatting datetime:", error);
        return "Fecha inválida";
    }
}

/**
 * Convierte una fecha al formato ISO para inputs
 */
export function toInputDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
}

/**
 * Calcula el porcentaje de un valor respecto a un total
 */
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

/**
 * Genera un color aleatorio para una categoría
 */
export function generateRandomColor(): string {
    const colors = [
        "#ef4444",
        "#f97316",
        "#f59e0b",
        "#eab308",
        "#84cc16",
        "#22c55e",
        "#10b981",
        "#14b8a6",
        "#06b6d4",
        "#0ea5e9",
        "#3b82f6",
        "#6366f1",
        "#8b5cf6",
        "#a855f7",
        "#d946ef",
        "#ec4899",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Valida si una cadena es un email válido
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida si un número es positivo
 */
export function isPositiveNumber(value: number): boolean {
    return value > 0;
}

/**
 * Trunca un texto a una longitud específica
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
}

/**
 * Capitaliza la primera letra de una cadena
 */
export function capitalize(text: string): string {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Obtiene el nombre del mes en español
 */
export function getMonthName(monthNumber: number): string {
    const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];
    return months[monthNumber - 1] || "";
}

/**
 * Debounce function para limitar la frecuencia de llamadas
 */
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            if (timeout) clearTimeout(timeout);
            func(...args);
            timeout = null;
        };
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Genera un ID único simple
 */
export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
