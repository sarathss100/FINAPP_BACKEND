import { z } from 'zod';

export const accountDTOSchema = z.object({
    _id: z.string().optional(),
    user_id: z.string().optional(),
    account_name: z.string().min(2, 'Account name must be at least 2 characters'),
    currency: z.enum(['INR']).default('INR'),
    description: z.string().optional(),
    is_active: z.boolean().default(true),
    created_by: z.string().optional(),
    last_updated_by: z.string().optional(),

    // Discriminator Field
    account_type: z.enum(['Bank', 'Debt', 'Investment', 'Cash']).optional(),

    // Bank Account fields
    current_balance: z.number().min(0, 'Balance cannot be negative').optional(),
    institution: z.string().optional(),
    account_number: z.string().optional(),
    account_subtype: z.enum(['Current', 'Savings', 'FD', 'RD']).optional(),

    // Debt Account Fields 
    loan_type: z.enum([
        'Mortgage',
        'Student',
        'Personal',
        'Auto',
        'Credit Card'
    ]).optional(),
    interest_rate: z.number().min(0).max(100).optional(),
    monthly_payment: z.number().min(0).optional(),
    due_date: z.string().datetime({ offset: true }).transform(value => new Date(value)).optional(),
    term_months: z.number().min(0).optional(),

    // Investment Account Fields 
    investment_platform: z.string().optional(),
    portfolio_value: z.number().min(0).optional(),

    // Liquid Cash Account Fields
    location: z.enum(['Home', 'Safe', 'Wallet', 'Office']).optional(),
});

export type IAccountDTO = z.infer<typeof accountDTOSchema>;
