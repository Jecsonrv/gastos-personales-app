import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui";
import { Button } from "../components/ui";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "../hooks/useTranslation";
import {
    Moon,
    Sun,
    Palette,
    Settings,
    Monitor,
    Globe,
    Calendar,
    DollarSign,
    Save,
} from "lucide-react";

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

const getCurrencyOptions = (t: (key: string) => string) => [
    { value: "USD", label: t("settings.currencies.usd"), symbol: "$" },
    { value: "EUR", label: t("settings.currencies.eur"), symbol: "€" },
    { value: "GBP", label: t("settings.currencies.gbp"), symbol: "£" },
    { value: "MXN", label: t("settings.currencies.mxn"), symbol: "MX$" },
    { value: "COP", label: t("settings.currencies.cop"), symbol: "COP$" },
    { value: "PEN", label: t("settings.currencies.pen"), symbol: "S/" },
    { value: "CLP", label: t("settings.currencies.clp"), symbol: "CLP$" },
    { value: "ARS", label: t("settings.currencies.ars"), symbol: "ARS$" },
    { value: "BRL", label: t("settings.currencies.brl"), symbol: "R$" },
    { value: "CAD", label: t("settings.currencies.cad"), symbol: "C$" },
    { value: "AUD", label: t("settings.currencies.aud"), symbol: "A$" },
];

const getLanguageOptions = (t: (key: string) => string) => [
    { value: "es", label: t("settings.languages.spanish") },
    { value: "en", label: t("settings.languages.english") },
];

const DATE_FORMATS = [
    {
        value: "DD/MM/YYYY",
        label: "DD/MM/YYYY (31/12/2024)",
        example: "31/12/2024",
    },
    {
        value: "MM/DD/YYYY",
        label: "MM/DD/YYYY (12/31/2024)",
        example: "12/31/2024",
    },
    {
        value: "YYYY-MM-DD",
        label: "YYYY-MM-DD (2024-12-31)",
        example: "2024-12-31",
    },
    {
        value: "DD-MM-YYYY",
        label: "DD-MM-YYYY (31-12-2024)",
        example: "31-12-2024",
    },
];

