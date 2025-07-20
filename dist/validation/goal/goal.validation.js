"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Define the Zod Schema for Goal DTO
const goalDTOSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    user_id: zod_1.z.string().optional(),
    tenant_id: zod_1.z.string().optional(),
    goal_name: zod_1.z.string().min(3, 'Goal name must be at least 3 characters').max(255),
    goal_category: zod_1.z.enum(['Education', 'Retirement', 'Travel', 'Investment', 'Other']).default('Other'),
    target_amount: zod_1.z.number().min(0, 'Target amount must be non-negative.'),
    initial_investment: zod_1.z.number().min(0, 'Initial investment must be non-negative.'),
    current_amount: zod_1.z.number().min(0, 'Curent amount must be non-negative.').optional(),
    currency: zod_1.z.enum(['USD', 'EUR', 'INR', 'GBP']).default('INR'),
    target_date: zod_1.z.string().datetime({ offset: true }).transform(value => new Date(value)).refine(date => date > new Date(), { message: 'Target data must be in the future' }),
    contribution_frequency: zod_1.z.enum(['Monthly', 'Quarterly', 'Yearly']),
    priority_level: zod_1.z.enum(['Low', 'Medium', 'High']).default('Medium'),
    description: zod_1.z.string().optional(),
    reminder_frequency: zod_1.z.enum(['Daily', 'Weekly', 'Monthly', 'None']).default('None'),
    goal_type: zod_1.z.enum(['Savings', 'Investment', 'Debt Repayment', 'Other']).default('Savings'),
    tags: zod_1.z.array(zod_1.z.string().trim()).optional(),
    dependencies: zod_1.z.array(zod_1.z.string().min(1, 'Dependency ID must be valid.')).optional(),
    is_completed: zod_1.z.boolean(),
    created_by: zod_1.z.string().min(1, 'Created by user ID is required.').optional(),
    last_updated_by: zod_1.z.string().optional(),
    dailyContribution: zod_1.z.number().optional(),
    monthlyContribution: zod_1.z.number().optional(),
});
// Export the schema for reuse in other parts of the application
exports.default = goalDTOSchema;
