import mongoose, { Document } from 'mongoose';

export interface IInsurance extends Document {
    userId: mongoose.Types.ObjectId;
    type: string;
    coverage: number;
    premium: number;
    next_payment_date: Date;
    status: string;
}
