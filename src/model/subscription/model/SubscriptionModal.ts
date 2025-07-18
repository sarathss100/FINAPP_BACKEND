import mongoose, { Model } from 'mongoose';
import { ISubscription } from '../interfaces/ISubscription';
import SubscriptionSchema from '../schema/SubscriptionSchema';

export const SubscriptionModel: Model<ISubscription> = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
