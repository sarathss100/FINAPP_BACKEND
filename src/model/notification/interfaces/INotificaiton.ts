import { Document, Types } from 'mongoose';

interface INotification extends Document {
    user_id: Types.ObjectId;
    message: string;
    isSeen: boolean;
    is_completed: boolean;
    reminder_frequency: string;
    next_reminder_date: Date;
    priority_level: string;
    target_Date: Date;
    createdAt?: Date; 
    updatedAt?: Date; 
}

export default INotification;

