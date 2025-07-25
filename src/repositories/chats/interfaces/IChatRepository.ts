import { ChatDTO } from "../../../dtos/chats/chatDTO";

interface IChatRepository {
    createChat(userId: string, role: 'user' | 'admin', message: string): Promise<void>;
    getHistory(userId: string): Promise<ChatDTO[]>;
    getAllChatSessions(): Promise<{ userId: string; chats: ChatDTO[]}[]>;
}

export default IChatRepository;