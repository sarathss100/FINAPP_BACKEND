import IChatService from './interfaces/IChatService';
import IChatRepository from '../../repositories/chats/interfaces/IChatRepository';
import getBotResponse from '../../services/openAi/OpenAIService';
import { wrapServiceError } from '../../utils/serviceUtils';
import ChatMapper from '../../mappers/chats/ChatsMapper';
import ChatRepository from '../../repositories/chats/ChatRepository';
import IChatDTO from '../../dtos/chats/chatDTO';
// import ChatbotProvider from 'services/openAi/interfaces/ChatbotProvider';
// import OpenAIService from 'services/openAi/OpenAIService';

export default class ChatService implements IChatService {
    private static _instance: ChatService;
    private _chatRepository: IChatRepository;
    // private _chatbotProvider: ChatbotProvider;

    constructor(chatRepository: IChatRepository) {
        this._chatRepository = chatRepository;
        // this._chatbotProvider = chatbotProvider 
    }

    public static get instance(): ChatService {
        if (!ChatService._instance) {
            const repo = ChatRepository.instance;
            // const provider = new OpenAIService(process.env.OPENAI_API_KEY!);
            ChatService._instance = new ChatService(repo);
        }
        return ChatService._instance;
    }

    async createChat(userId: string, role: 'user' | 'admin', message: string): Promise<string> {
        try {
            // Save user message 
            await this._chatRepository.createChat(userId, role, message);

            // Get bot reply
            const botReply = await getBotResponse(message, userId);

            return botReply;
        } catch (error) {
            console.error(`Error while creating new chat: `, error);
            throw wrapServiceError(error);
        }
    }

    async getChatHistory(userId: string): Promise<IChatDTO[]> {
        try {
            const history = await this._chatRepository.getHistory(userId);

            const resultDTO = ChatMapper.toDTOs(history);

            return resultDTO;
        } catch (error) {
            console.error(`Error while getting Chat History: `, error);
            throw wrapServiceError(error);
        }
    }

    async getAllChatSessions(): Promise<{ userId: string; chats: IChatDTO[]}[]> {
        try {
            const history = await this._chatRepository.getAllChatSessions();

            return history;
        } catch (error) {
            console.error(`Error while getting Chat Sessions: `, error);
            throw wrapServiceError(error);
        }
    }
}