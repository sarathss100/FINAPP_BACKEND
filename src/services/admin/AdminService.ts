import IUserDetails from 'repositories/admin/interfaces/IUserDetails';
import IAdminService from './interfaces/IAdminService';
import IAdminRepository from 'repositories/admin/interfaces/IAdminRepository';
import { AppError, ServerError, ValidationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import { IFaqDTO } from 'dtos/base/FaqDto';
import { IHealthStatus } from './health/interfaces/IHealth';
import { CompositeHealthCheckService } from './health/composite-health';
import { ExternalApiHealthCheckService } from './health/api-health';
import { MongoDbHealthCheckService } from './health/mongodb-health';
import { RedisHealthCheckService } from './health/redis-health';
import { ServerHealthCheckService } from './health/server-health';
import { ISystemMetrics } from 'repositories/admin/interfaces/ISystemMetrics';
import IPaginationMeta from 'dtos/admin/IPaginationMeta';

class AdminService implements IAdminService {
    private _adminRepository: IAdminRepository;
    constructor(adminRepository: IAdminRepository) {
        this._adminRepository = adminRepository;
    }

    // Fetches all user details from the database.
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

    // Toggles the status (block/unblock) of a user for the admin
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

    // Adds a new FAQ entry to the list for the admin.
    async addFaq(newFaq: IFaqDTO): Promise<boolean> {
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

    // Fetches all FAQ entries from the database for administrative purposes.
    async getAllFaqsForAdmin(page: number, limit: number, search: string): Promise<{ faqDetails: IFaqDTO[], pagination: IPaginationMeta }> {
        try {
            const paginatedFaqData = await this._adminRepository.getAllFaqsForAdmin(page, limit, search);
        
            if (!paginatedFaqData.faqDetails) {
                throw new ServerError(ErrorMessages.FAILED_TO_FETCH_FAQS, StatusCodes.INTERNAL_SERVER_ERROR);
            }
    
            if (paginatedFaqData.faqDetails.length === 0) {
                throw new ServerError(ErrorMessages.NO_FAQ_FOUND, StatusCodes.NOT_FOUND);
            }
        
            return paginatedFaqData;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            } else {
                throw error;
            }
        }
    }

    // Fetches all FAQ entries from the database for the admin.
    async getAllFaqs(): Promise<IFaqDTO[] | null> {
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

    // Deletes an FAQ entry by its unique identifier.
    async deleteFaq(faqId: string): Promise<boolean> {
        try {
            // Call the repository method to delete the FAQ by ID
            const isRemoved = await this._adminRepository.deleteFaq(faqId);
        
            // Validate the result; throw an error if no FAQs were found or the operation failed
            if (!isRemoved) {
                throw new ServerError(ErrorMessages.FAILED_TO_DELETE_FAQ, StatusCodes.INTERNAL_SERVER_ERROR);
            }
        
            // Return the deletion result
            return isRemoved;
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

    // Toggles the publish status (e.g., `isPublished`) of an FAQ identified by its ID.
    async togglePublish(faqId: string): Promise<boolean> {
        try {
            // Call the repository method to toggle the publish status
            const isToggled = await this._adminRepository.togglePublish(faqId);
        
            // Return the result from the repository
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

    // Updates an FAQ entry with the provided partial data.
    async updateFaq(faqId: string, updatedData: Partial<IFaqDTO>): Promise<boolean> {
        try {
            // Call the repository method to update the FAQ
            const isUpdated = await this._adminRepository.updateFaq(faqId, updatedData);
        
            // Return the result from the repository
            return isUpdated;
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

    // Fetches the count of new registrations from the database.
    async getNewRegistrationCount(): Promise<number> {  
        try {
            // Call the repository method to fetch the count of new registrations
            const count = await this._adminRepository.getNewRegistrationCount();

            // Validate the result; throw an error if the count is not a number or the operation failed
            if (typeof count !== 'number') {
                throw new ServerError(ErrorMessages.FAILED_TO_FETCH_REGISTRATION_COUNT, StatusCodes.INTERNAL_SERVER_ERROR);
            }

            // Return the fetched count of new registrations
            return count;
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
     * Performs a composite health check by evaluating the health of multiple system components
     * such as external APIs, MongoDB, Redis, and the server itself.
     */
    async getHealthStatus(): Promise<IHealthStatus> {  
        try {
            const response = new CompositeHealthCheckService([
                new ExternalApiHealthCheckService('http://localhost:5000/'),
                new MongoDbHealthCheckService(),
                new RedisHealthCheckService(),
                new ServerHealthCheckService(),
            ]);

            const healthCheckResult = await response.check();

            return healthCheckResult;
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
     * Retrieves system metrics by querying the admin repository.
     * This may include various performance or operational metrics from underlying systems.
     */
    async getSystemMetrics(): Promise<ISystemMetrics> {  
        try {
            const data = await this._adminRepository.getSystemMetrics();
        
            return data;
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
