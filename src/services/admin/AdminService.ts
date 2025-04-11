import IUserDetails from 'repositories/admin/interfaces/IUserDetails';
import IAdminService from './interfaces/IAdminService';
import IAdminRepository from 'repositories/admin/interfaces/IAdminRepository';
import { AppError, ServerError, ValidationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { IFaq } from 'dtos/base/FaqDto';

class AdminService implements IAdminService {
    private _adminRepository: IAdminRepository;
    constructor(adminRepository: IAdminRepository) {
        this._adminRepository = adminRepository;
    }

    /**
    * Fetches all user details from the database.
    * 
    * @returns A promise that resolves to an array of user details (`IUserDetails[]`).
    * @throws {ServerError} If no users are found in the database.
    * @throws {AppError} If any application-specific error occurs.
    * @throws {Error} If an unexpected error occurs.
    */
    async getAllUsers(): Promise<IUserDetails[]> {
        try {
            // Retrieve all user details from the admin repository
            const userDetails = await this._adminRepository.findAllUsers();

            // Validate if user details exist; throw an error if no users are found
            if (!userDetails || userDetails.length === 0) {
                throw new ServerError(ErrorMessages.NO_USERS_FOUND, StatusCodes.BAD_REQUEST);
            }

            // Return the fetched user details
            return userDetails;
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

    /**
     * Toggles the status (block/unblock) of a user for the admin.
     * 
     * @param _id - The unique identifier of the user whose status needs to be toggled.
     * @param status - The new status to be set (`true` for active, `false` for blocked).
     * @returns A promise that resolves to `true` if the status was successfully toggled.
     * @throws {ValidationError} If the input is invalid (e.g., missing `_id` or invalid `status` type).
     * @throws {ServerError} If the status update fails in the repository.
     * @throws {AppError} If any application-specific error occurs.
     * @throws {Error} If an unexpected error occurs.
     */
    async toggleUserStatus(_id: string, status: boolean): Promise<boolean> {
        try {
            // Validate the input parameters to ensure they meet the required criteria
            if (!_id || typeof status !== 'boolean') {
                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.INVALID_INPUT);
            }

            // Call the repository method to toggle the user's status
            const isToggled = await this._adminRepository.toggleUserStatus(_id, status);

            // Check if the status toggle operation was successful; throw an error if it failed
            if (!isToggled) {
                throw new ServerError(ErrorMessages.STATUS_UPDATE_FAILED, StatusCodes.BAD_REQUEST);
            }

            // Return the result of the toggle operation
            return isToggled;
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

    /**
     * Adds a new FAQ entry to the list for the admin.
     * 
     * @param newFaq - An object containing the `question` and `answer` for the new FAQ entry.
     * @returns A promise that resolves to `true` if the FAQ was successfully added.
     * @throws {ValidationError} If the input is invalid (e.g., missing `question` or `answer`).
     * @throws {ServerError} If the FAQ addition fails in the repository.
     * @throws {AppError} If any application-specific error occurs.
     * @throws {Error} If an unexpected error occurs.
     */
    async addFaq(newFaq: IFaq): Promise<boolean> {
        try {
            // Validate the input to ensure both `question` and `answer` are provided
            if (!newFaq.question || !newFaq.answer) {
                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.INVALID_INPUT);
            }

            // Call the repository method to add the new FAQ entry
            const isAdded = await this._adminRepository.addFaq(newFaq);

            // Check if the FAQ addition operation was successful; throw an error if it failed
            if (!isAdded) {
                throw new ServerError(ErrorMessages.FAILED_TO_ADD_THE_FAQ, StatusCodes.INTERNAL_SERVER_ERROR);
            }

            // Return the result of the FAQ addition operation
            return isAdded;
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

    /**
     * Fetches all FAQ entries from the database for the admin.
     * 
     * @returns A promise that resolves to an array of FAQ entries (`IFaq[]`) or `null` if no FAQs exist.
     * @throws {ServerError} If fetching the FAQs fails in the repository.
     * @throws {AppError} If any application-specific error occurs.
     * @throws {Error} If an unexpected error occurs.
     */
    async getAllFaqs(): Promise<IFaq[] | null> {
        try {
            // Call the repository method to fetch all FAQ entries
            const faqDetails = await this._adminRepository.getAllFaqs();

            // Validate the result; throw an error if no FAQs were found or the operation failed
            if (!faqDetails) {
                throw new ServerError(ErrorMessages.FAILED_TO_FETCH_FAQS, StatusCodes.INTERNAL_SERVER_ERROR);
            }

            // Validate the result; throw an error if no FAQs were found or the operation failed
            if (faqDetails.length < 0) {
                throw new ServerError(ErrorMessages.NO_FAQ_FOUND, StatusCodes.INTERNAL_SERVER_ERROR);
            }

            // Return the fetched FAQ details
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

export default AdminService;
