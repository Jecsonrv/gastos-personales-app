import { useAppConfig } from "./useAppConfig";
import { es, en, type Language } from "../utils/translations";

/**
 * Hook para usar traducciones basado en la configuración actual
 */
export function useTranslation() {
    const settings = useAppConfig();
    const currentLanguage = settings.language as Language;

    const translations = {
        es,
        en,
    };

    const t = (key: string): string => {
        const keys = key.split(".");
        let value: unknown = translations[currentLanguage] || translations.es;

        for (const k of keys) {
            if (value && typeof value === "object" && k in value) {
                value = (value as Record<string, unknown>)[k];
            } else {
                value = undefined;
                break;
            }
        }

        return typeof value === "string" ? value : key; // Fallback al key si no se encuentra la traducción
    };

    return { t, currentLanguage };
}
