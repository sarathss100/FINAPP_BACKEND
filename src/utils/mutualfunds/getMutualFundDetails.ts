import MutualFundService from '../../services/mutualfunds/MutualFundService';
import IMutualFundDTO from '../../dtos/mutualfunds/MutualFundDTO';

const mutualFundService = MutualFundService.instance;

const getMutualFundDetails = async function(schemCode: string): Promise<IMutualFundDTO> {
    try {
        const mutualFundDetails = await mutualFundService.getMutualFundDetails(schemCode);
        return mutualFundDetails;
    } catch (error) {
        throw new Error((error as Error).message || `Failed to fetch the Mutual Fund Details`);
    }
};

export default getMutualFundDetails;