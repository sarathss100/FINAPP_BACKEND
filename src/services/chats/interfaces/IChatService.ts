import IChatDTO from "../../../dtos/chats/chatDTO";

export default interface IChatService {
    createChat(accessToken: string, role: 'user' | 'admin', message: string): Promise<string>;
    getChatHistory(accessToken: string): Promise<IChatDTO[]>;
    getAllChatSessions(): Promise<{ userId: string; chats: IChatDTO[]}[]>;
}
