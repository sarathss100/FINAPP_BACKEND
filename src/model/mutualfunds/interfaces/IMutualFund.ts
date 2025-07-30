import mongoose, { Document } from 'mongoose';

export default interface IMutualFundDocument extends Document {
    _id: mongoose.Types.ObjectId;
    scheme_code: string;
    scheme_name: string;
    net_asset_value: number;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    __v?: number;
}