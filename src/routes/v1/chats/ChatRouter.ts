import { Router } from 'express';
import ChatManagementRepository from 'repositories/chats/ChatManagementRepository';
import ChatService from 'services/chats/ChatService';
import ChatController from 'controller/chats/ChatController';
import IChatController from 'controller/chats/interfaces/IChatController';
// import OpenAIService from 'services/openAi/OpenAIService';

const router = Router();
const chatRepository = new ChatManagementRepository();
// const chatbotProvider = new OpenAIService(process.env.OPENAI_API_KEY!);
// const chatService = new ChatService(chatRepository, chatbotProvider);
const chatService = new ChatService(chatRepository);
const chatController: IChatController = new ChatController(chatService);

// CRUD operations
router.get('/', chatController.createChat.bind(chatController));
router.get('/token', chatController.getAccessToken.bind(chatController));

export default router;
