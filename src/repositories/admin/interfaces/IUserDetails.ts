
interface IUserDetails {
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    status: boolean;
    email?: string;
    is2FA?: boolean;
    lastPasswordChange?: Date;
    twoFactorEnabled?: boolean;
    connectedAccounts?: string[];
}

export default IUserDetails;
