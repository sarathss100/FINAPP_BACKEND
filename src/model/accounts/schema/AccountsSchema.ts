import { Schema } from 'mongoose';

export const AccountSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        account_name: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            enum: ['INR'],
            default: 'INR'
        },
        description: String,
        is_active: {
            type: Boolean,
            default: true,
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        last_updated_by: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        account_type: {
            type: String,
            enum: ['Bank', 'Debt', 'Investment', 'Cash']
        },
        current_balance: {
            type: Number,
            default: 0
        },
        institution: String,
        account_number: String,
        account_subtype: {
            type: String,
            enum: ['Current', 'Savings', 'FD', 'RD']
        },
        loan_type: {
            type: String,
            enum: ['Mortgage', 'Student', 'Personal', 'Auto', 'Credit Card']
        },
        interest_rate: Number,
        monthly_payment: Number,
        due_date: Date,
        term_months: Number,
        investment_platform: String,
        portfolio_value: Number,
        location: {
            type: String,
            enum: ['Home', 'Safe', 'Wallet', 'Office']
        }
    },
    {
        timestamps: true
    }
);


