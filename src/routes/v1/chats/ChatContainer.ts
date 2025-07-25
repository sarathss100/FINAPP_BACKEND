import ChatManagementRepository from '../../../repositories/chats/ChatManagementRepository';
import ChatService from '../../../services/chats/ChatService';
import ChatController from '../../../controller/chats/ChatController';
import IChatController from '../../../controller/chats/interfaces/IChatController';
import createChatRouter from './ChatRouter';

class ChatContainer {
    public readonly controller: IChatController;
    public readonly router: ReturnType<typeof createChatRouter>;

    constructor() {
        const repository = new ChatManagementRepository();
        const service = new ChatService(repository);
        this.controller = new ChatController(service);
        this.router = createChatRouter(this.controller);
    }
}

export default ChatContainer;