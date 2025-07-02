import mongoose, { Model } from 'mongoose';
import ChatSchema from '../schema/ChatSchema';
import IChat from '../interfaces/IChat';

// Indexes 
ChatSchema.index({ userId: 1 });

const ChatModel: Model<IChat> = mongoose.model<IChat>('Chats', ChatSchema);
export default ChatModel;
