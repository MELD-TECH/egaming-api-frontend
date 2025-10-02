import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader.tsx";

export const Home = (): JSX.Element => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/auth/login', {replace: true});
    }, [navigate]);

    return (
        <Loader fullscreen message="Redirecting to sign in..." size="md" />
    );
}