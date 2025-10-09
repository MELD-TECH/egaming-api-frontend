export interface UserPrivilege {
    permissions: string[];
}

export interface UserProfile {
    username: string;
    publicId: string;
    profile: {
        firstName: string;
        middleName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        profilePicture: string;
        createdOn: string;
        settings: {
            role: string;
            isEmailVerified: boolean;
        }
    }
}

export interface Lga {
    name: string;
    slugCode: string;
    latitude: number;
    longitude: number;
    stateCode: string;
    countryCode: string;
}
