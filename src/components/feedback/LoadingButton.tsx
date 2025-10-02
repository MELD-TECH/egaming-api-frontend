import React from "react";
import { Button, type ButtonProps } from "../ui/button";
import { Loader } from "../Loader/Loader";
import { cn } from "../../lib/utils";

export interface LoadingButtonProps extends ButtonProps {
    loading?: boolean;
    spinnerSize?: "sm" | "md" | "lg";
    // If provided, wraps onClick and manages loading automatically
    onClickAsync?: () => Promise<any>;
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({ loading: loadingProp, onClick, onClickAsync, spinnerSize = "sm", disabled, children, className, ...rest }, ref) => {
        const [internalLoading, setInternalLoading] = React.useState(false);

        const loading = loadingProp ?? internalLoading;

        const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
            if (onClickAsync) {
                e.preventDefault();
                try {
                    setInternalLoading(true);
                    await onClickAsync();
                } finally {
                    setInternalLoading(false);
                }
            }
            onClick?.(e);
        };

        return (
            <Button
                ref={ref}
                disabled={disabled || loading}
                onClick={handleClick}
                className={cn("relative", className)}
                {...rest}
            >
                {loading && (
                    <span className="mr-2 inline-flex items-center">
            <Loader size={spinnerSize} message="" />
          </span>
                )}
                {children}
            </Button>
        );
    }
);
LoadingButton.displayName = "LoadingButton";