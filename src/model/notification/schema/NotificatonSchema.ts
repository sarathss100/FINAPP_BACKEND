import { Schema } from 'mongoose';
import INotification from '../interfaces/INotificaiton';

const NotificaitonSchema = new Schema<INotification>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: true
        },
        isSeen: {
            type: Boolean,
            required: true
        },
        is_completed: {
            type: Boolean,
            default: false
        },
        reminder_frequency: {
            type: String,
            enum: ['Daily', 'Weekly', 'Monthly', 'None'],
            default: 'None'
        },
        next_reminder_date: {
            type: Date
        },
        priority_level: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium'
        },
        target_date: {
            type: Date,
            required: true,
        }
    },
    {
        timestamps: true
    }
); 

export default NotificaitonSchema;
