"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MutualFundModel_1 = require("model/mutualfunds/model/MutualFundModel");
class MutualFundRepository {
    constructor() { }
    static get instance() {
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
    syncBulkMutualFund(dataArray) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const response = yield MutualFundModel_1.MutualFundModel.bulkWrite(bulkOps);
                return response ? true : false;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
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
    searchMutualFunds(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = new RegExp(query, 'i');
                const results = yield MutualFundModel_1.MutualFundModel.find({
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
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    /**
    * Retrieves detailed information about a specific mutual fund by its scheme code.
    *
    * This method fetches a single mutual fund record from the database by matching
    * the provided `schemeCode`. If no matching record is found, an error is thrown.
    *
    * @param {string} schemeCode - The unique identifier (scheme code) of the mutual fund.
    * @returns {Promise<IMutualFundDTO>} - A promise resolving to the matching mutual fund DTO.
    * @throws {Error} - Throws an error if the mutual fund is not found or if a database error occurs.
    */
    getMutualFundDetails(schemeCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield MutualFundModel_1.MutualFundModel.findOne({ scheme_code: schemeCode }).lean();
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
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = MutualFundRepository;
