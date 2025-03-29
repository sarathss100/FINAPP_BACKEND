interface IAuthUser {
    userId: string;
    phoneNumber: string;
    status: string;
    role: string;
    hashedPassword?: string;
}

export default IAuthUser;
