import {useEffect, useRef} from "react";
import {clearAllAppInfo, clearAuthToken, logout} from "../../../lib/api.ts";
import {useNavigate} from "react-router-dom";
import Loader from "../../../components/Loader/Loader.tsx";


export const SignOut = (): JSX.Element => {
    const navigate = useNavigate();
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (hasFetchedRef.current) return; // Prevent double-call in React 18 StrictMode (dev)
        hasFetchedRef.current = true;

        (async () => {
            try {
                const resp = await logout();
                const auth = resp?.data;
                if(auth) {
                        clearAuthToken();
                        clearAllAppInfo();
                        // @ts-ignore
                        window.location.replace(auth);
                }
            } catch (e) {
                // Optionally: show an error or fallback UI
                clearAuthToken();
                clearAllAppInfo();
                navigate("/");
                console.error('Failed to fetch authorizer URL', e);
            }
        })();
    }, []);

    return (
        <Loader fullscreen message="We are leaving..." size="md" />
    );
}