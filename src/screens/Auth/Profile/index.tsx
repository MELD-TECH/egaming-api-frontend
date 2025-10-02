import {useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../../../lib/api.ts";
import {setAppInfo} from "../../../lib/httpClient.ts";
import Loader from "../../../components/Loader/Loader.tsx";

export const Profile = () => {
    const navigate = useNavigate();
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (hasFetchedRef.current) return; // Prevent double-call in React 18 StrictMode (dev)
        hasFetchedRef.current = true;

        (async () => {
            try {
                const resp = await fetchProfile();
                const users = resp?.data;
                if(users) {
                    setAppInfo('profile', JSON.stringify(users?.data));
                    navigate('/dashboard', {replace: true});
                }
            } catch (e) {
                // Optionally: show an error or fallback UI
                console.error('Failed to fetch authorizer URL', e);
            }
        })();
    }, []);

    return (
        <Loader fullscreen message="Completing your profile setup..." size="md" />
    );
}