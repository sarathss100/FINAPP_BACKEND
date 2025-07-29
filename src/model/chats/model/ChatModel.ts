import mongoose, { Model } from 'mongoose';
import ChatSchema from '../schema/ChatSchema';
import IChatDocument from '../interfaces/IChat';

// Indexes 
ChatSchema.index({ userId: 1 });

const ChatModel: Model<IChatDocument> = mongoose.model<IChatDocument>('Chats', ChatSchema);
export default ChatModel;
