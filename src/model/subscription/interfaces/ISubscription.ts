import mongoose, { Document } from 'mongoose';

export interface ISubscription extends Document {
    user_id: mongoose.Types.ObjectId;
    plan_name: string;
    plan_type: 'monthly' | 'annually';
    payment_date: Date;
    expiry_date: Date;
    amount: number;
    currency: 'INR';
    subscription_mode: 'auto_renewal' | 'manual';
    status: "active" | "expired" | 'cancelled';
    payment_method: string;
    transaction_id: string;
}
