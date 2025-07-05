import { Schema } from 'mongoose';
import INotification, { NOTIFICATION_TYPES } from '../interfaces/INotificaiton';

const NotificaitonSchema = new Schema<INotification>(
    {
        user_id: {
            type: String,
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: NOTIFICATION_TYPES,
            required: true,
        },
        is_read: {
            type: Boolean,
            default: false,
        },
        meta: {
            type: Schema.Types.Mixed,
            default: null,
        },
        archived: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true
    }
); 

export default NotificaitonSchema;
