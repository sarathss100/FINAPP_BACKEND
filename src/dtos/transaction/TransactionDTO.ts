
export interface ILinkedEntityDTO {
  entity_id?: string;
  entity_type?: 'GOAL' | 'DEBT' | 'INVESTMENT' | 'INSURANCE' | 'TAX_GROUP' | 'LOAN' | 'CREDIT_CARD' | 'SAVINGS_ACCOUNT' | 'CHECKING_ACCOUNT' | 'MORTGAGE' | 'OTHER';
  amount?: number;
  currency?: 'INR';
}

export default interface ITransactionDTO {
    _id?: string,
    user_id?: string,
    account_id: string,
    transaction_type: 'INCOME' | 'EXPENSE',
    type: 'REGULAR' | 'TRANSFER' | 'PAYMENT' | 'ADJUSTMENT' | 'FEE' | 'REFUND' | 'DEPOSIT' | 'WITHDRAWAL' | 'INTEREST' | 'DIVIDEND' | 'REWARD' | 'BONUS' | 'CASHBACK' | 'REDEMPTION' | 'CONVERSION' | 'EXCHANGE' | 'LOAN' | 'BORROWING' | 'LENDING' | 'INVESTMENT' | 'PURCHASE' | 'SALE' | 'EXTRACTION' | 'INCOME' | 'EXPENSE' | 'RENT' | 'ENTERTAINMENT' | 'EDUCATION' | 'BILLS' | 'SUBSCRIPTIONS' | 'TRAVEL',
    category: 'FOOD' | 'TRANSPORT' | 'ENTERTAINMENT' | 'HEALTH' | 'EDUCATION' | 'SHOPPING' | 'TRAVEL' | 'BILLS' | 'SUBSCRIPTIONS' | 'GIFTS' | 'SAVINGS' | 'INVESTMENTS' | 'MISCELLANEOUS' | 'RENT',
    amount: number,
    credit_amount?: number,
    debit_amount?: number,
    closing_balance?: number,
    currency: 'USD' | 'EUR' | 'INR' | 'GBP',
    date: Date,
    description?: string,
    tags?: string[],
    status: 'PENDING' | 'COMPLETED' | 'FAILED',
    related_account_id?: string,   
    transactionHash?: string,
    linked_entities?: ILinkedEntityDTO[],
    isDeleted: boolean,
    deletedAt?: Date,
    createdAt?: Date,
    updatedAt?: Date,
};

export interface IParsedTransactionDTO {
    date: Date | null;
    description: string;
    transaction_id: string;
    debit_amount?: number;
    credit_amount?: number;
    transaction_type: 'income' | 'expense' | 'unknown';
    amount: number;
    closing_balance: number | null;
}
