import { Document, Types } from 'mongoose';

export default interface IChatDocument extends Document {
    _id: Types.ObjectId;
    userId: string;
    role: 'user' | 'bot' | 'admin';
    message: string;
    timestamp: Date;
    __v?: number;
}