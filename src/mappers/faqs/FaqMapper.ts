import { Types } from 'mongoose';
import IFaqDocument from '../../model/admin/interfaces/IFaq';
import { IFaqDTO } from '../../dtos/base/IFaqDTO';

export default class FaqMapper {
  // Convert Mongo document to DTO
  static toDTO(data: IFaqDocument): IFaqDTO {
    const dto: IFaqDTO = {
      _id: data._id.toString(),
      question: data.question,
      answer: data.answer,
      isDeleted: data.isDeleted,
      isPublished: data.isPublished,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return dto;
  }

  // Convert list of Mongo documents to DTOs
  static toDTOs(data: IFaqDocument[]): IFaqDTO[] {
    return data.map((item) => this.toDTO(item));
  }

  // Convert DTO to Mongoose model shape (Partial for create/update)
  static toModel(dto: IFaqDTO): Partial<IFaqDocument> {
    const model: Partial<IFaqDocument> = {
      question: dto.question,
      answer: dto.answer,
      isDeleted: dto.isDeleted,
      isPublished: dto.isPublished,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };

    if (dto._id) {
      model._id = new Types.ObjectId(dto._id);
    }

    return model;
  }
}
