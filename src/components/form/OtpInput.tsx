import React from "react";
import { cn } from "../../lib/utils";

export type OtpInputProps = {
    length?: number; // default 6
    value?: string;  // controlled value (optional)
    defaultValue?: string; // uncontrolled initial
    onChange?: (code: string) => void;
    onComplete?: (code: string) => void;
    disabled?: boolean;
    autoFocus?: boolean;
    name?: string;
    className?: string;
    inputClassName?: string;
    // Accessibility
    ariaLabelPrefix?: string; // e.g. "Digit"
    // Validation UI
    hasError?: boolean;
    errorMessage?: string;
};

export const OtpInput: React.FC<OtpInputProps> = ({
                                                      length = 6,
                                                      value,
                                                      defaultValue = "",
                                                      onChange,
                                                      onComplete,
                                                      disabled,
                                                      autoFocus,
                                                      name = "otp",
                                                      className,
                                                      inputClassName,
                                                      ariaLabelPrefix = "OTP digit",
                                                      hasError,
                                                      errorMessage,
                                                  }) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<string>(
        (isControlled ? value! : defaultValue).slice(0, length)
    );
    const code = (isControlled ? value! : internal).padEnd(length, "");

    const refs = React.useRef<HTMLInputElement[]>([]);

    React.useEffect(() => {
        if (isControlled) return;
        setInternal((prev) => prev.slice(0, length));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [length]);

    React.useEffect(() => {
        if (isControlled && value!.length === length) {
            onComplete?.(value!);
        }
    }, [isControlled, length, onComplete, value]);

    const emit = (next: string) => {
        onChange?.(next);
        if (!isControlled) setInternal(next);
        if (next.length === length) onComplete?.(next);
    };

    const focusIndex = (i: number) => {
        const el = refs.current[i];
        if (el) el.focus();
    };

    const setDigit = (i: number, d: string) => {
        const cleaned = d.replace(/\D/g, "");
        if (!cleaned) return;

        const arr = code.split("");
        arr[i] = cleaned[0];
        let next = arr.join("");

        // Auto-advance
        if (i < length - 1) {
            focusIndex(i + 1);
        }

        // If user typed more than one (IME/paste into single box)
        if (cleaned.length > 1) {
            for (let k = 1; k < cleaned.length && i + k < length; k++) {
                arr[i + k] = cleaned[k];
            }
            next = arr.join("");
            const last = Math.min(i + cleaned.length, length - 1);
            focusIndex(last);
        }

        emit(next.replace(/\s/g, ""));
    };

    const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        const { key } = e;
        if (key === "Backspace") {
            e.preventDefault();
            const arr = code.split("");
            if (arr[i]) {
                arr[i] = "";
                emit(arr.join(""));
            } else if (i > 0) {
                arr[i - 1] = "";
                emit(arr.join(""));
                focusIndex(i - 1);
            }
            return;
        }

        if (key === "ArrowLeft" && i > 0) {
            e.preventDefault();
            focusIndex(i - 1);
            return;
        }
        if (key === "ArrowRight" && i < length - 1) {
            e.preventDefault();
            focusIndex(i + 1);
            return;
        }
    };

    const handlePaste = (i: number, e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        if (!text) return;
        const arr = code.split("");
        for (let k = 0; k < text.length && i + k < length; k++) {
            arr[i + k] = text[k];
        }
        const next = arr.join("");
        emit(next);
        const last = Math.min(i + text.length, length - 1);
        focusIndex(last);
    };

    return (
        <div className={cn("flex w-full flex-col gap-2", className)}>
            <div className="flex items-center justify-between gap-2" aria-label="One-time password inputs">
                {Array.from({ length }).map((_, i) => (
                    <input
                        key={i}
                        ref={(el) => {
                            if (el) refs.current[i] = el;
                        }}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        autoComplete="one-time-code"
                        aria-label={`${ariaLabelPrefix} ${i + 1}`}
                        name={`${name}-${i}`}
                        disabled={disabled}
                        value={code[i] ?? ""}
                        onChange={(e) => setDigit(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={(e) => handlePaste(i, e)}
                        className={cn(
                            "h-12 w-12 text-center text-xl font-semibold rounded-lg border border-gray-30 bg-white text-gray-900",
                            "focus:outline-none focus:ring-2 focus:ring-brand-60 focus:border-brand-60",
                            "disabled:opacity-50",
                            inputClassName,
                            hasError && "border-red-400 focus:ring-red-400"
                        )}
                        {...(autoFocus && i === 0 ? { autoFocus: true } : {})}
                    />
                ))}
            </div>
            {hasError && (
                <p role="alert" className="text-sm text-red-600 font-medium">{errorMessage ?? "Invalid code"}</p>
            )}
        </div>
    );
};