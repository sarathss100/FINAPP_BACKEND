import { Types } from 'mongoose';
import ISubscriptionDocument from '../../model/subscription/interfaces/ISubscription';
import { SubscriptionDTO } from '../../dtos/subscriptions/subscriptionDTO';

export default class SubscriptionMapper {
  // Convert Mongo document to DTO
  static toDTO(data: ISubscriptionDocument): SubscriptionDTO {
    return {
      _id: data._id.toString(),
      user_id: data.user_id.toString(),
      plan_name: data.plan_name,
      plan_type: data.plan_type,
      payment_date: data.payment_date,
      expiry_date: data.expiry_date,
      amount: data.amount,
      currency: data.currency,
      subscription_mode: data.subscription_mode,
      status: data.status,
      payment_method: data.payment_method,
      transaction_id: data.transaction_id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  // Convert list of Mongo documents to DTOs
  static toDTOs(data: ISubscriptionDocument[]): SubscriptionDTO[] {
    return data.map((item) => this.toDTO(item));
  }

  // Convert DTO to Mongoose model shape (Partial for create/update)
  static toModel(dto: SubscriptionDTO): Partial<ISubscriptionDocument> {
    const model: Partial<ISubscriptionDocument> = {
      user_id: new Types.ObjectId(dto.user_id),
      plan_name: dto.plan_name,
      plan_type: dto.plan_type,
      payment_date: dto.payment_date,
      expiry_date: dto.expiry_date,
      amount: dto.amount,
      currency: dto.currency,
      subscription_mode: dto.subscription_mode,
      status: dto.status,
      payment_method: dto.payment_method,
      transaction_id: dto.transaction_id,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };

    if (dto._id) {
      model._id = new Types.ObjectId(dto._id);
    }

    return model;
  }
}
