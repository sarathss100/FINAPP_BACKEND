import IChatDTO from "../../dtos/chats/chatDTO";
import IChatDocument from "../../model/chats/interfaces/IChat";
import ChatModel from "../../model/chats/model/ChatModel";
import BaseRepository from "../base_repo/BaseRepository";
import IBaseRepository from "../base_repo/interface/IBaseRepository";
import IChatRepository from "./interfaces/IChatRepository";

export default class ChatRepository implements IChatRepository {
  private static _instance: ChatRepository;
  private baseRepo: IBaseRepository<IChatDocument> = new BaseRepository<IChatDocument>(ChatModel);

  public constructor() {}

  public static get instance(): ChatRepository {
    if (!ChatRepository._instance) {
      ChatRepository._instance = new ChatRepository();
    }
    return ChatRepository._instance;
  }

  async createChat(userId: string, role: 'user' | 'admin', message: string): Promise<void> {
    try {
      await this.baseRepo.create({ userId, role, message });
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getHistory(userId: string): Promise<IChatDocument[]> {
    try {
      const result = await ChatModel.find({ userId }).sort({ timestamp: 1 }).lean();
        
      return result;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getAllChatSessions(): Promise<{ userId: string; chats: IChatDTO[] }[]> {
    try {
      const sessions = await ChatModel.aggregate([
        {
          $sort: { timestamp: 1 }
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
      return sessions;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
