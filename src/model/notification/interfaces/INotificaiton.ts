import mongoose, { Document } from 'mongoose';

export const NOTIFICATION_TYPES = [
    'DebtPaymentAlert',
    'GoalPaymentAlert',
    'InsurancePaymentAlert',
    'ChatMessage',
] as const;

export type NotificationType = typeof NOTIFICATION_TYPES[number];
export default interface INotificationDocument extends Document {
    _id: mongoose.Types.ObjectId;
    user_id: string;
    title: string;
    message: string;
    type: NotificationType;
    is_read: boolean;
    meta?: string | object;
    archived: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}
