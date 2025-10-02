export const required = (message = "This field is required") => (v: string) => (!v ? message : null);
export const email = (message = "Enter a valid email") => (v: string) => (/^\S+@\S+\.\S+$/.test(v) ? null : message);
export const minLen = (n: number, message?: string) => (v: string) => (v.length >= n ? null : message || `Min ${n} chars`);
export const maxLen = (n: number, message?: string) => (v: string) => (v.length <= n ? null : message || `Max ${n} chars`);
export const matches = (re: RegExp, message = "Invalid format") => (v: string) => (re.test(v) ? null : message);

// NEW: Strong password validator
export const password = (min = 8, customMessages?: {
    length?: string;
    case?: string;
    number?: string;
    special?: string;
}) => (v: string): string | null => {
    const lengthOk = v?.length >= min;
    const caseOk = /[A-Z]/.test(v) && /[a-z]/.test(v);
    const numberOk = /\d/.test(v);
    const specialOk = /[^A-Za-z0-9]/.test(v);

    if (!lengthOk) return customMessages?.length || `At least ${min} characters long`;
    if (!caseOk) return customMessages?.case || "Contains uppercase and lowercase letters";
    if (!numberOk) return customMessages?.number || "Contains at least one number";
    if (!specialOk) return customMessages?.special || "Contains at least one special character";
    return null;
};

// Optional: show all unmet rules at once
export const passwordUnmetRules = (min = 8) => (v: string): string[] => {
    const messages: string[] = [];
    if (!(v?.length >= min)) messages.push(`At least ${min} characters long`);
    if (!(/[A-Z]/.test(v) && /[a-z]/.test(v))) messages.push("Contains uppercase and lowercase letters");
    if (!/\d/.test(v)) messages.push("Contains at least one number");
    if (!/[^A-Za-z0-9]/.test(v)) messages.push("Contains at least one special character");
    return messages;
};