export function Configuracion() {
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation();
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Obtener opciones dinámicas con traducciones
    const currencyOptions = getCurrencyOptions(t);
    const languageOptions = getLanguageOptions(t);

    // Cargar configuración desde localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem("app-settings");
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
            } catch (error) {
                console.error("Error al cargar configuración:", error);
            }
        }
    }, []);

    // Manejar cambios en configuraciones
    const handleSettingChange = <K extends keyof AppSettings>(
        key: K,
        value: AppSettings[K]
    ) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        setHasChanges(true);

        // Aplicar inmediatamente para vista previa
        localStorage.setItem("app-settings", JSON.stringify(newSettings));

        // Disparar evento para que otras partes de la aplicación se actualicen
        window.dispatchEvent(
            new CustomEvent("settingsChanged", { detail: newSettings })
        );
    };

    // Guardar configuración
    const saveSettings = async () => {
        setIsLoading(true);
        try {
            // Simular guardado en servidor
            await new Promise((resolve) => setTimeout(resolve, 500));

            localStorage.setItem("app-settings", JSON.stringify(settings));
            setHasChanges(false);

            // Se elimina el console.log de depuración; usar notificaciones UI si es necesario
        } catch (error) {
            console.error("Error al guardar configuración:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Restablecer configuración
    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
        setTheme("system");
        setHasChanges(true);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Settings className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {t("settings.title")}
                        </h1>
                        <p className="text-muted-foreground">
                            {t("settings.subtitle")}
                        </p>
                    </div>
                </div>

                {/* Botón de guardar */}
                {hasChanges && (
                    <Button
                        onClick={saveSettings}
                        disabled={isLoading}
                        className="flex items-center space-x-2"
                    >
                        <Save className="h-4 w-4" />
                        <span>
                            {isLoading
                                ? t("settings.saving")
                                : t("settings.saveChanges")}
                        </span>
                    </Button>
                )}
            </div>

            {/* Configuración de Apariencia */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Palette className="h-5 w-5 text-primary" />
                        <span>{t("settings.appearance")}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Selector de tema */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">
                            {t("settings.theme")}
                        </label>
                        <div className="flex space-x-2">
                            {[
                                {
                                    value: "light" as const,
                                    label: t("settings.light"),
                                    icon: Sun,
                                },
                                {
                                    value: "dark" as const,
                                    label: t("settings.dark"),
                                    icon: Moon,
                                },
                                {
                                    value: "system" as const,
                                    label: t("settings.system"),
                                    icon: Monitor,
                                },
                            ].map(({ value, label, icon: Icon }) => (
                                <Button
                                    key={value}
                                    variant={
                                        theme === value ? "default" : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setTheme(value)}
                                    className="flex items-center space-x-2"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{label}</span>
                                </Button>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("settings.themeNote")}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Configuración Regional y Vista Previa - Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuración Regional */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Globe className="h-5 w-5 text-primary" />
                            <span>{t("settings.regional")}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Moneda */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-primary" />
                                <span> {t("settings.currency")}</span>
                            </label>
                            <select
                                value={settings.currency}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "currency",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                {currencyOptions.map((currency) => (
                                    <option
                                        key={currency.value}
                                        value={currency.value}
                                    >
                                        {currency.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground">
                                {t("settings.currencyNote")}
                            </p>
                        </div>

                        {/* Idioma */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">
                                {t("settings.language")}
                            </label>
                            <select
                                value={settings.language}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "language",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                {languageOptions.map((language) => (
                                    <option
                                        key={language.value}
                                        value={language.value}
                                    >
                                        {language.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground">
                                {t("settings.languageNote")}
                            </p>
                        </div>

                        {/* Formato de fecha */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>{t("settings.dateFormat")}</span>
                            </label>
                            <select
                                value={settings.dateFormat}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "dateFormat",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                {DATE_FORMATS.map((format) => (
                                    <option
                                        key={format.value}
                                        value={format.value}
                                    >
                                        {format.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground">
                                {t("settings.dateFormatNote")}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Vista previa de configuración */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("settings.preview")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted/50 p-6 rounded-lg border-2 border-dashed border-border space-y-4">
                            <h4 className="font-semibold text-foreground mb-4">
                                {t("settings.previewSubtitle")}
                            </h4>

                            <div className="space-y-3">
                                <div className="bg-card p-3 rounded-md border">
                                    <p className="text-sm font-medium text-foreground">
                                        {t("settings.sampleMovement")}
                                    </p>
                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                        +
                                        {
                                            currencyOptions.find(
                                                (c) =>
                                                    c.value ===
                                                    settings.currency
                                            )?.symbol
                                        }
                                        1,234.56
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {DATE_FORMATS.find(
                                            (f) =>
                                                f.value === settings.dateFormat
                                        )?.example || "31/12/2024"}
                                    </p>
                                </div>

                                <div className="bg-card p-3 rounded-md border">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>
                                                <strong>
                                                    {t("settings.currency")}:
                                                </strong>
                                            </span>
                                            <span>
                                                {
                                                    currencyOptions.find(
                                                        (c) =>
                                                            c.value ===
                                                            settings.currency
                                                    )?.label
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>
                                                <strong>
                                                    {t(
                                                        "settings.currentLanguage"
                                                    )}
                                                </strong>
                                            </span>
                                            <span>
                                                {
                                                    languageOptions.find(
                                                        (l) =>
                                                            l.value ===
                                                            settings.language
                                                    )?.label
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>
                                                <strong>
                                                    {t("settings.currentTheme")}
                                                </strong>
                                            </span>
                                            <span>
                                                {theme === "light"
                                                    ? t("settings.light")
                                                    : theme === "dark"
                                                    ? t("settings.dark")
                                                    : t("settings.system")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>
                                                <strong>
                                                    {t("movements.date")}:
                                                </strong>
                                            </span>
                                            <span>
                                                {DATE_FORMATS.find(
                                                    (f) =>
                                                        f.value ===
                                                        settings.dateFormat
                                                )?.example || "31/12/2024"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Acciones */}
            <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={resetSettings}>
                    {t("settings.resetDefault")}
                </Button>
                <Button
                    onClick={saveSettings}
                    disabled={isLoading || !hasChanges}
                    className="flex items-center space-x-2"
                >
                    <Save className="h-4 w-4" />
                    <span>
                        {isLoading
                            ? t("settings.saving")
                            : t("settings.saveSettings")}
                    </span>
                </Button>
            </div>
        </div>
    );
}
