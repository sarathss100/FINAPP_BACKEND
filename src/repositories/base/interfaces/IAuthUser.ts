interface IAuthUser {
    userId: string;
    phoneNumber: string;
    status: boolean;
    role: string;
    is2FA: boolean;
    hashedPassword?: string;
}

export default IAuthUser;
