import mongoose, { Model } from 'mongoose';
import NotificaitonSchema from '../schema/NotificatonSchema';
import INotificationDocument from '../interfaces/INotificaiton';

export const NotificationModel: Model<INotificationDocument> = mongoose.model<INotificationDocument>('Notifications', NotificaitonSchema);
