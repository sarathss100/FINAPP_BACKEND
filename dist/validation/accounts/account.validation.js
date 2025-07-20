"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const accountValidationSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    user_id: zod_1.z.string().optional(),
    account_name: zod_1.z.string().min(2, 'Account name must be at least 2 characters'),
    currency: zod_1.z.enum(['INR']).default('INR'),
    description: zod_1.z.string().optional(),
    is_active: zod_1.z.boolean().default(true),
    created_by: zod_1.z.string().optional(),
    last_updated_by: zod_1.z.string().optional(),
    // Discriminator Field
    account_type: zod_1.z.enum(['Bank', 'Debt', 'Investment', 'Cash']).optional(),
    // Bank Account fields
    current_balance: zod_1.z.number().min(0, 'Balance cannot be negative').optional(),
    institution: zod_1.z.string().optional(),
    account_number: zod_1.z.string().optional(),
    account_subtype: zod_1.z.enum(['Current', 'Savings', 'FD', 'RD']).optional(),
    // Debt Account Fields 
    loan_type: zod_1.z.enum([
        'Mortgage',
        'Student',
        'Personal',
        'Auto',
        'Credit Card'
    ]).optional(),
    interest_rate: zod_1.z.number().min(0).max(100).optional(),
    monthly_payment: zod_1.z.number().min(0).optional(),
    due_date: zod_1.z.string().datetime({ offset: true }).transform(value => new Date(value)).optional(),
    term_months: zod_1.z.number().min(0).optional(),
    // Investment Account Fields 
    investment_platform: zod_1.z.string().optional(),
    portfolio_value: zod_1.z.number().min(0).optional(),
    // Liquid Cash Account Fields
    location: zod_1.z.enum(['Home', 'Safe', 'Wallet', 'Office']).optional(),
});
exports.default = accountValidationSchema;
