import IPublicRepository from '../../repositories/public/interfaces/IPublicRepository';
import IPublicService from './interfaces/IPublicService';
import { ServerError } from '../../error/AppError';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { IFaqDTO } from '../../dtos/base/IFaqDTO';
import { wrapServiceError } from '../../utils/serviceUtils';
import FaqMapper from '../../mappers/faqs/FaqMapper';

export default class PublicService implements IPublicService {
    public _publicRepository: IPublicRepository;
    constructor(publicRepository: IPublicRepository) {
        this._publicRepository = publicRepository;
    }

    async getFaqs(): Promise<IFaqDTO[]> {
        try {
            // Call the public repository method to fetch all published and non-deleted FAQ entries
            const faqDetails = await this._publicRepository.getFaqs();

            const resultDTO = FaqMapper.toDTOs(faqDetails);

            // Validate the result; throw an error if no FAQs were found
            if (!resultDTO || resultDTO.length === 0) {
                throw new ServerError(ErrorMessages.FAILED_TO_FETCH_FAQS, StatusCodes.BAD_REQUEST);
            }

            return resultDTO;
        } catch (error) {
            console.error(`Error while getting faqs:`, error);
            throw wrapServiceError(error);
        }
    }
}
