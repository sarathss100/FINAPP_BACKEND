import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
import { AuthenticationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import IChatService from './interfaces/IChatService';
import IChatRepository from 'repositories/chats/interfaces/IChatRepository';
import ChatManagementRepository from 'repositories/chats/ChatManagementRepository';
import getBotResponse from 'services/openAi/OpenAIService';
// import ChatbotProvider from 'services/openAi/interfaces/ChatbotProvider';
// import OpenAIService from 'services/openAi/OpenAIService';

/**
 * Service class for managing chat records.
 * Handles business logic and authentication before delegating database operations to the repository.
 */
class ChatService implements IChatService {
    private static _instance: ChatService;
    private _chatManagementRepository: IChatRepository;
    // private _chatbotProvider: ChatbotProvider;

    /**
     * Constructs a new instance of the ChatService.
     *
     * @param {IChatRepository} chatRepository - The repository used for interacting with chat data.
     */
    constructor(chatManagementRepository: IChatRepository) {
        this._chatManagementRepository = chatManagementRepository;
        // this._chatbotProvider = chatbotProvider 
    }

    public static get instance(): ChatService {
        if (!ChatService._instance) {
            const repo = ChatManagementRepository.instance;
            // const provider = new OpenAIService(process.env.OPENAI_API_KEY!);
            ChatService._instance = new ChatService(repo);
        }
        return ChatService._instance;
    }

    /**
     * Creates a new chat record for the authenticated user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @param {IChatDTO} chatData - The validated chat data required to create a new chat record.
     * @returns {Promise<IChatDTO>} A promise that resolves with the created chat object.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs during the chat creation process.
     */
    async createChat(accessToken: string, role: 'user' | 'bot', message: string): Promise<string> {
        try {
            // Decode and validate the access token to extract the user ID associated with it.
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            // Save user message 
            await this._chatManagementRepository.createChat(userId, 'user', message);

            // Get bot reply
            const botReply = await getBotResponse(message, userId);

            // Save bot reply
            await this._chatManagementRepository.createChat(userId, 'bot', botReply);

            return botReply;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error creating chat:', error);
            throw new Error((error as Error).message);
        }
    }
}

export default ChatService;
