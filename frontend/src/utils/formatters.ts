// Utilidades para formatear datos

/**
 * Formatea un número como moneda
 * @param amount - Cantidad a formatear
 * @param currency - Moneda (por defecto USD)
 * @param locale - Locale para el formato (por defecto es-US)
 */
export function formatCurrency(
    amount: number,
    currency: string = "USD",
    locale: string = "es-US"
): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount);
}

/**
 * Formatea una fecha en formato legible
 * @param dateString - Fecha en formato string
 * @param options - Opciones de formato
 */
export function formatDate(
    dateString: string | Date,
    options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    }
): string {
    const date =
        typeof dateString === "string" ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat("es-ES", options).format(date);
}

/**
 * Formatea una fecha como relativa (hace 2 días, hace 1 semana, etc.)
 * @param dateString - Fecha en formato string
 */
export function formatRelativeDate(dateString: string | Date): string {
    const date =
        typeof dateString === "string" ? new Date(dateString) : dateString;
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Hoy";
    if (diffInDays === 1) return "Ayer";
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
    if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;
    return `Hace ${Math.floor(diffInDays / 365)} años`;
}

/**
 * Formatea un número con separadores de miles
 * @param number - Número a formatear
 */
export function formatNumber(number: number): string {
    return new Intl.NumberFormat("es-ES").format(number);
}

/**
 * Formatea un porcentaje
 * @param value - Valor a formatear (de 0 a 1 o de 0 a 100)
 * @param isDecimal - Si el valor está en formato decimal (0.5 = 50%)
 */
export function formatPercentage(
    value: number,
    isDecimal: boolean = true
): string {
    return new Intl.NumberFormat("es-ES", {
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    }).format(isDecimal ? value : value / 100);
}
