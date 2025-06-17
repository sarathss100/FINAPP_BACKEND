import { Document } from 'mongoose';

// Define the Faq interface
interface IFaq extends Document {
    question: string;
    answer: string;
    isDeleted: boolean;
    isPublished?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export default IFaq;
