export default interface IAuthUserDTO {
    userId: string;
    phoneNumber: string;
    status: boolean;
    role: string;
    is2FA: boolean;
    hashedPassword?: string;
}
