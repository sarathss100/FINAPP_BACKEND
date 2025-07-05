import mongoose, { Model } from 'mongoose';
import INotification from '../interfaces/INotificaiton';
import NotificaitonSchema from '../schema/NotificatonSchema';

export const NotificationModel: Model<INotification> = mongoose.model<INotification>('Notifications', NotificaitonSchema);
