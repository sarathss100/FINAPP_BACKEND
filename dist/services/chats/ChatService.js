"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ChatManagementRepository_1 = __importDefault(require("repositories/chats/ChatManagementRepository"));
const OpenAIService_1 = __importDefault(require("services/openAi/OpenAIService"));
// import ChatbotProvider from 'services/openAi/interfaces/ChatbotProvider';
// import OpenAIService from 'services/openAi/OpenAIService';
/**
 * Service class for managing chat records.
 * Handles business logic and authentication before delegating database operations to the repository.
 */
class ChatService {
    // private _chatbotProvider: ChatbotProvider;
    /**
     * Constructs a new instance of the ChatService.
     *
     * @param {IChatRepository} chatRepository - The repository used for interacting with chat data.
     */
    constructor(chatManagementRepository) {
        this._chatManagementRepository = chatManagementRepository;
        // this._chatbotProvider = chatbotProvider 
    }
    static get instance() {
        if (!ChatService._instance) {
            const repo = ChatManagementRepository_1.default.instance;
            // const provider = new OpenAIService(process.env.OPENAI_API_KEY!);
            ChatService._instance = new ChatService(repo);
        }
        return ChatService._instance;
    }
    // Creates a new chat record for the authenticated user.
    createChat(userId, role, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Save user message 
                yield this._chatManagementRepository.createChat(userId, role, message);
                // Get bot reply
                const botReply = yield (0, OpenAIService_1.default)(message, userId);
                return botReply;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error creating chat:', error);
                throw new Error(error.message);
            }
        });
    }
    getChatHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Save user message 
                const history = yield this._chatManagementRepository.getHistory(userId);
                return history;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error creating chat:', error);
                throw new Error(error.message);
            }
        });
    }
    getAllChatSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Save user message 
                const history = yield this._chatManagementRepository.getAllChatSessions();
                return history;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error creating chat:', error);
                throw new Error(error.message);
            }
        });
    }
}
exports.default = ChatService;
