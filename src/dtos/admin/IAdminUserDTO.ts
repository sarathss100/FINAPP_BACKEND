export default interface IAdminUserDTO {
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    status: boolean;
    twoFactorEnabled: boolean;
}