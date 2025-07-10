import { ChatDTO } from "dtos/chats/chatDTO";

interface IChatService {
    createChat(accessToken: string, role: 'user' | 'admin', message: string): Promise<string>;
    getChatHistory(accessToken: string): Promise<ChatDTO[]>;
}

export default IChatService;

