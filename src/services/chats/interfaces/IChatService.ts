
interface IChatService {
    createChat(accessToken: string, role: 'user' | 'bot', message: string): Promise<void>;
}

export default IChatService;

