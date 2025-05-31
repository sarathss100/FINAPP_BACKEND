import { Schema } from 'mongoose';

const InsuranceSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    coverage: { type: Number, required: true },
    premium: { type: Number, required: true },
    next_payment_date: { type: Date, required: true },
    payment_status: { type: String, required: true },
    status: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export default InsuranceSchema;
