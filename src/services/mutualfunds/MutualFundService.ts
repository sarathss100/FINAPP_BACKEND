import { ServerError } from '../../error/AppError';
import IMutualFundService from './interfaces/IMutualFundService';
import IMutualFundRepository from '../../repositories/mutualfunds/interfaces/IMutualFundRepository';
import fetchNavData from '../../utils/mutualfunds/navFetcher';
import { ErrorMessages } from '../../constants/errorMessages';
import MutualFundRepository from '../../repositories/mutualfunds/MutualFundRepository';
import IMutualFundDTO from '../../dtos/mutualfunds/MutualFundDTO';
import { wrapServiceError } from '../../utils/serviceUtils';
import MutualFundMapper from '../../mappers/mutualfunds/MutualFundMapper';

export default class MutualFundService implements IMutualFundService {
    private static _instance: MutualFundService;
    private _mutualFundRepository: IMutualFundRepository;

    constructor(mutualFundRepository: IMutualFundRepository) {
        this._mutualFundRepository = mutualFundRepository;
    }

    public static get instance(): MutualFundService {
        if (!MutualFundService._instance) {
            const repo = MutualFundRepository.instance;
            MutualFundService._instance = new MutualFundService(repo);
        }
        return MutualFundService._instance;
    }

    async syncNavData(): Promise<boolean> {
        try {
            const navData = await fetchNavData();
            if (navData.length < 1) {
                throw new ServerError(ErrorMessages.FAILED_TO_FETCH_NAV_DATA);
            }

            const mappedModel = MutualFundMapper.toModels(navData);

            // Call the repository to synchronize the NAV data.
            const isNavDataSynched = await this._mutualFundRepository.syncBulkMutualFund(mappedModel);

            return isNavDataSynched;
        } catch (error) {
            console.error('Error synchronizing NAV data:', error);
            throw wrapServiceError(error);
        }
    }

    async searchMutualFunds(query: string): Promise<IMutualFundDTO[]> {
        try {
            // Call the repository to perform the search.
            const mutualFunds = await this._mutualFundRepository.searchMutualFunds(query);

            const resultDTO = MutualFundMapper.toDTOs(mutualFunds);
            
            return resultDTO;
        } catch (error) {
            console.error('Error during mutual fund search:', error);
            throw wrapServiceError(error);
        }
    }

    async getMutualFundDetails(schemeCode: string): Promise<IMutualFundDTO> {
        try {
            // Call the repository to fetch mutual fund details by scheme code.
            const mutualFundDetails = await this._mutualFundRepository.getMutualFundDetails(schemeCode);

            const resultDTO = MutualFundMapper.toDTO(mutualFundDetails);
            
            return resultDTO;
        } catch (error) {
            console.error('Error during mutual fund detail retrieval:', error);
            throw wrapServiceError(error);
        }
    }
}

