/**
 * DTO for Goal entity
 */
export interface IGoalDTO {
    _id?: string;
    user_id?: string;
    tenant_id?: string;
    goal_name: string; // Must be at least 3 characters, max 255
    goal_category?: 'Education' | 'Retirement' | 'Travel' | 'Investment' | 'Other'; // Default 'Other'
    target_amount: number; // Must be >= 0
    initial_investment: number; // Must be >= 0
    current_amount?: number; // Must be >= 0
    currency?: 'USD' | 'EUR' | 'INR' | 'GBP'; // Default 'INR'
    target_date: Date; // Must be in the future
    contribution_frequency: 'Monthly' | 'Quarterly' | 'Yearly';
    priority_level?: 'Low' | 'Medium' | 'High'; // Default 'Medium'
    description?: string;
    reminder_frequency?: 'Daily' | 'Weekly' | 'Monthly' | 'None'; // Default 'None'
    goal_type?: 'Savings' | 'Investment' | 'Debt Repayment' | 'Other'; // Default 'Savings'
    tags?: string[]; // Optional array of strings
    dependencies?: string[]; // Optional array of dependency IDs
    is_completed: boolean;
    created_by?: string; // Required if present
    last_updated_by?: string;
    dailyContribution?: number;
    monthlyContribution?: number;
}