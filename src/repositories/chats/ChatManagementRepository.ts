import ChatModel from "../../model/chats/model/ChatModel";
import IChatRepository from "./interfaces/IChatRepository";
import { ChatDTO } from "../../dtos/chats/chatDTO";

/**
 * @class ChatManagementRepository
 * @description Repository class responsible for handling database operations related to chats.
 */
class ChatManagementRepository implements IChatRepository {
    private static _instance: ChatManagementRepository;

    /**
     * Private constructor to enforce singleton pattern.
     */
    public constructor() {}

    /**
     * Gets the singleton instance of ChatManagementRepository.
     *
     * @returns {ChatManagementRepository}
     */
    public static get instance(): ChatManagementRepository {
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
    async createChat(userId: string, role: 'user' | 'admin', message: string): Promise<void> {
        try {
            await ChatModel.create({ userId, role, message });
        } catch (error) {
            console.error('Error creating chat:', error);
            throw new Error(`Failed to create chat: ${(error as Error).message}`);
        }
    }

    async getHistory(userId: string): Promise<ChatDTO[]> {
        try {
            const response = await ChatModel.find({ userId }).sort({ timestamp: 1 }).lean();
            
            return response.map(doc => ({
                _id: doc._id.toString(),
                userId: doc.userId,
                role: doc.role,
                message: doc.message,
                timestamp: doc.timestamp,
            }));
        } catch (error) {
            console.error('Error creating chat:', error);
            throw new Error(`Failed to create chat: ${(error as Error).message}`);
        }
    }

    async getAllChatSessions(): Promise<
  { userId: string; chats: ChatDTO[] }[]
> {
  try {
    const sessions = await ChatModel.aggregate([
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
      chats: session.chats.map((chat: { _id: string; userId: string, role: string; message: string; timestamp: Date }) => ({
        _id: chat._id?.toString() || '',
        userId: chat.userId,
        role: chat.role,
        message: chat.message,
        timestamp: chat.timestamp
      }))
    }));

    return formatted;
  } catch (error) {
    console.error("Error getting all chat histories:", error);
    throw new Error("Failed to get all chat histories");
  }
}


}

export default ChatManagementRepository;
