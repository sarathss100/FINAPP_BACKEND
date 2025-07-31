import { Types } from 'mongoose';
import ITransactionDTO, { ILinkedEntityDTO } from '../../dtos/transaction/TransactionDTO';
import ITransactionDocument from '../../model/transaction/interfaces/ITransaction';

export default class TransactionMapper {
  // Convert MongoDB Document to DTO
  static toDTO(data: ITransactionDocument): ITransactionDTO {
    return {
      _id: data._id.toString(),
      user_id: data.user_id,
      account_id: data.account_id.toString(),
      transaction_type: data.transaction_type,
      type: data.type,
      category: data.category,
      amount: data.amount,
      credit_amount: data.credit_amount,
      debit_amount: data.debit_amount,
      closing_balance: data.closing_balance,
      currency: data.currency,
      date: data.date,
      description: data.description,
      tags: data.tags || [],
      status: data.status,
      related_account_id: data.related_account_id?.toString(),
      transactionHash: data.transactionHash,
      isDeleted: data.isDeleted ?? false,
      deletedAt: data.deletedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      linked_entities: data.linked_entities?.map((entity) => ({
        entity_id: entity.entity_id?.toString(),
        entity_type: entity.entity_type,
        amount: entity.amount,
        currency: entity.currency as 'INR',
      })) ?? [],
    };
  }

  // Convert array of documents to DTOs
  static toDTOs(data: ITransactionDocument[]): ITransactionDTO[] {
    return data.map((tx) => this.toDTO(tx));
  }

  // Convert DTO to Model Shape (Partial<ITransactionDocument>)
  static toModel(dto: Partial<ITransactionDTO>): Partial<ITransactionDocument> {
    const model: Partial<ITransactionDocument> = {
      user_id: dto.user_id,
      transaction_type: dto.transaction_type,
      type: dto.type,
      category: dto.category,
      amount: dto.amount,
      credit_amount: dto.credit_amount,
      debit_amount: dto.debit_amount,
      closing_balance: dto.closing_balance,
      currency: 'INR',
      date: dto.date,
      description: dto.description ?? '',
      tags: dto.tags || [],
      status: dto.status,
      transactionHash: dto.transactionHash,
      isDeleted: dto.isDeleted,
      deletedAt: dto.deletedAt,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };

    if (dto._id) model._id = new Types.ObjectId(dto._id);
    if (dto.account_id) model.account_id = new Types.ObjectId(dto.account_id);
    if (dto.related_account_id) model.related_account_id = new Types.ObjectId(dto.related_account_id);

    if (dto.linked_entities) {
      model.linked_entities = dto?.linked_entities?.map((entity: ILinkedEntityDTO) => ({
        entity_id: entity?.entity_id ? new Types.ObjectId(entity.entity_id) : new Types.ObjectId(),
        entity_type: entity.entity_type!,
        amount: entity.amount ?? 0,
        currency: entity.currency ?? 'INR',
      }));
    }

    return model;
  }

  // Convert array of documents to Models
  static toModels(data: Partial<ITransactionDTO>[]): Partial<ITransactionDocument>[] {
    return data.map((tx) => this.toModel(tx));
  }
}
