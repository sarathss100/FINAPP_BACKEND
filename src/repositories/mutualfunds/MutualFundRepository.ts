import { IMutualFundDTO } from 'dtos/mutualfunds/MutualFundDTO';
import IMutualFundRepository from './interfaces/IMutualFundRepository';
import { MutualFundModel } from 'model/mutualfunds/model/MutualFundModel';

class MutualFundRepository implements IMutualFundRepository {
    private static _instance: MutualFundRepository;
    public constructor() { }
    
    public static get instance(): MutualFundRepository {
        if (!MutualFundRepository._instance) {
            MutualFundRepository._instance = new MutualFundRepository();
        }
        return MutualFundRepository._instance;
    }
    
    // Performs a bulk upsert operation for mutual fund data in the database.
    async syncBulkMutualFund(dataArray: IMutualFundDTO[]): Promise<boolean> { 
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

    // Searches for mutual funds by matching the query against scheme names or codes.
    async searchMutualFunds(query: string): Promise<IMutualFundDTO[]> { 
        try {
            const regex = new RegExp(query, 'i');
        
           const results = await MutualFundModel.find({
                $or: [
                   { scheme_name: { $regex: regex } },
                   { scheme_code: { $regex: regex } }
               ]
            }).lean();
        
            return results.map((doc) => ({
                scheme_code: doc.scheme_code,
                scheme_name: doc.scheme_name,
                net_asset_value: doc.net_asset_value,
                date: doc.date,
            }));
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    // Retrieves detailed information about a specific mutual fund by its scheme code.
    async getMutualFundDetails(schemeCode: string): Promise<IMutualFundDTO> { 
        try {
            const result = await MutualFundModel.findOne({ scheme_code: schemeCode }).lean();
            if (!result) {
                throw new Error('Mutual fund not found');
            }
            const mutualFundDetails = {
                scheme_code: result.scheme_code,
                scheme_name: result.scheme_name,
                net_asset_value: result.net_asset_value,
                date: result.date,
            };
            
            return mutualFundDetails;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}

export default MutualFundRepository;
