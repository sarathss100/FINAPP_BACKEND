export default interface IChatDTO {
    _id?: string;
    userId?: string;
    role: 'user' | 'bot' | 'admin';
    message: string;
    timestamp?: Date;
}