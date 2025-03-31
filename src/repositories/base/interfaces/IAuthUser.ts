interface IAuthUser {
    userId: string;
    phoneNumber: string;
    status: boolean;
    role: string;
    hashedPassword?: string;
}

export default IAuthUser;
