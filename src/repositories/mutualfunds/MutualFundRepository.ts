import IMutualFundRepository from './interfaces/IMutualFundRepository';
import { MutualFundModel } from '../../model/mutualfunds/model/MutualFundModel';
import IMutualFundDocument from '../../model/mutualfunds/interfaces/IMutualFund';
import IBaseRepository from '../base_repo/interface/IBaseRepository';
import BaseRepository from '../base_repo/BaseRepository';

export default class MutualFundRepository implements IMutualFundRepository {
    private static _instance: MutualFundRepository;
    private baseRepo: IBaseRepository<IMutualFundDocument> = new BaseRepository<IMutualFundDocument>(MutualFundModel);
    public constructor() { }
    
    public static get instance(): MutualFundRepository {
        if (!MutualFundRepository._instance) {
            MutualFundRepository._instance = new MutualFundRepository();
        }
        return MutualFundRepository._instance;
    }
    
    async syncBulkMutualFund(dataArray: Partial<IMutualFundDocument>[]): Promise<boolean> { 
        try {

            const bulkOps = dataArray.map((data) => ({
                updateOne: {
                    filter: { scheme_code: data.scheme_code },
                    update: {
                        $setOnInsert: { scheme_name: data.scheme_name },
                        $set: {
                            net_asset_value: data.net_asset_value,
                            date: data.date,
                        }
                    },
                    upsert: true 
                }
            }));

            const response = await MutualFundModel.bulkWrite(bulkOps);

            return response ? true : false;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async searchMutualFunds(query: string): Promise<IMutualFundDocument[]> { 
        try {
            const regex = new RegExp(query, 'i');
        
           const results = await this.baseRepo.find({
                $or: [
                   { scheme_name: { $regex: regex } },
                   { scheme_code: { $regex: regex } }
               ]
            });
        
            return results;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getMutualFundDetails(schemeCode: string): Promise<IMutualFundDocument> { 
        try {
            const result = await this.baseRepo.findOne({ scheme_code: schemeCode });

            if (!result) {
                throw new Error('Mutual fund not found');
            }
            
            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}


