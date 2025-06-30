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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenUtils_1 = require("utils/auth/tokenUtils");
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const InsuranceManagementRepository_1 = __importDefault(require("repositories/insurances/InsuranceManagementRepository"));
/**
 * Service class for managing insurance records.
 * Handles business logic and authentication before delegating database operations to the repository.
 */
class InsuranceService {
    /**
     * Constructs a new instance of the InsuranceService.
     *
     * @param {InsuranceManagementRepository} insuranceRepository - The repository used for interacting with insurance data.
     */
    constructor(insuranceRepository) {
        this._insuranceRepository = insuranceRepository;
    }
    static get instance() {
        if (!InsuranceService._instance) {
            const repo = InsuranceManagementRepository_1.default.instance;
            InsuranceService._instance = new InsuranceService(repo);
        }
        return InsuranceService._instance;
    }
    /**
     * Creates a new insurance record for the authenticated user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @param {InsuranceDTO} insuranceData - The validated insurance data required to create a new insurance record.
     * @returns {Promise<InsuranceDTO>} A promise that resolves with the created insurance object.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs during the insurance creation process.
     */
    createInsurance(accessToken, insuranceData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                const refinedData = Object.assign(Object.assign({}, insuranceData), { status: insuranceData.payment_status === 'paid' ? 'active' : 'expired' });
                // Delegate to the repository to create the insurance record
                const insuranceDetails = yield this._insuranceRepository.createInsurance(refinedData, userId);
                return insuranceDetails;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error creating insurance:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Removes an existing insurance record from the database.
     *
     * @param {string} insuranceId - The ID of the insurance record to be deleted.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the insurance was successfully deleted, or `false` if not found.
     * @throws {Error} If an unexpected error occurs during the deletion process.
     */
    removeInsurance(insuranceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delegate to the repository to delete the insurance record
                const isRemoved = yield this._insuranceRepository.removeInsurance(insuranceId);
                return isRemoved;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error deleting insurance:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Calculates the total coverage amount from all active insurance policies for the authenticated user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @returns {Promise<number>} A promise resolving to the total coverage amount of active insurance policies.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs during the coverage calculation process.
     */
    getUserInsuranceCoverageTotal(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository to calculate the total insurance coverage
                const totalInsuranceCoverage = yield this._insuranceRepository.getUserInsuranceCoverageTotal(userId);
                return totalInsuranceCoverage;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error calculating insurance coverage:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Calculates the total premium amount from all active insurance policies for the authenticated user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @returns {Promise<number>} A promise resolving to the total premium amount of active insurance policies.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs during the premium calculation process.
     */
    getUserTotalPremiumAmount(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository to calculate the total insurance premium
                const totalPremium = yield this._insuranceRepository.getUserTotalPremiumAmount(userId);
                return totalPremium;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error calculating insurance premium:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Retrieves all insurance records for the authenticated user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @returns {Promise<InsuranceDTO[]>} A promise resolving to an array of insurance DTOs belonging to the user.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs during data retrieval.
     */
    getAllInsurances(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository to fetch all insurance records for the user
                const insuranceDetails = yield this._insuranceRepository.getAllInsurances(userId);
                return insuranceDetails;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error fetching insurance records:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Retrieves the closest upcoming next payment date among all insurance records for the authenticated user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @returns {Promise<Date | null>} A promise resolving to the closest upcoming next payment date, or null if none exist.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs during data retrieval.
     */
    getClosestNextPaymentDate(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository to fetch the closest next payment date for the user
                const insurance = yield this._insuranceRepository.getClosestNextPaymentDate(userId);
                return insurance;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error fetching closest next payment date:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Marks the payment status of the specified insurance policy as paid.
     *
     * @param {string} insuranceId - The ID of the insurance policy to update.
     * @returns {Promise<boolean>} A promise resolving to true if the payment status was successfully updated, false otherwise.
     * @throws {Error} If an unexpected error occurs during the update operation.
     */
    markPaymentAsPaid(insuranceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delegate the update operation to the repository
                const isPaymentStatusUpdated = yield this._insuranceRepository.markPaymentAsPaid(insuranceId);
                return isPaymentStatusUpdated;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error updating insurance payment status:', error);
                throw new Error(error.message);
            }
        });
    }
    /**
     * Marks expired insurance policies by delegating the operation to the repository.
     * This typically involves updating policies whose next payment date has passed and are still active.
     *
     * @returns {Promise<void>} A promise that resolves when the expiration operation is complete.
     * @throws {Error} If an unexpected error occurs during the update operation.
     */
    markExpired() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delegate the update operation to the repository
                yield this._insuranceRepository.markExpiredInsurances();
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error updating insurance payment status:', error);
                throw new Error(error.message);
            }
        });
    }
}
exports.default = InsuranceService;
