import { Types } from 'mongoose';
import IInsuranceDocument from '../../model/insurances/interfaces/IInsurance';
import InsuranceDTO from '../../dtos/insurances/insuranceDTO';

export default class InsuranceMapper {
  // Convert Mongo document to DTO
  static toDTO(data: IInsuranceDocument): InsuranceDTO {
    return {
      _id: data._id.toString(),
      userId: data.userId?.toString(),
      type: data.type,
      coverage: data.coverage,
      premium: data.premium,
      next_payment_date: data.next_payment_date,
      payment_status: data.payment_status,
      status: data.status,
    };
  }

  // Convert list of Mongo documents to DTOs
  static toDTOs(data: IInsuranceDocument[]): InsuranceDTO[] {
    return data.map(item => this.toDTO(item));
  }

  // Convert DTO to Mongoose model shape (Partial for create/update)
  static toModel(dto: InsuranceDTO): Partial<IInsuranceDocument> {
    const model: Partial<IInsuranceDocument> = {
      type: dto.type,
      coverage: dto.coverage,
      premium: dto.premium,
      next_payment_date: dto.next_payment_date,
      payment_status: dto.payment_status,
      status: dto.status ?? 'Active',
    };

    if (dto._id) model._id = new Types.ObjectId(dto._id);
    if (dto.userId) model.userId = new Types.ObjectId(dto.userId);

    return model;
  }
}
