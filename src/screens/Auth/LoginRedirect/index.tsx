// import { Loader } from "../../../../ui-components/Loader";
import {useEffect, useRef} from "react";
import { getAuthorizerUrl} from "../../../lib/api.ts";
import Loader from "../../../components/Loader/Loader.tsx";

export const LoginRedirect = () => {
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (hasFetchedRef.current) return; // Prevent double-call in React 18 StrictMode (dev)
        hasFetchedRef.current = true;

        (async () => {
            try {
                const authUrl = await getAuthorizerUrl();
                const url = authUrl?.data;
                if (url) {
                    // @ts-ignore
                    window.location.replace(url);
                }
            } catch (e) {
                // Optionally: show an error or fallback UI
                console.error('Failed to fetch authorizer URL', e);
            }
        })();
    }, []);

    return <Loader fullscreen message="Loading your Sign in component..." size="md" />;
}