
interface IChatRepository {
    createChat(userId: string, role: 'user' | 'bot', message: string): Promise<void>;
}

export default IChatRepository;