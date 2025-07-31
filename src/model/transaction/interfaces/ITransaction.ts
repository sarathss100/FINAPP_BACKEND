import { Document, Types } from 'mongoose';

export const TRANSACTION_TYPES = [
    'REGULAR',
    'TRANSFER',
    'PAYMENT',
    'ADJUSTMENT',
    'FEE',
    'REFUND',
    'DEPOSIT',
    'WITHDRAWAL',
    'INTEREST',
    'DIVIDEND',
    'REWARD',
    'BONUS',
    'CASHBACK',
    'REDEMPTION',
    'CONVERSION',
    'EXCHANGE',
    'LOAN',
    'BORROWING',
    'LENDING',
    'INVESTMENT',
    'PURCHASE',
    'SALE',
    'EXTRACTION',
    'RENT',
    'INCOME',
    'EXPENSE',
    'ENTERTAINMENT',
    'EDUCATION',
    'BILLS',
    'SUBSCRIPTIONS',
    'TRAVEL',
] as const;

export type TransactionType = typeof TRANSACTION_TYPES[number];

export const TRANSACTION_CATEGORIES = [
    'FOOD',
    'TRANSPORT',
    'ENTERTAINMENT',
    'HEALTH',
    'EDUCATION',
    'SHOPPING',
    'TRAVEL',
    'BILLS',
    'SUBSCRIPTIONS',
    'GIFTS',
    'SAVINGS',
    'INVESTMENTS',
    'MISCELLANEOUS',
    'RENT',
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];

export const SMART_CATEGORIES = [
    'SALARY', 
    'FREELANCE',
    'BUSINESS_INCOME', 
    'INVESTMENT_RETURN',
    'DIVIDEND',
    'INTEREST',
    'RENTAL_INCOME',
    'GIFT_RECEIVED',
    'BONUS',
    'GOVERNMENT_BENEFIT',
    'REFUND',
    'OTHER_INCOME',
    'FOOD', 
    'RENT',
    'UTILITY_BILL',
    'MOBILE_RECHARGE', 
    'INTERNET_BILL',
    'TRANSPORT', 
    'SHOPPING',
    'HEALTH_MEDICAL', 
    'EDUCATION',
    'INSURANCE', 
    'LOAN_PAYMENT', 
    'EMI', 
    'TAX', 
    'SUBSCRIPTION', 
    'GROCERIES', 
    'DINING_OUT', 
    'ENTERTAINMENT', 
    'TRAVEL', 
    'PERSONAL_CARE',
    'HOME_IMPROVEMENT', 
    'VEHICLE_EXPENSE', 
    'GIFTS_DONATIONS', 
    'FEES_CHARGES',
    'MISCELLANEOUS',
    'TRANSFER',
] as const;

export default interface ITransactionDocument extends Document {
    _id: Types.ObjectId;
    user_id: string;
    account_id: Types.ObjectId;
    transaction_type: 'INCOME' | 'EXPENSE',
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    credit_amount?: number;
    debit_amount?: number;
    closing_balance?: number;
    currency: 'INR';
    date: Date;
    description: string;
    tags: string[];
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    isDeleted?: boolean;
    related_account_id?: Types.ObjectId;
    transactionHash?: string;
    linked_entities?: Array<{
        entity_id: Types.ObjectId;
        entity_type: 'GOAL' | 'DEBT' | 'INVESTMENT' | 'INSURANCE' | 'TAX_GROUP' | 'LOAN' | 'CREDIT_CARD' | 'SAVINGS_ACCOUNT' | 'CHECKING_ACCOUNT' | 'MORTGAGE' | 'OTHER';
        amount: number;
        currency: string;
    }>;
}
