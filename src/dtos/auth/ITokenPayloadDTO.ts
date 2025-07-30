export default interface ITokenPayloadDTO {
    userId: string;
    phoneNumber: string;
    role: string;
    status: boolean;
    exp?: number;
    iat?: number;
}
