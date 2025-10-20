import { ReactNode } from "react";
import { cn } from "../../lib/utils"; // if you don’t have cn, replace with simple join

export type ChartAction = {
    key: string;
    label: string;
    active?: boolean;
    onClick: () => void;
};

type ChartCardProps = {
    title: string;
    actions?: ChartAction[];
    className?: string;
    children: ReactNode;
};

export function ChartCard({ title, actions = [], className, children }: ChartCardProps) {
    return (
        <div className={cn("bg-white rounded-xl border border-gray-20", className)}>
            <div className="p-6 border-b border-gray-20 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-80">{title}</h3>
                {actions?.length > 0 && (
                    <div className="flex items-center gap-2">
                        {actions.map(a => (
                            <button
                                key={a.key}
                                onClick={a.onClick}
                                className={cn(
                                    "h-8 px-3 rounded-md text-sm border",
                                    a.active
                                        ? "bg-gray-90 text-white border-gray-90"
                                        : "bg-white text-gray-80 border-gray-30 hover:bg-gray-5"
                                )}
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}