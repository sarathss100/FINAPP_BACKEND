import IChatDTO from "../../../dtos/chats/chatDTO";
import IChatDocument from "../../../model/chats/interfaces/IChat";

export default interface IChatRepository {
    createChat(userId: string, role: 'user' | 'admin', message: string): Promise<void>;
    getHistory(userId: string): Promise<IChatDocument[]>;
    getAllChatSessions(): Promise<{ userId: string; chats: IChatDTO[]}[]>;
}