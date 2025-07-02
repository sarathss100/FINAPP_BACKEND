import { Router } from 'express';
import ChatManagementRepository from 'repositories/chats/ChatManagementRepository';
import ChatService from 'services/chats/ChatService';
import ChatController from 'controller/chats/ChatController';
import IChatController from 'controller/chats/interfaces/IChatController';

const router = Router();
const chatRepository = new ChatManagementRepository();
const chatService = new ChatService(chatRepository);
const chatController: IChatController = new ChatController(chatService);

// CRUD operations
router.post('/', chatController.createChat.bind(chatController));

export default router;
