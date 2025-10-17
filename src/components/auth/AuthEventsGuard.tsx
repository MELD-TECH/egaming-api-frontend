import React from 'react';
import {useNavigate} from 'react-router-dom';
import {onAuthUnauthorized} from '../../lib/authEvents';
import {useToast} from "../feedback/Toast.tsx";

export function AuthEventsGuard() {
    const navigate = useNavigate();
    const hasRedirectedRef = React.useRef(false);
    const { show } = useToast();

    React.useEffect(() => {
        let timer: number | undefined;
        return onAuthUnauthorized(() => {
            if (hasRedirectedRef.current) return; // avoid multiple redirects
            if (timer) return;
            hasRedirectedRef.current = true;
            timer = window.setTimeout(() => {
                timer = undefined;
            }, 1000);

            // Optional: show a toast if you have a provider in context
            // toast.error('Your session has expired. Please log in again.');
            if(hasRedirectedRef.current) show({ title: "Session Expired", message: "Your session has expired. Please log in again.", type: "error" });
            // Prefer SPA navigation; if you want a full reset, use window.location.replace
            navigate('/logout', {replace: true});
        });
    }, [navigate]);
    return null; // no UI
}