import { Types } from 'mongoose';
import { IDebtDocument } from '../../model/debt/interfaces/IDebt';
import IDebtDTO from '../../dtos/debt/DebtDTO';

export default class DebtMapper {
  // Convert Mongo document to DTO
  static toDTO(data: IDebtDocument): IDebtDTO {
    return {
      _id: data._id.toString(),
      userId: data.userId?.toString(),
      accountId: data.accountId?.toString() || null,
      debtName: data.debtName,
      initialAmount: data.initialAmount,
      currency: data.currency,
      interestRate: data.interestRate,
      interestType: data.interestType,
      tenureMonths: data.tenureMonths,
      monthlyPayment: data.monthlyPayment,
      monthlyPrincipalPayment: data.monthlyPrincipalPayment,
      montlyInterestPayment: data.montlyInterestPayment,
      startDate: data.startDate,
      nextDueDate: data.nextDueDate,
      endDate: data.endDate,
      status: data.status,
      currentBalance: data.currentBalance,
      totalInterestPaid: data.totalInterestPaid,
      totalPrincipalPaid: data.totalPrincipalPaid,
      additionalCharges: data.additionalCharges,
      notes: data.notes,
      isDeleted: data.isDeleted,
      isGoodDebt: data.isGoodDebt,
      isCompleted: data.isCompleted,
      isExpired: data.isExpired,
    };
  }

  // Convert list of Mongo documents to DTOs
  static toDTOs(data: IDebtDocument[]): IDebtDTO[] {
    return data.map((item) => this.toDTO(item));
  }

  // Convert DTO to Mongoose model shape (Partial for create/update)
  static toModel(dto: IDebtDTO): Partial<IDebtDocument> {
    const model: Partial<IDebtDocument> = {
      debtName: dto.debtName,
      initialAmount: dto.initialAmount,
      currency: dto.currency,
      interestRate: dto.interestRate,
      interestType: dto.interestType,
      tenureMonths: dto.tenureMonths,
      monthlyPayment: dto.monthlyPayment,
      monthlyPrincipalPayment: dto.monthlyPrincipalPayment,
      montlyInterestPayment: dto.montlyInterestPayment,
      startDate: dto.startDate,
      nextDueDate: dto.nextDueDate,
      endDate: dto.endDate,
      status: dto.status,
      currentBalance: dto.currentBalance,
      totalInterestPaid: dto.totalInterestPaid,
      totalPrincipalPaid: dto.totalPrincipalPaid,
      additionalCharges: dto.additionalCharges,
      notes: dto.notes,
      isDeleted: dto.isDeleted,
      isGoodDebt: dto.isGoodDebt,
      isCompleted: dto.isCompleted,
      isExpired: dto.isExpired,
    };

    if (dto._id) {
      model._id = new Types.ObjectId(dto._id);
    }

    if (dto.userId) {
      model.userId = dto.userId
    }

    if (dto.accountId) {
      model.accountId = dto.accountId;
    } else if (dto.accountId === null) {
      model.accountId = null;
    }

    return model;
  }
}
