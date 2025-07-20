"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ChatManagementRepository_1 = __importDefault(require("repositories/chats/ChatManagementRepository"));
const ChatService_1 = __importDefault(require("services/chats/ChatService"));
const ChatController_1 = __importDefault(require("controller/chats/ChatController"));
const ChatRouter_1 = __importDefault(require("./ChatRouter"));
class ChatContainer {
    constructor() {
        const repository = new ChatManagementRepository_1.default();
        const service = new ChatService_1.default(repository);
        this.controller = new ChatController_1.default(service);
        this.router = (0, ChatRouter_1.default)(this.controller);
    }
}
exports.default = ChatContainer;
