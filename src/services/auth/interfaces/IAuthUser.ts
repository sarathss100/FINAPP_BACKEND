interface IAuthServiceUser {
    userId: string;
    phoneNumber: string;
    status: boolean;
    role: string;
    is2FA: boolean;
}

export default IAuthServiceUser;
