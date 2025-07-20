"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Define the Zod Schema for Debt Payments DTO
const debtPaymentDTOSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    debtId: zod_1.z.string({ required_error: 'Debt ID is required' }),
    amountPaid: zod_1.z.number()
        .min(0.01, 'Amount paid must be greater than zero'),
    principalAmount: zod_1.z.number()
        .min(0, 'Principal amount cannot be negative'),
    interestAmount: zod_1.z.number()
        .min(0, 'Interest amount cannot be negative'),
    paymentDate: zod_1.z.date().optional().default(new Date()),
    isLate: zod_1.z.boolean().default(false)
});
// Export the schema for reuse in other parts of the application
exports.default = debtPaymentDTOSchema;
