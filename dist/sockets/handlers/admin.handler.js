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
const ChatService_1 = __importDefault(require("services/chats/ChatService"));
const chatService = ChatService_1.default.instance;
const registerAdminHandlers = (socket, io) => {
    const adminId = socket.data.userId;
    try {
        if (!socket.rooms.has('admin')) {
            socket.join('admin');
            console.log(`Admin ${adminId} connected`);
        }
        // Send all chat history to admin on connection
        const sendChatHistoryToAdmin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const history = userId
                    ? yield chatService.getChatHistory(userId)
                    : yield chatService.getAllChatSessions();
                const event = userId ? 'user_chat_history' : 'get_all_chats';
                socket.emit(event, userId ? { userId, history } : history);
            }
            catch (error) {
                console.error(`Failed to load chat history:`, error);
                socket.emit('error', 'Failed to load chat history');
            }
        });
        const initializeAdminData = () => __awaiter(void 0, void 0, void 0, function* () {
            yield sendChatHistoryToAdmin();
        });
        initializeAdminData().catch(err => {
            console.error('Error initializing admin data:', err);
        });
        socket.on("join_user_room", (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
            const room = `chat_${userId}`;
            socket.join(room);
            console.log(`Admin joined user room: ${userId}`);
            const chatNamespace = io.of('/chat');
            const roomSet = chatNamespace.adapter.rooms.get(room) || new Set();
            roomSet.add(socket.id);
            chatNamespace.adapter.rooms.set(room, roomSet);
            yield sendChatHistoryToAdmin(userId);
        }));
        socket.on("admin_message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ message, userId }) {
            if (!message || !userId) {
                socket.emit('error', 'Missing message or user ID');
                return;
            }
            const room = `user_${userId}`;
            const msg = {
                id: Date.now().toString(),
                message,
                sender: "admin",
            };
            try {
                yield chatService.createChat(userId, 'admin', message);
                // Send admin message to the specific user
                io.of('/chat').to(room).emit("admin_message", msg);
                // Also notify admin about successful message send
                socket.emit("message_sent", { userId, message });
            }
            catch (error) {
                console.error(`Failed to send message to user ${userId}:`, error);
                socket.emit("error", "Failed to send message");
            }
        }));
        // Handle typing indicators for admin
        socket.on("admin_typing", ({ userId }) => {
            if (userId) {
                io.to(`chat_${userId}`).emit("admin_typing");
            }
        });
        socket.on("admin_stop_typing", ({ userId }) => {
            if (userId) {
                io.to(`chat_${userId}`).emit("admin_stop_typing");
            }
        });
        socket.on("disconnect", () => {
            console.log(`Admin ${adminId} disconnected`);
        });
    }
    catch (err) {
        console.error("Admin socket auth failed:", err);
        socket.emit("auth_error", "Invalid or missing token");
        socket.disconnect();
    }
};
exports.default = registerAdminHandlers;
