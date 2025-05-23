import { Schema } from 'mongoose';
import { InvestmentType } from '../interfaces/IInvestment';

const InvestmentSchema = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(InvestmentType),
            required: true,
        },
        details: {
            type: Schema.Types.Mixed,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export default InvestmentSchema;
