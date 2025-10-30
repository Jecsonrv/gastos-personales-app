import { cn } from "../../utils";

interface TableSkeletonProps {
    rows?: number;
    cols?: number;
    className?: string;
}

export function TableSkeleton({ rows = 5, cols = 5, className }: TableSkeletonProps) {
    return (
        <div className={cn("w-full", className)}>
            <div className="w-full space-y-3">
                {/* Header */}
                <div className="h-8 bg-muted/80 rounded-md animate-pulse w-full"></div>
                {/* Body */}
                <div className="space-y-2">
                    {Array.from({ length: rows }).map((_, i) => (
                        <div key={i} className="h-12 bg-muted rounded-md animate-pulse w-full"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
