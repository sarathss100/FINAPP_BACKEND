import mongoose, { Document } from 'mongoose';

export default interface ISubscriptionDocument extends Document {
    _id: mongoose.Types.ObjectId;
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
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}