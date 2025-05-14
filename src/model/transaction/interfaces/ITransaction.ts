import { Document, Types } from 'mongoose';

// Predefined enums
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
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];

interface ITransaction extends Document {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    account_id: Types.ObjectId;
    transaction_type: 'INCOME' | 'EXPENSE',
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
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
    linked_entities?: Array<{
        entity_id: Types.ObjectId;
        entity_type: 'GOAL' | 'DEBT' | 'INVESTMENT' | 'INSURANCE' | 'LOAN' | 'CREDIT_CARD' | 'SAVINGS_ACCOUNT' | 'MORTGAGE' | 'OTHER';
        amount: number;
        currency: string;
    }>;
}

export default ITransaction;
