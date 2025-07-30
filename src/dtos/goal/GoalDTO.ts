export default interface IGoalDTO {
    _id?: string;
    user_id?: string;
    tenant_id?: string;
    goal_name: string; 
    goal_category?: 'Education' | 'Retirement' | 'Travel' | 'Investment' | 'Other';
    target_amount: number;
    initial_investment: number;
    current_amount?: number;
    currency?: 'USD' | 'EUR' | 'INR' | 'GBP';
    target_date: Date;
    contribution_frequency: 'Monthly' | 'Quarterly' | 'Yearly';
    priority_level?: 'Low' | 'Medium' | 'High';
    description?: string;
    reminder_frequency?: 'Daily' | 'Weekly' | 'Monthly' | 'None';
    goal_type?: 'Savings' | 'Investment' | 'Debt Repayment' | 'Other';
    tags?: string[];
    dependencies?: string[];
    is_completed: boolean;
    created_by?: string;
    last_updated_by?: string;
    dailyContribution?: number;
    monthlyContribution?: number;
}