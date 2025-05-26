import { IMutualFundDTO } from 'dtos/mutualfunds/MutualFundDTO';

interface IMutualFundRepository {
    syncBulkMutualFund(dataArray: IMutualFundDTO[]): Promise<boolean>;
    searchMutualFunds(query: string): Promise<IMutualFundDTO[]>;
}

export default IMutualFundRepository;
