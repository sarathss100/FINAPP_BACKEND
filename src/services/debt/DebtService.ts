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
                interestRate: debtData.interestRate,
                interestType: debtData.interestType,
                targetMonth: 1,
            });

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
}

export default DebtService;
