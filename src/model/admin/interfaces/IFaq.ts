import { Document, Types } from 'mongoose';

export default interface IFaqDocument extends Document {
    _id: string | Types.ObjectId,
    question: string;
    answer: string;
    isDeleted?: boolean;
    isPublished?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}