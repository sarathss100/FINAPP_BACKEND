
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

export interface TransactionPayload {
    user_id: string;
    account_id: string;
    transaction_type: 'INCOME' | 'EXPENSE';
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
    related_account_id?: string;
    transactionHash: string;
    isDeleted: boolean;
    linked_entities?: Array<{
        entity_id: string;
        entity_type: 'GOAL' | 'DEBT' | 'INVESTMENT' | 'INSURANCE' | 'LOAN' | 'CREDIT_CARD' | 'SAVINGS_ACCOUNT' | 'MORTGAGE' | 'OTHER';
        amount: number;
        currency: string;
    }>;
};


