import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseDataLoaderOptions<P = unknown> {
    params?: P;
    enabled?: boolean;           // allow conditional fetching
    preservePreviousData?: boolean; // keep last data while refetching (good for pagination)
}

export interface UseDataLoaderState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    reload: () => void;
}

export function useDataLoader<T, P = unknown>(
    fetcher: (params: P, signal?: AbortSignal) => Promise<T>,
    { params, enabled = true, preservePreviousData = true }: UseDataLoaderOptions<P> = {}
): UseDataLoaderState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const reloadFlag = useRef(0);

    const reload = useCallback(() => {
        reloadFlag.current++;
        // triggers effect through ref change captured in deps
    }, []);

    useEffect(() => {
        if (!enabled) return;

        const controller = new AbortController();
        const { signal } = controller;

        let cancelled = false;

        const run = async () => {
            if (!preservePreviousData) {
                setData(null);
            }
            setLoading(true);
            setError(null);
            try {
                const result = await fetcher((params as P), signal);
                if (!cancelled) {
                    setData(result);
                }
            } catch (err: any) {
                if (signal.aborted) return; // ignore abort errors
                if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();

        return () => {
            cancelled = true;
            controller.abort();
        };
        // include JSON-stringifies params and reload flag so affect re-runs
    }, [enabled, preservePreviousData, JSON.stringify(params), reloadFlag.current]);

    return { data, loading, error, reload };
}