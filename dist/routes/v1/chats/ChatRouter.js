"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ChatManagementRepository_1 = __importDefault(require("repositories/chats/ChatManagementRepository"));
const ChatService_1 = __importDefault(require("services/chats/ChatService"));
const ChatController_1 = __importDefault(require("controller/chats/ChatController"));
const router = (0, express_1.Router)();
const chatRepository = new ChatManagementRepository_1.default();
const chatService = new ChatService_1.default(chatRepository);
const chatController = new ChatController_1.default(chatService);
router.post('/', chatController.createChat.bind(chatController));
router.get('/token', chatController.getAccessToken.bind(chatController));
exports.default = router;
