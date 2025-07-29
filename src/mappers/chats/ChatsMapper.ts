import { Types } from 'mongoose';
import IChatDocument from '../../model/chats/interfaces/IChat';
import ChatDTO from '../../dtos/chats/chatDTO';

export default class ChatMapper {
  // Convert Mongo document to ChatDTO
  static toDTO(data: IChatDocument): ChatDTO {
    const dto: ChatDTO = {
      _id: data._id.toString(),
      userId: data.userId?.toString(),
      role: data.role,
      message: data.message,
      timestamp: data.timestamp,
    };

    return dto;
  }

  // Convert list of Mongo documents to DTOs
  static toDTOs(data: IChatDocument[]): ChatDTO[] {
    return data.map((item) => this.toDTO(item));
  }

  // Convert ChatDTO to Mongoose model shape (Partial for create/update)
  static toModel(dto: ChatDTO): Partial<IChatDocument> {
    const model: Partial<IChatDocument> = {
      role: dto.role,
      message: dto.message,
      timestamp: dto.timestamp,
    };

    if (dto._id) {
      model._id = new Types.ObjectId(dto._id);
    }

    if (dto.userId) {
      model.userId = dto.userId;
    }

    return model;
  }
}
