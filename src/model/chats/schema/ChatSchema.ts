import { Schema } from 'mongoose';

const ChatSchema = new Schema({
    userId: { type: String, required: true },
    role: { type: String, enum: ['user', 'bot', 'admin'], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export default ChatSchema;


