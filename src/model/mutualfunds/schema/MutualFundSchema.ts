import { Schema } from 'mongoose';

const MutualFundSchema = new Schema({
    scheme_code: {
        type: String,
        required: true,
        unique: true,
    },
    isin_div_payout_or_growth: {
        type: String,
    },
    isin_div_reinvestment: {
        type: String,
    },
    scheme_name: {
        type: String,
        required: true,
    },
    net_asset_value: {
        type: String,
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
