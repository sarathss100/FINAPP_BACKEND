import IPublicRepository from 'repositories/public/interfaces/IPublicRepository';
import IPublicService from './interfaces/IPublicService';
import { IFaq } from 'dtos/base/FaqDto';
import { AppError, ServerError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';

class PublicService implements IPublicService {
    public _publicRepository: IPublicRepository;
    constructor(publicRepository: IPublicRepository) {
        this._publicRepository = publicRepository;
    }

    /**
     * Fetches all published and non-deleted FAQ entries from the database.
     * 
     * This method retrieves FAQ entries by calling the `getFaqs` method of the public repository.
     * It ensures that only valid FAQ entries are returned. If no FAQs are found or an error occurs,
     * appropriate exceptions are thrown.
     * 
     * @returns A promise that resolves to an array of FAQ entries (`IFaq[]`).
     * @throws {ServerError} If no FAQs are found or the fetch operation fails.
     * @throws {AppError} If any application-specific error occurs during the process.
     * @throws {Error} If an unexpected error occurs.
     */
    async getFaqs(): Promise<IFaq[]> {
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
