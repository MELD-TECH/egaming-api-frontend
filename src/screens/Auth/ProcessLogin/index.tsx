import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import {requestCodeAuthorization, setAuthToken} from "../../../lib/api.ts";
import {setAppInfo} from "../../../lib/httpClient.ts";
import Loader from "../../../components/Loader/Loader.tsx";


export const ProcessLogin = (): JSX.Element => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');
    const navigate = useNavigate();

    // The function will invoke when the user changes the tab
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (hasFetchedRef.current) return; // Prevent double-call in React 18 StrictMode (dev)
        hasFetchedRef.current = true;

        (async () => {
            try {
                const authentication = await requestCodeAuthorization(code);
                const authData = authentication.data;

                setAuthToken(authData?.data?.access_token);
                setAppInfo('auth-token-rt', authData?.data?.refresh_token);
                navigate('/authorizing/login', {replace: true});
            } catch (e) {
                // Optionally: show an error or fallback UI
                console.error('Failed to fetch authorizer URL', e);
                navigate('/');
            }
        })();
    }, []);

    return (
        <Loader fullscreen message="Signing you in…" size="md" />
    );
}