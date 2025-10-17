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

export interface FilterRequest {
    page: number;
    size: number;
    name?: string;
    search?: string;
    lga?: string;
    status?: string;
    sort?: string;
    createdFrom?: string;
    createdTo?: string;
    startDate?: string;
    endDate?: string;
}

export interface ResponseMetadata {
    page: number;
    size: number;
    totalPages: number;
    total: number;
    previous: number;
    next: number;
}

export interface OperatorData {
    id: number;
    publicId: string;
    registrationNumber: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    lga: string;
    contactPerson: string;
    contactPersonPhone: string;
    contactPersonEmail: string;
    status: string;
    totalStakeAmountByOperator: number;
    totalUniqueGamesPlayedByOperator: number;
    totalStakeWinningAmountByOperator: number;
    totalUniquePlayersByOperator: number;
    createdOn: number;
}

export interface OperatorSummary {
    totalOperators: number;
    totalStakesAmount: number;
    totalStakes: number;
    totalWinningAmount: number;
    totalWinnings: number;
}

export interface StakeData {
    referenceNumber: string;
    stakeReference: string;
    operator: {
            name: string;
            email: string;
            phoneNumber: string;
    };
    customer: {
        name: string;
        gamePlayed: string;
        gameCode: string;
        amount: number;
    }
    location: {
        address: string;
        lgaCode: string;
        lgaName: string;
        stateCode: string;
        stateName: string;
        countryCode: string;
    };
    terminalId: string;
    clientId: string;
    createdOn: string;
}

export interface TransactionData {
    transactionReference: string;
    stakeRegistration: StakeData;
    amountWon: number;
    clientId: string;
    transactionDate: string;
    createdOn: number;
}