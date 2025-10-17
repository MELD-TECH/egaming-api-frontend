export type AuthUnauthorizedDetail = {
    at: number;
    status?: number;
    requestId?: string;
    url?: string;
    method?: string;
    reason?: string;
};

// Augment WindowEventMap for strong typing
declare global {
    interface WindowEventMap {
        'auth:unauthorized': CustomEvent<AuthUnauthorizedDetail>;
    }
}

export function emitAuthUnauthorized(detail: AuthUnauthorizedDetail) {
    window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail }));
}

export function onAuthUnauthorized(
    handler: (e: CustomEvent<AuthUnauthorizedDetail>) => void
) {
    window.addEventListener('auth:unauthorized', handler as EventListener);
    return () => window.removeEventListener('auth:unauthorized', handler as EventListener);
}