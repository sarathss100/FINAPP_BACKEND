import mongoose, { Model } from 'mongoose';
import FaqSchema from '../schema/faqModel';
import IFaq from '../interfaces/IFaq';

export const FaqModel: Model<IFaq> = mongoose.model<IFaq>('Faq', FaqSchema);
