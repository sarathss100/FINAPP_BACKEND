import mongoose, { Model } from 'mongoose';
import FaqSchema from '../schema/faqModel';
import IFaqDocument from '../interfaces/IFaq';

export const FaqModel: Model<IFaqDocument> = mongoose.model<IFaqDocument>('Faq', FaqSchema);
