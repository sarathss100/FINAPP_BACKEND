import mongoose, { Model } from 'mongoose';
import ISubscriptionDocument from '../interfaces/ISubscription';
import SubscriptionSchema from '../schema/SubscriptionSchema';

export const SubscriptionModel: Model<ISubscriptionDocument> = mongoose.model<ISubscriptionDocument>('Subscription', SubscriptionSchema);