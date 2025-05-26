import { Document } from 'mongoose';

export interface IMutualFund extends Document {
    scheme_code: string;
    scheme_name: string;
    net_asset_value: number;
    date: Date;
}
