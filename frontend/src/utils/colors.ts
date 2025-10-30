import { CATEGORIA_COLORS } from "../constants";

// Simple hash function for strings
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Return a deterministic color for a category name.
 * If the category already has a color provided by backend, prefer it.
 * Otherwise pick one from the palette based on name hash so same category always gets same color.
 */
export function getColorForCategory(
    name?: string,
    index?: number,
    fallback?: string
): string {
    if (!name && typeof index === "number") {
        return CATEGORIA_COLORS[index % CATEGORIA_COLORS.length];
    }

    if (!name) return fallback || CATEGORIA_COLORS[0];

    const hash = hashString(name);
    const color = CATEGORIA_COLORS[hash % CATEGORIA_COLORS.length];
    return color;
}

export default getColorForCategory;
