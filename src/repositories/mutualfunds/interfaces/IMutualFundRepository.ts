import IMutualFundDocument from '../../../model/mutualfunds/interfaces/IMutualFund';

export default interface IMutualFundRepository {
    syncBulkMutualFund(dataArray: Partial<IMutualFundDocument>[]): Promise<boolean>;
    searchMutualFunds(query: string): Promise<IMutualFundDocument[]>;
    getMutualFundDetails(schemeCode: string): Promise<IMutualFundDocument>;
}