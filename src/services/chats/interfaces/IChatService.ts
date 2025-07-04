
interface IChatService {
    createChat(accessToken: string, role: 'user' | 'bot', message: string): Promise<string>;
}

export default IChatService;

