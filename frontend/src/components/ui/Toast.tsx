import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { cn } from "../../utils";

interface ToastProps {
    message: string;
    type: "success" | "error" | "info";
    id: string;
}

const Toast = ({ message, type, id }: ToastProps) => {
    const baseClasses = "fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white transition-all duration-300 ease-out transform";
    const typeClasses = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
    };

    return (
        <div
            id={id}
            className={cn(baseClasses, typeClasses[type], "translate-y-0 opacity-100")}
            style={{ zIndex: 9999 }}
        >
            {message}
        </div>
    );
};

interface ToastContextType {
    addToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    useEffect(() => {
        if (toasts.length > 0) {
            const timer = setTimeout(() => {
                setToasts((prev) => prev.slice(1));
            }, 3000); // Toast disappears after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [toasts]);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 space-y-2" style={{ zIndex: 9999 }}>
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
