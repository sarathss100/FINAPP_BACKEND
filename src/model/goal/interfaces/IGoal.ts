import { Document, Types } from 'mongoose';

// Define predefined goal categories as a const array
export const PREDEFINED_GOAL_CATEGORIES = [
    'Education',
    'Retirement',
    'Travel',
    'Investment',
    'Other'
] as const;

// Infer the type of valid goal categories
export type GoalCategory = typeof PREDEFINED_GOAL_CATEGORIES[number] | string;

interface IGoal extends Document {
    user_id: Types.ObjectId;
    tenant_id?: Types.ObjectId; 
    goal_name: string; 
    goal_category: 'Education' | 'Retirement' | 'Travel' | 'Investment' | 'Other'; 
    target_amount: number; 
    initial_investment: number; 
    current_amount: number; 
    contributions: Array<{
        amount: number;
        date: Date;
    }>; 
    currency: 'USD' | 'EUR' | 'INR' | 'GBP'; 
    target_date: Date; 
    contribution_frequency: 'Monthly' | 'Quarterly' | 'Yearly'; 
    priority_level: 'Low' | 'Medium' | 'High'; 
    required_contribution?: number; 
    description?: string; 
    reminder_frequency: 'Daily' | 'Weekly' | 'Monthly' | 'None'; 
    next_reminder_date?: Date; 
    goal_type: 'Savings' | 'Investment' | 'Debt Repayment' | 'Other'; 
    tags?: string[]; 
    dependencies?: Types.ObjectId[]; 
    is_completed: boolean; 
    created_by: Types.ObjectId; 
    last_updated_by?: Types.ObjectId;
    audit_logs?: Array<{
        action: 'Created' | 'Updated' | 'Deleted';
        updated_by: Types.ObjectId;
        updated_at: Date;
        changes: Record<string, string[]>;
    }>; 
    createdAt?: Date; 
    updatedAt?: Date; 
}

export default IGoal;
