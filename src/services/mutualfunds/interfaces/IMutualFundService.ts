import IMutualFundDTO from '../../../dtos/mutualfunds/MutualFundDTO';

export default interface IMutualFundService {
    syncNavData(): Promise<boolean>;
    searchMutualFunds(query: string): Promise<IMutualFundDTO[]>;
    getMutualFundDetails(schemeCode: string): Promise<IMutualFundDTO>;
}
