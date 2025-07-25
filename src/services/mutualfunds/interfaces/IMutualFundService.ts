import { IMutualFundDTO } from '../../../dtos/mutualfunds/MutualFundDTO';

interface IMutualFundService {
    syncNavData(): Promise<boolean>;
    searchMutualFunds(query: string): Promise<IMutualFundDTO[]>;
    getMutualFundDetails(schemeCode: string): Promise<IMutualFundDTO>;
}

export default IMutualFundService;
