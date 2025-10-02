import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";

export type ValidationResult = string | null | undefined;
export type Validator = (value: string) => ValidationResult;

// @ts-ignore
export interface CInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    hint?: string;
    info?: string;
    success?: string;
    requiredMessage?: string;
    patternMessage?: string;
    minLengthMessage?: string;
    maxLengthMessage?: string;
    minMessage?: string;
    maxMessage?: string;
    validate?: Validator | Validator[];
    // Controlled value is already in HTML props; we expose events:
    onValid?: (value: string) => void;
    onInvalid?: (value: string, message: string) => void;
    // Visual intent override (useful when server returns errors):
    state?: "default" | "info" | "success" | "error";
}

function runValidators(value: string, validators: Validator | Validator[] | undefined): ValidationResult {
    if (!validators) return null;
    const list = Array.isArray(validators) ? validators : [validators];
    for (const v of list) {
        const res = v(value);
        if (res) return res;
    }
    return null;
}

export const CInput = React.forwardRef<HTMLInputElement, CInputProps>(
    (
        {
            id,
            name,
            label,
            hint,
            info,
            success,
            required,
            pattern,
            minLength,
            maxLength,
            min,
            max,
            requiredMessage = "This field is required",
            patternMessage = "Invalid format",
            minLengthMessage,
            maxLengthMessage,
            minMessage,
            maxMessage,
            validate,
            state: forcedState,
            className,
            onBlur,
            onChange,
            onValid,
            onInvalid,
            ...rest
        },
        ref
    ) => {
        const [value, setValue] = React.useState<string>((rest.value as string) ?? "");
        const [error, setError] = React.useState<string | null>(null);
        const [touched, setTouched] = React.useState(false);

        // Support controlled value
        React.useEffect(() => {
            if (rest.value !== undefined) setValue(String(rest.value));
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [rest.value]);

        const doValidate = React.useCallback(
            (val: string): string | null => {
                // HTML-like validations
                if (required && !val) return requiredMessage;
                if (minLength !== undefined && val.length < minLength)
                    return minLengthMessage || `Must be at least ${minLength} characters`;
                if (maxLength !== undefined && val.length > maxLength)
                    return maxLengthMessage || `Must be at most ${maxLength} characters`;
                if (pattern && val && !(new RegExp(pattern as any).test(val)))
                    return patternMessage;
                const num = Number(val);
                if (!Number.isNaN(num)) {
                    if (min !== undefined && num < Number(min))
                        return minMessage || `Must be ≥ ${min}`;
                    if (max !== undefined && num > Number(max))
                        return maxMessage || `Must be ≤ ${max}`;
                }
                // Custom validators
                const custom = runValidators(val, validate);
                if (custom) return custom || null;
                return null;
            },
            [required, minLength, maxLength, pattern, min, max, requiredMessage, minLengthMessage, maxLengthMessage, minMessage, maxMessage, validate]
        );

        const currentState: "default" | "info" | "success" | "error" =
            forcedState || (error ? "error" : success ? "success" : info ? "info" : "default");

        const borderByState = {
            default: "border-input",
            info: "border-blue-400",
            success: "border-emerald-500",
            error: "border-red-500",
        } as const;

        const textByState = {
            info: "text-blue-600",
            success: "text-emerald-600",
            error: "text-red-600",
        } as const;

        const onBlurLocal = (e: React.FocusEvent<HTMLInputElement>) => {
            setTouched(true);
            const nextErr = doValidate(e.target.value);
            setError(nextErr);
            if (nextErr) onInvalid?.(e.target.value, nextErr);
            else onValid?.(e.target.value);
            onBlur?.(e);
        };

        const onChangeLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
            if (touched) {
                const nextErr = doValidate(e.target.value);
                setError(nextErr);
            }
            onChange?.(e);
        };

        const helpLine = error || success || info || hint;
        const helpState: "error" | "success" | "info" | "default" = error ? "error" : success ? "success" : info ? "info" : "default";

        const fieldId = id || name;

        return (
            <div className="w-full">
                {label && (
                    <Label htmlFor={fieldId} className="mb-1 block">
                        {label}
                    </Label>
                )}
                <Input
                    id={fieldId}
                    name={name}
                    value={value}
                    onBlur={onBlurLocal}
                    onChange={onChangeLocal}
                    aria-invalid={!!error}
                    aria-describedby={helpLine ? `${fieldId}-desc` : undefined}
                    className={cn(
                        "w-full",
                        borderByState[currentState],
                        error && "focus-visible:ring-red-500",
                        className
                    )}
                    {...rest}
                    ref={ref}
                />
                {helpLine && (
                    <p id={`${fieldId}-desc`} className={cn("mt-1 text-xs", helpState !== "default" && textByState[helpState])}>
                        {helpLine}
                    </p>
                )}
            </div>
        );
    }
);
CInput.displayName = "CInput";