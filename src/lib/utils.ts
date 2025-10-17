import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {FilterRequest} from "./appModels.ts";

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

export function buildQueryString(filter: FilterRequest) {
    let queryString = "";
    for (const key in filter) {
        // @ts-ignore
        if (filter[key] !== undefined) {
            // @ts-ignore
            queryString += `${key}=${filter[key]}&`;
        }
    }
    return queryString;
}

/**
 * Truncate a number to a fixed number of decimals (no rounding).
 * E.g. truncFixed(1.69, 1) => 1.6
 */
function truncFixed(n: number, decimals: number): number {
    const f = Math.pow(10, decimals);
    return Math.trunc(n * f) / f;
}

/**
 * Format a number into a short compact form using K, M, B, T.
 * - Default 1 decimal place, truncated (not rounded), e.g. 1.65M -> 1.6M
 * - Removes trailing ".0"
 * - Supports negatives and values < 1000 (keeps as-is with locale formatting)
 */
export function formatCompactNumber(
    value: number | string | null | undefined,
    options?: {
        decimals?: number;    // default 1
        trimZeros?: boolean;  // default true (turn 1.0K into 1K)
        locale?: string;      // default 'en-US' when not compacting
    }
): string {
    if (value === null || value === undefined) return "";
    const num = typeof value === "string" ? Number(value) : value;
    if (!isFinite(num)) return "";

    const decimals = options?.decimals ?? 1;
    const trimZeros = options?.trimZeros ?? true;
    const locale = options?.locale ?? "en-US";

    const abs = Math.abs(num);
    const sign = num < 0 ? "-" : "";

    const units = [
        { v: 1e12, s: "T" },
        { v: 1e9,  s: "B" },
        { v: 1e6,  s: "M" },
        { v: 1e3,  s: "K" },
    ];

    for (const u of units) {
        if (abs >= u.v) {
            const raw = abs / u.v; // e.g. 1650000 / 1e6 = 1.65
            const truncated = decimals > 0 ? truncFixed(raw, decimals) : Math.trunc(raw);
            let txt = truncated.toFixed(decimals);
            if (trimZeros && decimals > 0) {
                // remove trailing .0 or .00, etc.
                txt = txt.replace(/\.0+$/, "").replace(/(\.[1-9]*)0+$/, "$1");
            }
            return `${sign}${txt}${u.s}`;
        }
    }

    // For values < 1000, return as a normal localized number
    return num.toLocaleString(locale);
}

/**
 * Optional: currency variant for amounts, keeping the same compact rules.
 * Example: formatCurrencyCompact(1650000, 'USD') -> "$1.6M"
 */
export function formatCurrencyCompact(
    value: number | string | null | undefined,
    currency: string,
    options?: Parameters<typeof formatCompactNumber>[1] & { position?: "prefix" | "suffix"; space?: boolean }
): string {
    const position = options?.position ?? "prefix"; // where to place the symbol
    const space = options?.space ?? false;

    // Derive a currency symbol via Intl for the locale
    const locale = options?.locale ?? "en-US";
    const n = typeof value === "string" ? Number(value) : value ?? 0;

    // If we cannot compact (NaN/Infinity), return an empty string
    if (!isFinite(n)) return "";

    // Try to fetch a symbol for the currency
    const parts = new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 })
        .formatToParts(0);
    const symbol = parts.find(p => p.type === "currency")?.value ?? currency + " ";

    const compact = formatCompactNumber(n, options);
    if (!compact) return "";

    const sep = space ? " " : "";
    return position === "prefix" ? `${symbol}${sep}${compact}` : `${compact}${sep}${symbol}`;
}

/**
 * Returns a relative time string for a past timestamp (in ms) compared to now.
 * Examples:
 *  - 1_000 -> "a second ago"
 *  - 12_000 -> "few seconds ago"
 *  - 60_000 -> "a minute ago"
 *  - 2 * 60_000 -> "2 minutes ago"
 *  - 60 * 60_000 -> "1 hour ago"
 *  - 24 * 60 * 60_000 -> "1 day ago"
 *  - 30 * 24 * 60 * 60_000 -> "30 days ago"
 *  - 11 * 30 * 24 * 60 * 60_000 -> "11 months ago"
 *  - 100 * 365 * 24 * 60 * 60_000 -> "100 years ago"
 */
export function timeAgoFromMs(pastMs: number, options?: { now?: number }): string {
    const now = options?.now ?? Date.now();
    let diff = now - pastMs;

    // Treat future times as "a second ago" (or you can return "in X" if needed)
    if (diff < 0) diff = 0;

    const sec = 1000;
    const min = 60 * sec;
    const hr = 60 * min;
    const day = 24 * hr;
    // For coarse humanized ranges, 30 days ≈ 1 month is typically acceptable
    const month = 30 * day;
    const year = 365 * day;

    if (diff < 1.5 * sec) return "a second ago";             // ~0–1.5s
    if (diff < 45 * sec) return "few seconds ago";           // ~1.5s–45s
    if (diff < 90 * sec) return "a minute ago";              // ~45–90s

    if (diff < 60 * min) {
        const m = Math.floor(diff / min);                       // 2–59
        return `${m} minute${m === 1 ? "" : "s"} ago`;
    }

    if (diff < 24 * hr) {
        const h = Math.floor(diff / hr);                        // 1–23
        return `${h} hour${h === 1 ? "" : "s"} ago`;
    }

    if (diff < 31 * day) {                                    // 1–30
        const d = Math.floor(diff / day);
        return `${d} day${d === 1 ? "" : "s"} ago`;
    }

    if (diff < 12 * month) {                                  // 1–11
        const mo = Math.floor(diff / month);
        return `${mo} month${mo === 1 ? "" : "s"} ago`;
    }

    // Cap years at 100 if you want to strictly satisfy "1 - 100 years"
    let y = Math.floor(diff / year);                          // 1+
    if (y > 100) y = 100;
    return `${y} year${y === 1 ? "" : "s"} ago`;
}

export const getDateParts = (datePart: string | undefined) : { from: string, to: string } => {
    const d = new Date();
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = d.getDate().toString().padStart(2, "0");

    // Set the date to the first day of the next month
    const lastDay = new Date(year, d.getMonth() + 1, 0).getDate();

    const y = (datePart === "YEAR");
    const m = (datePart === "MONTH");

    const from = `${year}-${y? "01": month}-${m? "01" : day}`;
    const to = `${year}-${y? "12" : month}-${m? lastDay : day}`;

    return { from, to };
};
