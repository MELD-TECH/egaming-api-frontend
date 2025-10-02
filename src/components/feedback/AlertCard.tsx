import React from "react";
import { cn } from "../../lib/utils";

export type AlertIntent = "info" | "success" | "error";

export interface AlertCardProps {
    intent?: AlertIntent;
    title?: string;
    children?: React.ReactNode;
    className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({ intent = "info", title, children, className }) => {
    return (
        <div
            role="status"
            className={cn(
                "rounded-md border p-3 text-sm",
                intent === "info" && "border-blue-200 bg-blue-50 text-blue-900",
                intent === "success" && "border-emerald-200 bg-emerald-50 text-emerald-900",
                intent === "error" && "border-red-200 bg-red-50 text-red-900",
                className
            )}
        >
            {title && <div className="font-medium mb-1">{title}</div>}
            <div>{children}</div>
        </div>
    );
};