"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Define the Zod Schema for Entity DTO 
const LinkedEntityDTO = zod_1.z.object({
    entity_id: zod_1.z.string().min(1, 'Entity ID is required.').optional(),
    entity_type: zod_1.z.enum(['GOAL', 'DEBT', 'INVESTMENT', 'INSURANCE', 'TAX_GROUP', 'LOAN', 'CREDIT_CARD', 'SAVINGS_ACCOUNT', 'CHECKING_ACCOUNT', 'MORTGAGE', 'OTHER']).optional(),
    amount: zod_1.z.number().min(0, 'Amount must be non-negative.').optional(),
    currency: zod_1.z.enum(['INR']).default('INR').optional(),
});
// Define the Zod Schema for Transaction DTO
const transactionDTOSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    user_id: zod_1.z.string().optional(),
    account_id: zod_1.z.string().min(1, 'Account ID is required'),
    transaction_type: zod_1.z.enum(['INCOME', 'EXPENSE']),
    type: zod_1.z.enum(['REGULAR', 'TRANSFER', 'PAYMENT', 'ADJUSTMENT', 'FEE', 'REFUND', 'DEPOSIT', 'WITHDRAWAL', 'INTEREST', 'DIVIDEND', 'REWARD', 'BONUS', 'CASHBACK', 'REDEMPTION', 'CONVERSION', 'EXCHANGE', 'LOAN', 'BORROWING', 'LENDING', 'INVESTMENT', 'PURCHASE', 'SALE', 'EXTRACTION', 'INCOME', 'EXPENSE', 'RENT', 'ENTERTAINMENT', 'EDUCATION', 'BILLS', 'SUBSCRIPTIONS', 'TRAVEL']),
    category: zod_1.z.enum(['FOOD', 'TRANSPORT', 'ENTERTAINMENT', 'HEALTH', 'EDUCATION', 'SHOPPING', 'TRAVEL', 'BILLS', 'SUBSCRIPTIONS', 'GIFTS', 'SAVINGS', 'INVESTMENTS', 'MISCELLANEOUS', 'RENT']),
    amount: zod_1.z.number().min(0, 'Amount must be non-negative.'),
    credit_amount: zod_1.z.number().min(0, `Amount must be non-negative`).optional(),
    debit_amount: zod_1.z.number().min(0, 'Amount must be non-negative').optional(),
    closing_balance: zod_1.z.number().min(0, 'Amount must be non-negative').optional(),
    currency: zod_1.z.enum(['USD', 'EUR', 'INR', 'GBP']).default('INR'),
    date: zod_1.z.string().default(() => new Date().toISOString()).transform((val) => new Date(val)),
    description: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    status: zod_1.z.enum(['PENDING', 'COMPLETED', 'FAILED']).default('PENDING'),
    related_account_id: zod_1.z.string().optional(),
    transactionHash: zod_1.z.string().optional(),
    linked_entities: zod_1.z.array(LinkedEntityDTO).default([]).optional(),
    isDeleted: zod_1.z.boolean().default(false),
    deletedAt: zod_1.z.date().optional(),
    createdAt: zod_1.z.string().default(() => new Date().toISOString()).transform((val) => new Date(val)).optional(),
    updatedAt: zod_1.z.string().default(() => new Date().toISOString()).transform((val) => new Date(val)).optional(),
});
// Export the schema for reuse in other parts of the application
exports.default = transactionDTOSchema;
