import mongoose, { Document } from 'mongoose';

export default interface IInsuranceDocument extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    type: string;
    coverage: number;
    premium: number;
    next_payment_date: Date;
    payment_status: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    __v?: number;
}
