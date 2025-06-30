"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION_CHANNELS = exports.SEVERITY_LEVELS = exports.ACCOUNT_ALERT_TYPES = exports.GOAL_TYPES = exports.BUDGET_TYPES = exports.BILL_TYPES = exports.NOTIFICATION_TYPES = void 0;
exports.NOTIFICATION_TYPES = [
    'BillReminder',
    'BudgetAlert',
    'GoalProgress',
    'AccountAlert',
];
exports.BILL_TYPES = [
    'Subscription',
    'Utility',
    'Loan',
    'CreditCard',
    'Other'
];
exports.BUDGET_TYPES = [
    'Monthly',
    'OneTime',
    'CategoryBased'
];
exports.GOAL_TYPES = [
    'Savings',
    'Investment',
    'Debt Repayment',
    'Other'
];
exports.ACCOUNT_ALERT_TYPES = [
    'LargeTransaction',
    'LowBalance',
    'UnusualAcitivity',
    'LimitExceeded'
];
exports.SEVERITY_LEVELS = [
    'Low',
    'Medium',
    'High',
    'Critical'
];
exports.NOTIFICATION_CHANNELS = [
    'Email',
    'SMS',
    'Push',
    'InApp'
];
