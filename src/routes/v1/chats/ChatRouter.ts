import { Router } from 'express';
import ChatManagementRepository from '../../../repositories/chats/ChatManagementRepository';
import ChatService from '../../../services/chats/ChatService';
import ChatController from '../../../controller/chats/ChatController';
import IChatController from '../../../controller/chats/interfaces/IChatController';

const createChatRouter = function(chatController: IChatController): Router {
    const router = Router();

    router.post('/', chatController.createChat.bind(chatController));
    router.get('/token', chatController.getAccessToken.bind(chatController));

    return router;
};

export default createChatRouter;
