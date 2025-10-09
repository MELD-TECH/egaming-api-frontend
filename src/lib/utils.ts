import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Avatar helpers ---

/**
 * Extract initials from a full name or email.
 * Examples:
 *  - "John Smith" -> "JS"
 *  - "john" -> "J"
 *  - "john.smith@example.com" -> "JS"
 *  - "Mary   Jane  Watson  " -> "MW" (first and last token)
 */
export function getInitials(input?: string | null): string {
    if (!input) return "";
    const s = String(input).trim();
    if (!s) return "";

    // If it looks like an email, try name-part before @
    const nameLike = s.includes("@") ? s.split("@")[0] : s;

    // Replace separators (. _ -) with spaces for better tokenization
    const normalized = nameLike
        .replace(/[._-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!normalized) return "";

    const parts = normalized.split(" ").filter(Boolean);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    // First and last parts
    const first = parts[0].charAt(0).toUpperCase();
    const last = parts[parts.length - 1].charAt(0).toUpperCase();
    return `${first}${last}`;
}

/**
 * Create a stable hash number from a seed string.
 */
function hashString(seed: string): number {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = (h << 5) - h + seed.charCodeAt(i);
        h |= 0; // Convert to 32bit int
    }
    return Math.abs(h);
}

/**
 * Tailwind color classes to pick from. All pair well with white text.
 * You can tailor this palette to your brand.
 */
const AVATAR_BG_CLASSES = [
    "bg-primary-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-teal-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-violet-500",
];

/**
 * Deterministic background class from a seed (e.g., initials or name).
 */
export function getAvatarBg(seed?: string | null): string {
    const s = (seed || "?").toString();
    const h = hashString(s);
    const idx = h % AVATAR_BG_CLASSES.length;
    return AVATAR_BG_CLASSES[idx];
}

/**
 * Convenience helper to get initials and bg class at once.
 * If you later add light background colors, you can compute
 * contrast and swap textClass accordingly
 */
export function getAvatarProps(nameOrEmail?: string | null): {
    initials: string;
    bgClass: string;
    textClass: string; // For future contrast logic if you add light colors
} {
    const initials = getInitials(nameOrEmail) || "?";
    const bgClass = getAvatarBg(initials);
    return { initials, bgClass, textClass: "text-white" };
}
