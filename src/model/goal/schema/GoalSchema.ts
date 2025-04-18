import { Schema } from 'mongoose';
import IGoal from '../interfaces/IGoal';
import { PREDEFINED_GOAL_CATEGORIES } from '../interfaces/IGoal';

const GoalSchema = new Schema<IGoal>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        tenant_id: {
            type: Schema.Types.ObjectId,
            ref: 'Tenant'
        },
        goal_name: {
            type: String,
            required: true,
            trim: true
        },
        goal_category: {
            type: String,
            required: true,
            enum: [...PREDEFINED_GOAL_CATEGORIES, null],
            default: 'Other'
        },
        target_amount: {
            type: Number,
            required: true,
            min: 0
        },
        initial_investment: {
            type: Number,
            required: true,
            min: 0
        },
        current_amount: {
            type: Number,
            default: 0,
            min: 0
        },
        contributions: [{
            amount: {
                type: Number,
                required: true,
                min: 0
            },
            date: {
                type: Date,
                default: Date.now
            }
        }],
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'INR', 'GBP'],
            default: 'INR'
        },
        target_date: {
            type: Date,
            required: true
        },
        contribution_frequency: {
            type: String,
            required: true,
            enum: ['Monthly', 'Quarterly', 'Yearly']
        },
        priority_level: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium'
        },
        required_contribution: {
            type: Number,
            min: 0
        },
        description: {
            type: String,
            trim: true
        },
        reminder_frequency: {
            type: String,
            enum: ['Daily', 'Weekly', 'Monthly', 'None'],
            default: 'None'
        },
        next_reminder_date: {
            type: Date
        },
        goal_type: {
            type: String,
            enum: ['Savings', 'Investment', 'Debt Repayment', 'Other'],
            default: 'Savings'
        },
        tags: [{
            type: String,
            trim: true
        }],
        dependencies: [{
            type: Schema.Types.ObjectId,
            ref: 'Goal' 
        }],
        is_completed: {
            type: Boolean,
            default: false
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        last_updated_by: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        audit_logs: [{
            action: {
                type: String,
                enum: ['Created', 'Updated', 'Deleted'],
                required: true
            },
            updated_by: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            updated_at: {
                type: Date,
                default: Date.now
            },
            changes: {
                type: Object
            }
        }]
    },
    {
        timestamps: true
    }
); 

export default GoalSchema;
