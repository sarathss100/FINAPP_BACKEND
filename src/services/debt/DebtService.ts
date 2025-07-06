import { decodeAndValidateToken } from 'utils/auth/tokenUtils';
import { AuthenticationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';
import IDebtService from './interfaces/IDebtService';
import DebtManagementRepository from 'repositories/debt/DebtManagementRepository';
import { IDebtDTO } from 'dtos/debt/DebtDto';
import IDebtRepository from 'repositories/debt/interfaces/IDebtRepository';
import calculateLoanBreakdown from 'utils/debt/emiCalculator';
import { calculateLoanClosingMonth, calculateNextDueDate } from 'utils/debt/dueDateCalculator';
import { categorizeDebt } from 'utils/debt/debtCategorizer';
import { compareStrategies, ComparisonResult } from 'utils/debt/simulateResult';

/**
 * Service class for managing debt records.
 * Handles business logic and authentication before delegating database operations to the repository.
 */
class DebtService implements IDebtService {
    private static _instance: DebtService;
    private _debtManagementRepository: IDebtRepository;

    /**
     * Constructs a new instance of the DebtService.
     *
     * @param {IDebtRepository} debtRepository - The repository used for interacting with debt data.
     */
    constructor(debtManagementRepository: IDebtRepository) {
        this._debtManagementRepository = debtManagementRepository;
    }

    public static get instance(): DebtService {
        if (!DebtService._instance) {
            const repo = DebtManagementRepository.instance;
            DebtService._instance = new DebtService(repo);
        }
        return DebtService._instance;
    }

    /**
     * Creates a new debt record for the authenticated user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @param {IDebtDTO} debtData - The validated debt data required to create a new debt record.
     * @returns {Promise<IDebtDTO>} A promise that resolves with the created debt object.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs during the debt creation process.
     */
    async createDebt(accessToken: string, debtData: IDebtDTO): Promise<IDebtDTO> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }

            const monthlyPayment = await calculateLoanBreakdown({
                initialAmount: debtData.initialAmount,
                tenureMonths: debtData.tenureMonths,
                interestRate: debtData.interestRate ?? 0,
                interestType: debtData.interestType ?? 'simple',
                targetMonth: 1,
            });

            if (!debtData.startDate) {
                throw new Error('startDate is required to calculate loan closing month.');
            }
            const loanClosingMonth = calculateLoanClosingMonth(debtData.startDate, debtData.tenureMonths);
            const nextDueDate = calculateNextDueDate(debtData.startDate);
            const isGoodDebt = categorizeDebt(debtData.debtName);

            const refinedData = {
                ...debtData,
                monthlyPayment: monthlyPayment.emi,
                monthlyPrincipalPayment: monthlyPayment.principal,
                montlyInterestPayment: monthlyPayment.interest,
                nextDueDate,
                endDate: loanClosingMonth,
                currentBalance: debtData.initialAmount,
                isGoodDebt
            };

            // Delegate to the repository to create the debt record
            const debtDetails = await this._debtManagementRepository.createDebt(refinedData, userId);

            return debtDetails;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error creating debt:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Calculates the total outstanding debt for the authenticated user.
     *
     * This function decodes the provided JWT access token to extract the user ID,
     * then retrieves the sum of current balances from all active debts associated with that user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @returns {Promise<number>} A promise that resolves to the total outstanding debt amount.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs while fetching the outstanding debt.
     */
    async getTotalDebt(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository to calculate the total outstanding debt
            const totalDebt = await this._debtManagementRepository.getTotalDebt(userId);
        
            return totalDebt;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error fetching total outstanding debt:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Calculates the total outstanding debt for the authenticated user.
     *
     * This function decodes the provided JWT access token to extract the user ID,
     * then retrieves the sum of current balances from all active debts associated with that user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @returns {Promise<number>} A promise that resolves to the total outstanding debt amount.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs while fetching the outstanding debt.
     */
    async getTotalOutstandingDebt(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository to calculate the total outstanding debt
            const totalOutstandingDebt = await this._debtManagementRepository.getTotalOutstandingDebt(userId);
        
            return totalOutstandingDebt;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error fetching total outstanding debt:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Calculates the total monthly payment across all active debts for the authenticated user.
     *
     * This function decodes the provided JWT access token to extract the user ID,
     * then retrieves and sums up the monthly payment values from all active (non-completed,
     * non-deleted) debts associated with that user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @returns {Promise<number>} A promise that resolves to the total monthly payment amount.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs while fetching the monthly payment data.
     */
    async getTotalMonthlyPayment(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository to calculate the total monthly payment
            const totalMonthlyPayment = await this._debtManagementRepository.getTotalMonthlyPayment(userId);
        
            return totalMonthlyPayment;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error fetching total monthly payment:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Calculates the longest difference in months between the end date of any active debt 
     * and the current date for the authenticated user.
     *
     * This function decodes the provided JWT access token to extract the user ID,
     * then retrieves all active (non-completed, non-deleted) debts associated with that user.
     * It computes the number of months from each debt's endDate to the current date,
     * and returns the maximum value found. If there are no matching debts, it returns 0.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @returns {Promise<number>} A promise that resolves to the maximum number of months 
     *                          from the end date of any active debt to the current date.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs while fetching the tenure data.
     */
    async getLongestTenure(accessToken: string): Promise<number> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository to calculate the max tenure
            const maxTenure = await this._debtManagementRepository.getLongestTenure(userId);
        
            return maxTenure;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error fetching longest tenure:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves debts categorized as either 'Good Debt' or 'Bad Debt' for the authenticated user.
     *
     * This function decodes the provided JWT access token to extract the user ID,
     * then fetches all active (non-completed, non-deleted) debts associated with that user,
     * filtered by the specified category ('Good Debt' or 'Bad Debt').
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @param {string} category - The category to filter debts by ('Good Debt' or 'Bad Debt').
     * @returns {Promise<IDebtDTO[]>} A promise resolving to an array of debt DTOs matching the category.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs while fetching the categorized debts.
     */
    async getDebtCategorized(accessToken: string, category: string): Promise<IDebtDTO[]> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository to fetch categorized debts
            const debtDetails = await this._debtManagementRepository.getDebtCategorized(userId, category);
        
            return debtDetails;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error fetching categorized debts:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Compares debt repayment strategies (e.g., Avalanche vs Snowball) for the authenticated user.
     *
     * This function decodes the provided JWT access token to extract the user ID,
     * fetches all active (non-completed, non-deleted) debts associated with that user,
     * and simulates both the Avalanche (highest interest first) and Snowball (lowest balance first)
     * repayment methods to generate a structured comparison of total time, interest paid, and monthly payments.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @param {number} extraAmount - The additional monthly amount to allocate toward debt repayment.
     * @returns {Promise<ComparisonResult>} A promise resolving to an object containing results from both strategies.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs during debt retrieval or simulation.
     */
    async getRepaymentStrategyComparison(accessToken: string, extraAmount: number): Promise<ComparisonResult> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository to fetch categorized debts
            const debtDetails = await this._debtManagementRepository.getRepaymentStrategyComparison(userId);
        
            // Simulate Repayment and get the comparison result
            const comparisonResult = await compareStrategies(debtDetails, extraAmount);
        
            return comparisonResult;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error fetching and comparing repayment strategies:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves all active debts associated with the authenticated user.
     *
     * This function decodes and validates the provided JWT access token to extract the user ID,
     * then fetches all non-completed and non-deleted debts linked to that user.
     *
     * @param {string} accessToken - The JWT access token used to authenticate and identify the user.
     * @returns {Promise<IDebtDTO[]>} A promise resolving to an array of debt data transfer objects.
     * @throws {AuthenticationError} If the access token is invalid or missing user information.
     * @throws {Error} If an unexpected error occurs during debt retrieval.
     */
    async getAllDebts(accessToken: string): Promise<IDebtDTO[]> {
        try {
            // Decode and validate the access token to extract the user ID
            const userId = decodeAndValidateToken(accessToken);
            if (!userId) {
                throw new AuthenticationError(ErrorMessages.USER_ID_MISSING_IN_TOKEN, StatusCodes.BAD_REQUEST);
            }
        
            // Delegate to the repository to fetch categorized debts
            const debtDetails = await this._debtManagementRepository.getAllDebts(userId);
        
            return debtDetails;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error fetching debts:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Deletes a specific debt record by its ID.
     *
     * This function delegates the deletion operation to the underlying repository,
     * which typically performs a soft delete (e.g., marking the debt as deleted).
     *
     * @param {string} debtId - The unique identifier of the debt to be deleted.
     * @returns {Promise<boolean>} A promise resolving to `true` if the deletion was successful, or `false` otherwise.
     * @throws {Error} If an error occurs during the deletion process.
     */
    async deleteDebt(debtId: string): Promise<boolean> {
        try {
            // Delegate to the repository to delete the debt
            const isDeleted = await this._debtManagementRepository.deleteDebt(debtId);
        
            return isDeleted;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error deleting debt:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Updates the expiry status for debts with a past nextDueDate.
     *
     * This function delegates the operation to the underlying repository,
     * which identifies active debts whose due date has passed and marks them as expired.
     *
     * @returns {Promise<void>} A promise that resolves when the expiry update operation is complete.
     * @throws {Error} If an error occurs during the expiry update process.
     */
    async updateExpiry(): Promise<void> {
        try {
            await this._debtManagementRepository.updateExpiry();
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error updating debt expiry:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Marks debts as completed if their end date has passed.
     *
     * This function delegates the operation to the underlying repository,
     * which identifies active debts whose 'endDate' has passed and updates them
     * to reflect a completed status (e.g., setting isCompleted: true, status: 'Completed').
     *
     * @returns {Promise<void>} A promise that resolves when the debt completion update is complete.
     * @throws {Error} If an error occurs during the update process.
     */
    async markEndedDebtsAsCompleted(): Promise<void> {
        try {
            await this._debtManagementRepository.markEndedDebtsAsCompleted();
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error updating ended debts as completed:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Marks a specific debt as paid by updating its next due date and resetting the expired flag.
     *
     * This function delegates the operation to the underlying repository,
     * which typically moves the debt's 'nextDueDate' to the next billing cycle
     * and sets 'isExpired' to false.
     *
     * @param {string} debtId - The unique identifier of the debt to be marked as paid.
     * @returns {Promise<boolean>} A promise resolving to `true` if the update was successful, or `false` otherwise.
     * @throws {Error} If an error occurs during the update process.
     */
    async markAsPaid(debtId: string): Promise<boolean> {
        try {
            // Delegate to the repository to mark the debt as paid
            const markAsPaid = await this._debtManagementRepository.markAsPaid(debtId);
        
            return markAsPaid;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error marking debt as paid:', error);
            throw new Error((error as Error).message);
        }
    }

    /**
     * Retrieves debts that need to be checked for upcoming payment notifications.
     *
     * This method fetches relevant debt records (non-deleted, non-completed) from the repository
     * to determine which users should receive a payment due notification.
     *
     * @returns {Promise<IDebtDTO[]>} A promise resolving to an array of debt DTOs that are eligible for payment alerts.
     * @throws {Error} If an error occurs while fetching debt data from the repository.
     */
    async getDebtsForNotifyUpcomingDebtPayments(): Promise<IDebtDTO[]> {
        try {
            // Fetch active debts from the repository for upcoming payment checks
            const debts = await this._debtManagementRepository.getDebtForNotifyUpcomingDebtPayments();

            return debts;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error fetching debts for upcoming payment notifications:', error);
            throw new Error((error as Error).message);
        }
    }
}

export default DebtService;
