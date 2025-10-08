import Loader from "../../../components/Loader/Loader.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {getProfileFromStorage} from "../../../lib/checkPrivilege.ts";
import {requestUserRoleChange} from "../../../lib/api.ts";
import {useToast} from "../../../components/feedback/Toast.tsx";

// Helper to get public id from router state or query
function usePublicIdFromRoute(): string | null {
    const navigate = useNavigate();
    const { state, search } = useLocation();
    const idFromState = (state as any)?.operator as string | undefined;
    const params = new URLSearchParams(search);
    const idlFromQuery = params.get("operator") ?? undefined;
    const id = idFromState || idlFromQuery || null;

    useEffect(() => {
        if (!id) {
            // If user landed here without email, redirect back to reset
            navigate("/logout", { replace: true });
        }
    }, [id, navigate]);

    return id;
}
export const RolePromoter = (): JSX.Element => {
    const id = usePublicIdFromRoute();
    const navigate = useNavigate();
    const { show } = useToast();

    useEffect(() => {
        const { publicId, username } = getProfileFromStorage();
        if (!publicId || !username) {
            show({ title: "Missing User Profile", message: "User profile could not be loaded.", type: "error" });
        }

        (async () => {
            try {
                const resp = await requestUserRoleChange(publicId, username);
                const ok = resp?.data;
                if (ok?.data) {
                    show({ title: "Success", message: "User profile updated successfully.", type: "success" });
                } else {
                    show({ title: "Update Failed", message: "Failed to complete user profile update.", type: "error" });
                }
            }catch (e) {
                show({ title: "Error", message: "Could not complete user profile updating.", type: "error" });
            }
        })();
        navigate("/logout", { replace: true });
    }, [id]);

    return <Loader fullscreen message="Completing company profile setup..." size="md" />
}