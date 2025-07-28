import { Document, Types } from 'mongoose';

export default interface IAccountDocument extends Document {
    _id: string | Types.ObjectId;
    user_id?: Types.ObjectId;
    account_name: string;
    currency: 'INR';
    description?: string;
    is_active: boolean;
    created_by: Types.ObjectId;
    last_updated_by?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;

    // Discriminator Field
    account_type?: 'Bank' | 'Debt' | 'Investment' | 'Cash';

    // Bank Account Fields
    current_balance?: number;
    institution?: string;
    account_number?: string;
    account_subtype?: 'Current' | 'Savings' | 'FD' | 'RD';

    // Debt Account Fields
    loan_type?: 'Mortgage' | 'Student' | 'Personal' | 'Auto' | 'Credit Card';
    interest_rate?: number;
    monthly_payment?: number;
    due_date?: Date;
    term_months?: number;

    // Investment Account Fields
    investment_platform?: string;
    portfolio_value?: number;

    // Liquid Cash Account Fields
    location?: 'Home' | 'Safe' | 'Wallet' | 'Office';
    __v?: number
}
