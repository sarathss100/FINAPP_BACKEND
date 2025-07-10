import { ChatDTO } from "dtos/chats/chatDTO";

interface IChatService {
    createChat(accessToken: string, role: 'user' | 'admin', message: string): Promise<string>;
    getChatHistory(accessToken: string): Promise<ChatDTO[]>;
    getAllChatSessions(): Promise<{ userId: string; chats: ChatDTO[]}[]>;
}

export default IChatService;

