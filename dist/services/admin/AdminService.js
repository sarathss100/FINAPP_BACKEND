"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const composite_health_1 = require("./health/composite-health");
const api_health_1 = require("./health/api-health");
const mongodb_health_1 = require("./health/mongodb-health");
const redis_health_1 = require("./health/redis-health");
const server_health_1 = require("./health/server-health");
class AdminService {
    constructor(adminRepository) {
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
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Retrieve all user details from the admin repository
                const userDetails = yield this._adminRepository.findAllUsers();
                // Validate if user details exist; throw an error if no users are found
                if (!userDetails || userDetails.length === 0) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.NO_USERS_FOUND, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Return the fetched user details
                return userDetails;
            }
            catch (error) {
                // Re-throw the error if it's an instance of AppError (custom application error)
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    // Re-throw unexpected errors for further handling
                    throw error;
                }
            }
        });
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
    toggleUserStatus(_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate the input parameters to ensure they meet the required criteria
                if (!_id || typeof status !== 'boolean') {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.INVALID_INPUT, statusCodes_1.StatusCodes.INVALID_INPUT);
                }
                // Call the repository method to toggle the user's status
                const isToggled = yield this._adminRepository.toggleUserStatus(_id, status);
                // Check if the status toggle operation was successful; throw an error if it failed
                if (!isToggled) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.STATUS_UPDATE_FAILED, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Return the result of the toggle operation
                return isToggled;
            }
            catch (error) {
                // Re-throw the error if it's an instance of AppError (custom application error)
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    // Re-throw unexpected errors for further handling
                    throw error;
                }
            }
        });
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
    addFaq(newFaq) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate the input to ensure both `question` and `answer` are provided
                if (!newFaq.question || !newFaq.answer) {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.INVALID_INPUT, statusCodes_1.StatusCodes.INVALID_INPUT);
                }
                // Call the repository method to add the new FAQ entry
                const isAdded = yield this._adminRepository.addFaq(newFaq);
                // Check if the FAQ addition operation was successful; throw an error if it failed
                if (!isAdded) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.FAILED_TO_ADD_THE_FAQ, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
                // Return the result of the FAQ addition operation
                return isAdded;
            }
            catch (error) {
                // Re-throw the error if it's an instance of AppError (custom application error)
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    // Re-throw unexpected errors for further handling
                    throw error;
                }
            }
        });
    }
    // Fetches all FAQ entries from the database for administrative purposes.
    getAllFaqsForAdmin(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paginatedFaqData = yield this._adminRepository.getAllFaqsForAdmin(page, limit, search);
                if (!paginatedFaqData.faqDetails) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.FAILED_TO_FETCH_FAQS, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
                if (paginatedFaqData.faqDetails.length === 0) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.NO_FAQ_FOUND, statusCodes_1.StatusCodes.NOT_FOUND);
                }
                return paginatedFaqData;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    throw error;
                }
            }
        });
    }
    /**
     * Fetches all FAQ entries from the database for the admin.
     *
     * @returns A promise that resolves to an array of FAQ entries (`IFaq[]`) or `null` if no FAQs exist.
     * @throws {ServerError} If fetching the FAQs fails in the repository.
     * @throws {AppError} If any application-specific error occurs.
     * @throws {Error} If an unexpected error occurs.
     */
    getAllFaqs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the repository method to fetch all FAQ entries
                const faqDetails = yield this._adminRepository.getAllFaqs();
                // Validate the result; throw an error if no FAQs were found or the operation failed
                if (!faqDetails) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.FAILED_TO_FETCH_FAQS, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
                // Validate the result; throw an error if no FAQs were found or the operation failed
                if (faqDetails.length < 0) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.NO_FAQ_FOUND, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
                // Return the fetched FAQ details
                return faqDetails;
            }
            catch (error) {
                // Re-throw the error if it's an instance of AppError (custom application error)
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    // Re-throw unexpected errors for further handling
                    throw error;
                }
            }
        });
    }
    /**
     * Deletes an FAQ entry by its unique identifier.
     *
     * This function calls the repository to delete an FAQ from the database using the provided `faqId`.
     * Returns a boolean indicating whether the deletion was successful.
     *
     * @param {string} faqId - The unique identifier of the FAQ to be deleted.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the FAQ was successfully deleted,
     *                             or `false` if the deletion failed (e.g., FAQ not found).
     *
     * @throws {ServerError} If an internal server error occurs during the deletion process.
     * @throws {AppError} If a known application-specific error occurs.
     * @throws {Error} If an unexpected or unhandled error occurs.
     */
    deleteFaq(faqId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the repository method to delete the FAQ by ID
                const isRemoved = yield this._adminRepository.deleteFaq(faqId);
                // Validate the result; throw an error if no FAQs were found or the operation failed
                if (!isRemoved) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.FAILED_TO_DELETE_FAQ, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
                // Return the deletion result
                return isRemoved;
            }
            catch (error) {
                // Re-throw the error if it's an instance of AppError (custom application error)
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    // Re-throw unexpected errors for further handling
                    throw error;
                }
            }
        });
    }
    /**
     * Toggles the publish status (e.g., `isPublished`) of an FAQ identified by its ID.
     *
     * This function delegates the toggle operation to the repository layer and returns
     * a boolean indicating whether the update was successful (i.e., if the FAQ exists and was updated).
     *
     * @param {string} faqId - The unique identifier of the FAQ whose publish status is to be toggled.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the FAQ was successfully toggled,
     *                             or `false` if no matching FAQ was found or the update failed.
     *
     * @throws {ServerError} If an internal server error occurs during the toggle process.
     * @throws {AppError} If a known application-specific error occurs.
     * @throws {Error} If an unexpected or unhandled error occurs.
     */
    togglePublish(faqId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the repository method to toggle the publish status
                const isToggled = yield this._adminRepository.togglePublish(faqId);
                // Return the result from the repository
                return isToggled;
            }
            catch (error) {
                // Re-throw the error if it's an instance of AppError (custom application error)
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    // Re-throw unexpected errors for further handling
                    throw error;
                }
            }
        });
    }
    /**
     * Updates an FAQ entry with the provided partial data.
     *
     * This function delegates the update operation to the repository layer and returns
     * a boolean indicating whether the update was successful (i.e., if the FAQ exists and was modified).
     *
     * @param {string} faqId - The unique identifier of the FAQ to update.
     * @param {Partial<IFaq>} updatedData - An object containing the fields to update.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the FAQ was successfully updated,
     *                             or `false` if no matching FAQ was found or the update failed.
     *
     * @throws {ServerError} If an internal server error occurs during the update process.
     * @throws {AppError} If a known application-specific error occurs.
     * @throws {Error} If an unexpected or unhandled error occurs.
     */
    updateFaq(faqId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the repository method to update the FAQ
                const isUpdated = yield this._adminRepository.updateFaq(faqId, updatedData);
                // Return the result from the repository
                return isUpdated;
            }
            catch (error) {
                // Re-throw the error if it's an instance of AppError (custom application error)
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    // Re-throw unexpected errors for further handling
                    throw error;
                }
            }
        });
    }
    /**
     * Fetches the count of new registrations from the database.
     *
     * @returns A promise that resolves to the count of new registrations (`number`).
     * @throws {ServerError} If fetching the count fails in the repository.
     * @throws {AppError} If any application-specific error occurs.
     * @throws {Error} If an unexpected error occurs.
     */
    getNewRegistrationCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the repository method to fetch the count of new registrations
                const count = yield this._adminRepository.getNewRegistrationCount();
                // Validate the result; throw an error if the count is not a number or the operation failed
                if (typeof count !== 'number') {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.FAILED_TO_FETCH_REGISTRATION_COUNT, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
                // Return the fetched count of new registrations
                return count;
            }
            catch (error) {
                // Re-throw the error if it's an instance of AppError (custom application error)
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    // Re-throw unexpected errors for further handling
                    throw error;
                }
            }
        });
    }
    /**
     * Performs a composite health check by evaluating the health of multiple system components
     * such as external APIs, MongoDB, Redis, and the server itself.
     *
     * @returns A promise that resolves to a composite health check result (`IHealthCheck`).
     * @throws {ServerError} If a repository or infrastructure error occurs during the health check.
     * @throws {AppError} If an application-specific error occurs.
     * @throws {Error} If an unexpected error occurs.
     */
    getHealthStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = new composite_health_1.CompositeHealthCheckService([
                    new api_health_1.ExternalApiHealthCheckService('http://localhost:5000/'),
                    new mongodb_health_1.MongoDbHealthCheckService(),
                    new redis_health_1.RedisHealthCheckService(),
                    new server_health_1.ServerHealthCheckService(),
                ]);
                const healthCheckResult = yield response.check();
                return healthCheckResult;
            }
            catch (error) {
                // Re-throw the error if it's an instance of AppError (custom application error)
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    // Re-throw unexpected errors for further handling
                    throw error;
                }
            }
        });
    }
    /**
     * Retrieves system metrics by querying the admin repository.
     * This may include various performance or operational metrics from underlying systems.
     *
     * @returns A promise that resolves to the system metrics object (`ISystemMetrics`).
     * @throws {ServerError} If a repository or infrastructure error occurs during the fetch.
     * @throws {AppError} If an application-specific error is thrown by the repository.
     * @throws {Error} If an unexpected error occurs.
     */
    getSystemMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._adminRepository.getSystemMetrics();
                return data;
            }
            catch (error) {
                // Re-throw the error if it's an instance of AppError (custom application error)
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    // Re-throw unexpected errors for further handling
                    throw error;
                }
            }
        });
    }
}
exports.default = AdminService;
