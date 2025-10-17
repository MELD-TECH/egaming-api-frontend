import {UserProfile} from "./appModels.ts";
import {clearAppInfo, getAppInfo} from "./httpClient.ts";

export const checkRole = (role: string) : boolean => {
    clearAppInfo("isApp");
    const user: UserProfile = JSON.parse(getAppInfo("profile") || {} as string);
    if(Object.keys(user).length > 0) {
        return  user?.profile?.settings?.role?.toUpperCase() === role?.toUpperCase();
    }
    return false;
}

export const getProfileFromStorage = () : {publicId: string, username: string} => {
    const profile = JSON.parse(getAppInfo("profile") || {} as string);
    const publicId = profile?.publicId;
    const username = profile?.username;

    return {
        publicId,
        username
    }
}

export const getProfile = () : UserProfile => {
    try {
        return  JSON.parse(getAppInfo("profile") || {} as string);
    }catch (e) {
        return {} as UserProfile;
    }
}

export const getUserContact = () : {fullName: string, email: string, phone: string, userId: string} => {
    const user = JSON.parse(getAppInfo("profile") || {} as string);
    const fullName = user?.profile?.firstName + " " + user?.profile?.lastName;
    const email = user?.profile?.email;
    const phone = user?.profile?.phoneNumber;
    const userId = user?.publicId;

    return {
        fullName,
        email,
        phone,
        userId
    }
}
