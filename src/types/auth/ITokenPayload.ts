
interface ITokenPayload {
    userId: string;
    phoneNumber: string;
    role: string;
    status: boolean;
    exp?: number;
    iat?: number;
}

export default ITokenPayload;
