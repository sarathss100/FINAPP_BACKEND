import { Document, Types } from 'mongoose';

interface IChat extends Document {
    _id: Types.ObjectId;
    userId: string;
    role: 'user' | 'bot';
    message: string;
    timestamp: Date;
}

export default IChat;


