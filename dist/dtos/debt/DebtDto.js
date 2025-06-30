"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Define the Zod Schema for Debt DTO
const debtDTOSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    userId: zod_1.z.string().min(1, 'User ID is required').optional(),
    accountId: zod_1.z.string().nullable().optional(),
    debtName: zod_1.z.string()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters'),
    initialAmount: zod_1.z.number()
        .min(0, 'Initial amount cannot be negative')
        .refine(val => val !== null && val !== undefined, {
        message: 'Initial amount is required'
    }),
    currency: zod_1.z.string().default('INR'),
    interestRate: zod_1.z.number().default(0),
    interestType: zod_1.z.enum(['Flat', 'Diminishing']).default('Diminishing'),
    tenureMonths: zod_1.z.number()
        .int()
        .min(1, 'Tenure must be at least 1 month')
        .refine(val => val !== null && val !== undefined, {
        message: 'Tenure in months is required'
    }),
    monthlyPayment: zod_1.z.number()
        .min(0, 'Monthly payment cannot be negative')
        .refine(val => val !== null && val !== undefined, {
        message: 'Monthly payment is required'
    }).optional(),
    monthlyPrincipalPayment: zod_1.z.number().default(0).optional(),
    montlyInterestPayment: zod_1.z.number().default(0).optional(),
    startDate: zod_1.z.coerce.date().optional().default(new Date()),
    nextDueDate: zod_1.z.coerce.date().optional().default(() => {
        const now = new Date();
        return new Date(now.setMonth(now.getMonth() + 1));
    }),
    endDate: zod_1.z.coerce.date().optional(),
    status: zod_1.z.enum(['Active', 'Paid', 'Cancelled', 'Overdue']).default('Active'),
    currentBalance: zod_1.z.number()
        .min(0, 'Current balance cannot be negative')
        .refine(val => val !== null && val !== undefined, {
        message: 'Current balance is required'
    }).optional(),
    totalInterestPaid: zod_1.z.number().default(0),
    totalPrincipalPaid: zod_1.z.number().default(0),
    additionalCharges: zod_1.z.number().default(0),
    notes: zod_1.z.string()
        .max(500, 'Notes cannot exceed 500 characters')
        .optional()
        .default(''),
    isDeleted: zod_1.z.boolean().default(false),
    isGoodDebt: zod_1.z.boolean().default(false),
    isCompleted: zod_1.z.boolean().default(false),
    isExpired: zod_1.z.boolean().default(false),
});
// Export the schema for reuse in other parts of the application
exports.default = debtDTOSchema;
