import { useCallback } from "react";
import {OperatorData} from "./appModels.ts";
import {fetchOperatorByToken} from "./api.ts";

let inMemoryOperator: OperatorData | null = null;

export async function getInMemoryOperator(): Promise<OperatorData | null> {
    if (inMemoryOperator) return inMemoryOperator;
    try {
        inMemoryOperator = await setInMemoryOperator();
    } catch (e) {
        inMemoryOperator = null;
    }
    return inMemoryOperator;
}

async function setInMemoryOperator(): Promise<OperatorData | null> {
        try {
            const resp = await fetchOperatorByToken();
            return resp?.data;
        } catch (error) {
            console.error('Failed to fetch operator:', error);
            return null;
        }
}

export const useRefresh = () => {

    // Soft refresh (reset React state by triggering a "version" change)
    const softRefresh = useCallback(() => {
        window.dispatchEvent(new Event("app:soft-refresh"));
    }, []);

    // Hard reload (full browser reload)
    const hardRefresh = useCallback(() => {
        window.location.reload();
    }, []);

    return { softRefresh, hardRefresh };
};

