import { Loader2 } from "lucide-react";

interface LoaderProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    className?: string;
}

export function Loader({
    size = "md",
    text = "Cargando...",
    className = "",
}: LoaderProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    };

    return (
        <div
            className={`flex flex-col items-center justify-center space-y-3 ${className}`}
        >
            <div className="relative">
                <Loader2
                    className={`${sizeClasses[size]} animate-spin text-primary drop-shadow-sm`}
                />
                <div
                    className={`absolute inset-0 ${sizeClasses[size]} animate-ping text-primary/30`}
                >
                    <Loader2 className="w-full h-full" />
                </div>
            </div>
            {text && (
                <p className="text-sm text-muted-foreground animate-pulse font-medium">
                    {text}
                </p>
            )}
        </div>
    );
}

// Loader para página completa
export function PageLoader({ text = "Cargando página..." }: { text?: string }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <div className="bg-card p-8 rounded-lg shadow-lg border">
                <Loader size="lg" text={text} />
            </div>
        </div>
    );
}
