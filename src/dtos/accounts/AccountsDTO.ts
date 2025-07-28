type Currency = 'INR';

type AccountType = 'Bank' | 'Debt' | 'Investment' | 'Cash';

type AccountSubtype = 'Current' | 'Savings' | 'FD' | 'RD';

type LoanType =
    | 'Mortgage'
    | 'Student'
    | 'Personal'
    | 'Auto'
    | 'Credit Card';

type LocationType = 'Home' | 'Safe' | 'Wallet' | 'Office';

export interface IAccountDTO {
    _id?: string;
    user_id?: string;
    account_name?: string;
    currency?: Currency;
    description?: string;
    is_active?: boolean;
    created_by?: string;
    last_updated_by?: string;

    // Discriminator Field
    account_type?: AccountType;

    // Bank Account fields
    current_balance?: number;
    institution?: string;
    account_number?: string;
    account_subtype?: AccountSubtype;

    // Debt Account Fields
    loan_type?: LoanType;
    interest_rate?: number;
    monthly_payment?: number;
    due_date?: Date;
    term_months?: number;

    // Investment Account Fields
    investment_platform?: string;
    portfolio_value?: number;

    // Liquid Cash Account Fields
    location?: LocationType;
}