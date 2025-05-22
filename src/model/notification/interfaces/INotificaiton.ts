import { Document, Types } from 'mongoose';

export const NOTIFICATION_TYPES = [
    'BillReminder',
    'BudgetAlert',
    'GoalProgress',
    'AccountAlert',
] as const;

export type NotificationType = typeof NOTIFICATION_TYPES[number];

export const BILL_TYPES = [
    'Subscription',
    'Utility',
    'Loan',
    'CreditCard',
    'Other'
] as const;

export type BillType = typeof BILL_TYPES[number];

export const BUDGET_TYPES = [
    'Monthly',
    'OneTime',
    'CategoryBased'
] as const;

export type BudgetType = typeof BUDGET_TYPES[number];

export const GOAL_TYPES = [
    'Savings',
    'Investment',
    'Debt Repayment',
    'Other'
] as const;

export type GoalType = typeof GOAL_TYPES[number];

export const ACCOUNT_ALERT_TYPES = [
    'LargeTransaction',
    'LowBalance',
    'UnusualAcitivity',
    'LimitExceeded'
] as const;

export type AccountAlertType = typeof ACCOUNT_ALERT_TYPES[number];

export const SEVERITY_LEVELS = [
    'Low',
    'Medium',
    'High',
    'Critical'
] as const;

export type SeverityLevel = typeof SEVERITY_LEVELS[number];

export const NOTIFICATION_CHANNELS = [
    'Email',
    'SMS',
    'Push',
    'InApp'
] as const;

export type NotificationChannel = typeof NOTIFICATION_CHANNELS[number];

interface IBillReference {
    bill_id?: Types.ObjectId;
    bill_name: string;
    bill_type: BillType;
    amount: number;
    due_date: Date;
    reminder_frequency: 'Daily' | 'Weekly' | 'Monthly' | 'None';
}

interface IBudgetReference {
    budget_id?: Types.ObjectId;
    budget_name: string;
    budget_type: BudgetType;
    total_amount: number;
    spent_amount: number;
    percentage_complete: number;
}

interface IGoalReference {
    goal_id?: Types.ObjectId;
    goal_name: string;
    goal_type: GoalType;
    target_amount: number;
    current_amount: number;
    percentage_complete: number;
    days_remaining?: number;
    is_at_risk?: boolean;
    failure_scenarios?: string[];
}

interface IAccountAlertReference {
    account_id?: Types.ObjectId;
    alert_type: AccountAlertType;
    transaction_id?: Types.ObjectId;
    amount?: number;
    description?: string;
}
 
interface INotification extends Document {
    user_id: Types.ObjectId;
    tenant_id?: Types.ObjectId;
    title: string;
    message: string;
    type: NotificationType;
    severity: SeverityLevel;
    isSeen: boolean; 
    is_completed: boolean;
    reminder_frequency: 'Daily' | 'Weekly' | 'Monthly' | 'None';
    next_reminder_date?: Date;
    target_date: Date;

    priority_level: 'Low' | 'Medium' | 'High';

    
    bill_ref?: IBillReference;
    budget_ref?: IBudgetReference;
    goal_ref?: IGoalReference;
    account_alert_ref?: IAccountAlertReference;

    channels: NotificationChannel[];
    read: boolean;
    delivered: boolean;
    scheduled_for: Date;
    sent_at?: Date;
    metadata?: Record<string, unknown>;

    createdAt: Date;
    updatedAt: Date;
}

export default INotification;

