import { Types } from 'mongoose';
import INotificationDTO from '../../dtos/notification/NotificationDto';
import INotificationDocument from '../../model/notification/interfaces/INotificaiton';

export default class NotificationMapper {
  // Convert Mongo document to DTO
  static toDTO(data: INotificationDocument): INotificationDTO {
    return {
      _id: data._id.toString(),
      user_id: data.user_id?.toString(),
      title: data.title,
      message: data.message,
      type: data.type,
      is_read: data.is_read,
      meta: data.meta,
      archived: data.archived,
      createdAt: data.createdAt,
    };
  }

  // Convert list of Mongo documents to DTOs
  static toDTOs(data: INotificationDocument[]): INotificationDTO[] {
    return data.map((item) => this.toDTO(item));
  }

  // Convert DTO to Mongoose model shape (Partial for create/update)
  static toModel(dto: INotificationDTO): Partial<INotificationDocument> {
    const model: Partial<INotificationDocument> = {
      user_id: dto.user_id || '',
      title: dto.title,
      message: dto.message,
      type: dto.type,
      is_read: dto.is_read,
      meta: dto.meta,
      archived: dto.archived,
    };

    if (dto._id) {
      model._id = new Types.ObjectId(dto._id);
    }

    return model;
  }
}
