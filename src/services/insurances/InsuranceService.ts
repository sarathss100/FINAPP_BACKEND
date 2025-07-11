import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
import { AuthenticationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import IInsuranceService from './interfaces/IInsuranceService';
import InsuranceManagementRepository from 'repositories/insurances/InsuranceManagementRepository';
import { InsuranceDTO } from 'dtos/insurances/insuranceDTO';
import IInsuranceManagementRepository from 'repositories/insurances/interfaces/IInsuranceManagementRepository';

class InsuranceService implements IInsuranceService {
    private static _instance: InsuranceService;
    private _insuranceRepository: IInsuranceManagementRepository;

    constructor(insuranceRepository: IInsuranceManagementRepository) {
        this._insuranceRepository = insuranceRepository;
    }

    public static get instance(): InsuranceService {
        if (!InsuranceService._instance) {
            const repo = InsuranceManagementRepository.instance;
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
    async createInsurance(accessToken: string, insuranceData: InsuranceDTO): Promise<InsuranceDTO> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            const refinedData = { ...insuranceData, status: insuranceData.payment_status === 'paid' ? 'active' : 'expired' };

            // Delegate to the repository to create the insurance record
            const insuranceDetails = await this._insuranceRepository.createInsurance(refinedData, userId);

            return insuranceDetails;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error creating insurance:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Removes an existing insurance record from the database.
     *
     * @param {string} insuranceId - The ID of the insurance record to be deleted.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the insurance was successfully deleted, or `false` if not found.
     * @throws {Error} If an unexpected error occurs during the deletion process.
     */
    async removeInsurance(insuranceId: string): Promise<boolean> {
        try {
            // Delegate to the repository to delete the insurance record
            const isRemoved = await this._insuranceRepository.removeInsurance(insuranceId);

            return isRemoved;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error deleting insurance:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Calculates the total coverage amount from all active insurance policies for the authenticated user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @returns {Promise<number>} A promise resolving to the total coverage amount of active insurance policies.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs during the coverage calculation process.
     */
    async getUserInsuranceCoverageTotal(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository to calculate the total insurance coverage
            const totalInsuranceCoverage = await this._insuranceRepository.getUserInsuranceCoverageTotal(userId);
        
            return totalInsuranceCoverage;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error calculating insurance coverage:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Calculates the total premium amount from all active insurance policies for the authenticated user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @returns {Promise<number>} A promise resolving to the total premium amount of active insurance policies.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs during the premium calculation process.
     */
    async getUserTotalPremiumAmount(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository to calculate the total insurance premium
            const totalPremium = await this._insuranceRepository.getUserTotalPremiumAmount(userId);
        
            return totalPremium;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error calculating insurance premium:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves all insurance records for the authenticated user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @returns {Promise<InsuranceDTO[]>} A promise resolving to an array of insurance DTOs belonging to the user.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs during data retrieval.
     */
    async getAllInsurances(accessToken: string): Promise<InsuranceDTO[]> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository to fetch all insurance records for the user
            const insuranceDetails = await this._insuranceRepository.getAllInsurances(userId);
        
            return insuranceDetails;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error fetching insurance records:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves the closest upcoming next payment date among all insurance records for the authenticated user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @returns {Promise<Date | null>} A promise resolving to the closest upcoming next payment date, or null if none exist.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs during data retrieval.
     */
    async getClosestNextPaymentDate(accessToken: string): Promise<InsuranceDTO | null> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository to fetch the closest next payment date for the user
            const insurance = await this._insuranceRepository.getClosestNextPaymentDate(userId);
        
            return insurance;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error fetching closest next payment date:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Marks the payment status of the specified insurance policy as paid.
     *
     * @param {string} insuranceId - The ID of the insurance policy to update.
     * @returns {Promise<boolean>} A promise resolving to true if the payment status was successfully updated, false otherwise.
     * @throws {Error} If an unexpected error occurs during the update operation.
     */
    async markPaymentAsPaid(insuranceId: string): Promise<boolean> {
        try {
            // Delegate the update operation to the repository
            const isPaymentStatusUpdated = await this._insuranceRepository.markPaymentAsPaid(insuranceId);
        
            return isPaymentStatusUpdated;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error updating insurance payment status:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Marks expired insurance policies by delegating the operation to the repository.
     * This typically involves updating policies whose next payment date has passed and are still active.
     *
     * @returns {Promise<void>} A promise that resolves when the expiration operation is complete.
     * @throws {Error} If an unexpected error occurs during the update operation.
     */
    async markExpired(): Promise<void> {
        try {
            // Delegate the update operation to the repository
            await this._insuranceRepository.markExpiredInsurances();
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error updating insurance payment status:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves insurance policies that require payment notifications.
     * This typically includes policies where the next payment date is approaching or overdue.
     *
     * @returns {Promise<InsuranceDTO[]>} A promise that resolves with a list of insurance policies requiring payment attention.
     * @throws {Error} If an unexpected error occurs during the fetch operation.
     */
    async getInsuranceForNotifyInsurancePayments(): Promise<InsuranceDTO[]> {
        try {
            // Delegate the fetch operation to the repository
            const insurances = await this._insuranceRepository.getInsuranceForNotifyInsurancePayments();

            return insurances;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error fetching insurance records for payment notification:', error);
            throw new Error((error as Error).message);
        }
    }
}

export default InsuranceService;
