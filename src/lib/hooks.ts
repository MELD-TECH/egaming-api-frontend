import {UserProfile} from "./appModels.ts";
import {useEffect, useState} from "react";
import {getProfile} from "./checkPrivilege.ts";


export const useUserProfile = (): UserProfile => {
    const [user, setUser] = useState<UserProfile>();

    useEffect(() => {
        const profile = getProfile();
        setUser(profile);
    }, []);

    return <UserProfile>user;
}