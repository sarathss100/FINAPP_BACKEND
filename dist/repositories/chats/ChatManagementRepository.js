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
const ChatModel_1 = __importDefault(require("model/chats/model/ChatModel"));
/**
 * @class ChatManagementRepository
 * @description Repository class responsible for handling database operations related to chats.
 */
class ChatManagementRepository {
    /**
     * Private constructor to enforce singleton pattern.
     */
    constructor() { }
    /**
     * Gets the singleton instance of ChatManagementRepository.
     *
     * @returns {ChatManagementRepository}
     */
    static get instance() {
        if (!ChatManagementRepository._instance) {
            ChatManagementRepository._instance = new ChatManagementRepository();
        }
        return ChatManagementRepository._instance;
    }
    /**
     * Creates a new chat record in the database.
     *
     * @param {IChatDTO} chatData - The validated chat data from the frontend.
     * @param {string} userId - The ID of the user creating the chat (as a string).
     * @returns {Promise<IChatDTO>} - A promise resolving to the created chat data.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    createChat(userId, role, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ChatModel_1.default.create({ userId, role, message });
            }
            catch (error) {
                console.error('Error creating chat:', error);
                throw new Error(`Failed to create chat: ${error.message}`);
            }
        });
    }
    getHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield ChatModel_1.default.find({ userId }).sort({ timestamp: 1 }).lean();
                return response.map(doc => ({
                    _id: doc._id.toString(),
                    userId: doc.userId,
                    role: doc.role,
                    message: doc.message,
                    timestamp: doc.timestamp,
                }));
            }
            catch (error) {
                console.error('Error creating chat:', error);
                throw new Error(`Failed to create chat: ${error.message}`);
            }
        });
    }
    getAllChatSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessions = yield ChatModel_1.default.aggregate([
                    {
                        $sort: { timestamp: 1 } // sort chronologically within each user
                    },
                    {
                        $group: {
                            _id: "$userId",
                            chats: {
                                $push: {
                                    _id: "$_id",
                                    role: "$role",
                                    message: "$message",
                                    timestamp: "$timestamp"
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            userId: "$_id",
                            chats: 1,
                            _id: 0
                        }
                    }
                ]);
                // Format _id to string in each chat
                const formatted = sessions.map(session => ({
                    userId: session.userId,
                    chats: session.chats.map((chat) => {
                        var _a;
                        return ({
                            _id: ((_a = chat._id) === null || _a === void 0 ? void 0 : _a.toString()) || '',
                            userId: chat.userId,
                            role: chat.role,
                            message: chat.message,
                            timestamp: chat.timestamp
                        });
                    })
                }));
                return formatted;
            }
            catch (error) {
                console.error("Error getting all chat histories:", error);
                throw new Error("Failed to get all chat histories");
            }
        });
    }
}
exports.default = ChatManagementRepository;
