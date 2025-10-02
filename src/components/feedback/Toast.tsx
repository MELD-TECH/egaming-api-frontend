import React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

type ToastType = "info" | "success" | "error";
export interface ToastItem {
    id: string;
    title?: string;
    message: string;
    type?: ToastType;
    timeout?: number; // ms
}

interface ToastContextValue {
    show: (msg: Omit<ToastItem, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
    const ctx = React.useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [items, setItems] = React.useState<ToastItem[]>([]);

    const show = React.useCallback((msg: Omit<ToastItem, "id">) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const item: ToastItem = { id, type: "info", timeout: 3500, ...msg };
        setItems((prev) => [...prev, item]);
        if (item.timeout && item.timeout > 0) {
            setTimeout(() => {
                setItems((prev) => prev.filter((x) => x.id !== id));
            }, item.timeout);
        }
    }, []);

    const remove = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id));

    const container = (
        <div className="fixed z-50 bottom-4 right-4 flex flex-col gap-2 w-80">
            {items.map((t) => (
                <div
                    key={t.id}
                    role="status"
                    className={cn(
                        "rounded-md border shadow bg-white/95 backdrop-blur p-3 text-sm",
                        t.type === "success" && "border-emerald-300 text-emerald-800 bg-emerald-200",
                        t.type === "error" && "border-red-300 text-red-800 bg-red-200",
                        t.type === "info" && "border-blue-300 text-blue-800 bg-blue-200"
                    )}
                >
                    <div className="flex items-start gap-2">
                        <div className={cn(
                            "mt-0.5 h-2.5 w-2.5 rounded-full",
                            t.type === "success" && "bg-emerald-500",
                            t.type === "error" && "bg-red-500",
                            t.type === "info" && "bg-blue-500",
                        )} />
                        <div className="flex-1">
                            {t.title && <div className="font-medium">{t.title}</div>}
                            <div>{t.message}</div>
                        </div>
                        <button
                            onClick={() => remove(t.id)}
                            aria-label="Dismiss"
                            className="text-xs text-gray-500 hover:text-gray-800"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            {typeof window !== "undefined" && createPortal(container, document.body)}
        </ToastContext.Provider>
    );
};