import MutualFundService from 'services/mutualfunds/MutualFundService';
import { IMutualFundDTO } from 'dtos/mutualfunds/MutualFundDTO';

const mutualFundService = MutualFundService.instance;

/**
 * Fetches detailed information about a specific mutual fund by its scheme code.
 *
 * This function acts as a wrapper around the `mutualFundService.getMutualFundDetails`
 * method, delegating the request and returning the matching mutual fund data.
 *
 * @param {string} schemCode - The unique identifier (scheme code) of the mutual fund.
 * @returns {Promise<IMutualFundDTO>} - A promise resolving to the mutual fund DTO.
 * @throws {Error} - Throws an error if the mutual fund cannot be retrieved.
 */
const getMutualFundDetails = async function(schemCode: string): Promise<IMutualFundDTO> {
    try {
        const mutualFundDetails = await mutualFundService.getMutualFundDetails(schemCode);
        return mutualFundDetails;
    } catch (error) {
        throw new Error((error as Error).message || `Failed to fetch the Mutual Fund Details`);
    }
};

export default getMutualFundDetails;