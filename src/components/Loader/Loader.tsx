import React from "react";
import { cn } from "../../lib/utils";

interface LoaderProps {
    message?: string;
    fullscreen?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeMap: Record<NonNullable<LoaderProps["size"]>, string> = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
};

export const Loader: React.FC<LoaderProps> = ({
                                                  message = "Loading...",
                                                  fullscreen = false,
                                                  size = "md",
                                                  className,
                                              }) => {
    const spinner = (
        <div className="flex items-center gap-3" role="status" aria-live="polite">
            {/* Spinner */}
            <div
                className={cn(
                    "rounded-full animate-spin",
                    // Neutral track + brand top border for the spinning arc
                    "border-gray-200 dark:border-gray-800 border-t-transparent",
                    // Use a gradient on the top border via an overlay ring
                    "relative",
                    sizeMap[size],
                    className,
                )}
                aria-hidden
            >
                {/* gradient ring overlay */}
                <span
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r from-indigo-600 to-purple-600",
                        // show just the top arc by masking the rest
                        "[mask:radial-gradient(farthest-side,transparent_calc(100%-6px),black_calc(100%-6px))]",
                    )}
                />
            </div>

            {/* Message */}
            {message && (
                <span className="text-sm text-gray-600 dark:text-gray-300">{message}</span>
            )}
        </div>
    );

    if (!fullscreen) return spinner;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/50 backdrop-blur-sm">
            {spinner}
        </div>
    );
};

export default Loader;