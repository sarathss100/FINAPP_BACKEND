import { Document } from 'mongoose';

export interface IMutualFund extends Document {
    scheme_code: string;
    isin_div_payout_or_growth: string;
    isin_div_reinvestment?: string;
    scheme_name: string;
    net_asset_value: string;
    date: Date;
}
