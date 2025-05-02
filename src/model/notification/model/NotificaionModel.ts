import mongoose, { Model } from 'mongoose';
import INotification from '../interfaces/INotificaiton';

export const NotificationModel: Model<INotification> = mongoose.model<INotification>('Notificationd',);
