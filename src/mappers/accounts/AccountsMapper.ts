import { Types } from 'mongoose';
import { IAccountDTO } from '../../dtos/accounts/AccountsDTO'; 
import IAccountDocument from '../../model/accounts/interfaces/IAccounts';

export default class AccountMapper {
  // Maps IAccountModel to IAccountDTO
  static toDTO(account: IAccountDocument): IAccountDTO {
    if (!account._id) {
      throw new Error('Invalid account: missing _id');
    }
    if (!account.account_name) {
      throw new Error('Invalid account: missing account_name');
    }

    const dto: IAccountDTO = {
      _id: account._id.toString(),
      user_id: account.user_id?.toString(),
      account_name: account.account_name,
      currency: account.currency,
      description: account.description,
      is_active: account.is_active,
      created_by: account.created_by?.toString(),
      last_updated_by: account.last_updated_by?.toString(),
      account_type: account.account_type,
    };

    // Include type-specific fields based on account_type
    switch (account.account_type) {
      case 'Bank':
        dto.current_balance = account.current_balance;
        dto.institution = account.institution;
        dto.account_number = account.account_number;
        dto.account_subtype = account.account_subtype;
        break;
      case 'Debt':
        dto.loan_type = account.loan_type;
        dto.interest_rate = account.interest_rate;
        dto.monthly_payment = account.monthly_payment;
        dto.due_date = account.due_date;
        dto.term_months = account.term_months;
        break;
      case 'Investment':
        dto.investment_platform = account.investment_platform;
        dto.portfolio_value = account.portfolio_value;
        break;
      case 'Cash':
        dto.location = account.location;
        break;
    }

    return dto;
  }

  // Maps an array of IAccountModel to an array of IAccountDTO
  static toDTOs(accounts: IAccountDocument[]): IAccountDTO[] {
    return accounts.map((account) => this.toDTO(account));
  }

  // Maps IAccountDTO to IAccountModel-compatible format
  static toModel(dto: IAccountDTO): Partial<IAccountDocument> {
    if (!dto.account_name) {
      throw new Error('Account name is required');
    }
    if (!dto.account_type) {
      throw new Error('Account type is required');
    }

    const model: Partial<IAccountDocument> = {
      user_id: new Types.ObjectId(dto.user_id),
      account_name: dto.account_name,
      currency: dto.currency,
      description: dto.description,
      is_active: dto.is_active ?? true,
      created_by: new Types.ObjectId(dto.created_by),
      last_updated_by: new Types.ObjectId(dto.last_updated_by),
      account_type: dto.account_type,
    };

    // Validate and include type-specific fields based on account_type
    switch (dto.account_type) {
      case 'Bank':
        if (dto.current_balance === undefined || !dto.institution || !dto.account_number) {
          throw new Error('Bank account requires current_balance, institution, and account_number');
        }
        model.current_balance = dto.current_balance;
        model.institution = dto.institution;
        model.account_number = dto.account_number;
        model.account_subtype = dto.account_subtype;
        break;
      case 'Debt':
        if (!dto.loan_type || dto.interest_rate === undefined || dto.monthly_payment === undefined) {
          throw new Error('Debt account requires loan_type, interest_rate, and monthly_payment');
        }
        model.loan_type = dto.loan_type;
        model.interest_rate = dto.interest_rate;
        model.monthly_payment = dto.monthly_payment;
        model.due_date = dto.due_date;
        model.term_months = dto.term_months;
        break;
      case 'Investment':
        if (!dto.investment_platform || dto.portfolio_value === undefined) {
          throw new Error('Investment account requires investment_platform and portfolio_value');
        }
        model.investment_platform = dto.investment_platform;
        model.portfolio_value = dto.portfolio_value;
        break;
      case 'Cash':
        if (!dto.location) {
          throw new Error('Cash account requires location');
        }
        model.location = dto.location;
        break;
      default:
        throw new Error(`Invalid account_type: ${dto.account_type}`);
    }

    return model;
  }
}