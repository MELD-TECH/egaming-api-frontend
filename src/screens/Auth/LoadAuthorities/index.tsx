import { useNavigate } from "react-router-dom";
import {useEffect, useRef} from "react";
import { loadUserPermissions } from "../../../lib/api.ts";
import {setAppInfo} from "../../../lib/httpClient.ts";
import Loader from "../../../components/Loader/Loader.tsx";

export const LoadAuthorities = (): JSX.Element => {
    const navigate = useNavigate();

    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (hasFetchedRef.current) return; // Prevent double-call in React 18 StrictMode (dev)
        hasFetchedRef.current = true;

        (async () => {
            try {
                const resp = await loadUserPermissions();
                const perm = resp?.data;
                if(perm?.data) {
                    setAppInfo('perm', JSON.stringify(perm?.data))
                    navigate('/complete/login/profile', {replace: true});
                }
            } catch (e) {
                // Optionally: show an error or fallback UI
                console.error('Failed to fetch authorizer URL', e);
            }
        })();
    }, []);


    return (
        <Loader fullscreen message="Loading your config..." size="md" />
    );
}