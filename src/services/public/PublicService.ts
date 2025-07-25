import IPublicRepository from '../../repositories/public/interfaces/IPublicRepository';
import IPublicService from './interfaces/IPublicService';
import { AppError, ServerError } from '../../error/AppError';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { IFaqDTO } from '../../dtos/base/FaqDto';

class PublicService implements IPublicService {
    public _publicRepository: IPublicRepository;
    constructor(publicRepository: IPublicRepository) {
        this._publicRepository = publicRepository;
    }

    // Fetches all published and non-deleted FAQ entries from the database.
    async getFaqs(): Promise<IFaqDTO[]> {
        try {
            // Call the public repository method to fetch all published and non-deleted FAQ entries
            const faqDetails = await this._publicRepository.getFaqs();

            // Validate the result; throw an error if no FAQs were found
            if (!faqDetails || faqDetails.length === 0) {
                throw new ServerError(ErrorMessages.FAILED_TO_FETCH_FAQS, StatusCodes.BAD_REQUEST);
            }

            // Return the fetched FAQ entries
            return faqDetails;
        } catch (error) {
            // Re-throw the error if it's an instance of AppError (custom application error)
            if (error instanceof AppError) {
                throw error;
            } else {
                // Re-throw unexpected errors for further handling
                throw error;
            }
        }
    }
}

export default PublicService;
