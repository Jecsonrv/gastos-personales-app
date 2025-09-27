import { useState } from "react";

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

export function Switch({
    checked,
    onCheckedChange,
    disabled = false,
    className = "",
}: SwitchProps) {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                disabled:cursor-not-allowed disabled:opacity-50
                shadow-inner hover:shadow-md
                ${checked ? "bg-primary" : "bg-secondary"}
                ${isPressed ? "scale-95" : "scale-100"}
                ${className}
            `}
            onClick={() => !disabled && onCheckedChange(!checked)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
        >
            <span
                className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200
                    shadow-sm
                    ${checked ? "translate-x-6" : "translate-x-1"}
                `}
            />
        </button>
    );
}
