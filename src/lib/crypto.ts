// Cross-runtime Web Crypto (Browser + Node 16+)
import {SERVER_SECRET_KEY} from "./api.ts";

const webcrypto: Crypto = (globalThis as any).crypto || (await import('node:crypto')).webcrypto as unknown as Crypto;

// ===== Encoding helpers =====
function toUint8(input: string | ArrayBuffer | Uint8Array): Uint8Array {
    if (input instanceof Uint8Array) return input;
    if (input instanceof ArrayBuffer) return new Uint8Array(input);
    return new TextEncoder().encode(input);
}

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

function bytesToBase64(bytes: Uint8Array): string {
    // Browser safe
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    }
    // Node
    return Buffer.from(bytes).toString('base64');
}

export type OutputFormat = 'bytes' | 'hex' | 'base64';

// ===== Salt generation =====
/**
 * Generates a cryptographically strong random salt.
 * @param byteLength Number of bytes to generate (default 16 = 128 bits)
 * @param format Output format (default 'hex')
 */
export function generateSalt(byteLength = 16, format: OutputFormat = 'base64'): Uint8Array | string {
    const buf = new Uint8Array(byteLength);
    webcrypto.getRandomValues(buf);
    if (format === 'bytes') return buf;
    if (format === 'base64') return bytesToBase64(buf);
    return bytesToHex(buf); // hex
}

// ===== HMAC-SHA256 =====
/**
 * Computes HMAC-SHA256 of a message with a secret key.
 * @param message Data to sign (string or binary)
 * @param secret Secret key material (string or binary)
 * @param format Output format (default 'hex')
 */
export async function hmacSha256(
    message: string | ArrayBuffer | Uint8Array,
    secret: string | ArrayBuffer | Uint8Array,
    format: OutputFormat = 'base64'
): Promise<Uint8Array | string> {
    const keyData = toUint8(secret);
    const cryptoKey = await webcrypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const sig = await webcrypto.subtle.sign(
        'HMAC',
        cryptoKey,
        toUint8(message)
    );

    const bytes = new Uint8Array(sig);
    if (format === 'bytes') return bytes;
    if (format === 'base64') return bytesToBase64(bytes);
    return bytesToHex(bytes);
}

// ===== Optional: canonical request helpers for signing =====
export interface CanonicalParts {
    publicId: string; // GET/POST...
    username: string;   // e.g. james@yahoo.com
    role: string; // e.g. STANDARD
    salt: string;  // hex/base64 salt
}

export function canonicalString({ publicId, username, role = 'STANDARD', salt }: CanonicalParts) {
    // Example canonical order; adapt to your backend contract
    return publicId.concat(":")
        .concat(username)
        .concat(":")
        .concat(role)
        .concat(":")
        .concat(salt);
}

/**
 * Example: produces an `X-Signature` for an HTTP request. Adjust to your API.
 */
export async function signRequest(
    parts: CanonicalParts,
    secret: string = SERVER_SECRET_KEY,
    output: Exclude<OutputFormat, 'bytes'> = 'base64'
): Promise<string> {
    const canon = canonicalString(parts);
    const sig = await hmacSha256(canon, secret, output);
    return sig as string;
}