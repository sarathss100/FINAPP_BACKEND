import { Schema } from 'mongoose';

const MutualFundSchema = new Schema({
    scheme_code: {
        type: String,
        required: true,
        unique: true,
    },
    scheme_name: {
        type: String,
        required: true,
    },
    net_asset_value: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    }},
    {
        timestamps: true,
    }
);

export default MutualFundSchema;

