import { Schema } from 'mongoose';

const FaqSchema = new Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true,
    }
}, { timestamps: true });

export default FaqSchema;
