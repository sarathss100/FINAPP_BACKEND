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
    
    /**
     * Performs a bulk upsert operation for mutual fund data in the database.
     * 
     * This method takes an array of mutual fund data (`IMutualFundDTO[]`) and performs a bulk write operation.
     * Each entry either updates an existing document (based on `scheme_code`) or inserts a new one,
     * setting common fields like `net_asset_value` and `date`, and `scheme_name` only on insert.
     *
     * @param {IMutualFundDTO[]} dataArray - An array of mutual fund data objects conforming to the IMutualFundDTO structure.
     * @returns {Promise<boolean>} - A promise resolving to `true` if the bulk operation succeeded, `false` otherwise.
     * @throws {Error} - Throws an error if the database operation fails or invalid data is provided.
     */
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

    /**
     * Searches for mutual funds by matching the query against scheme names or codes.
     *
     * This method performs a case-insensitive search using regular expressions on both
     * the `scheme_name` and `scheme_code` fields. It returns an array of matching mutual fund records.
     *
     * @param {string} query - The search term to match against mutual fund names or codes.
     * @returns {Promise<IMutualFundDTO[]>} - A promise resolving to an array of matching mutual fund DTOs.
     * @throws {Error} - Throws an error if the database query fails.
     */
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
}

export default MutualFundRepository;
