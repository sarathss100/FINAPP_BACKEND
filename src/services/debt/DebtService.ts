import { decodeAndValidateToken } from '../../utils/auth/tokenUtils';
import { AuthenticationError } from '../../error/AppError';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import IDebtService from './interfaces/IDebtService';
import DebtManagementRepository from '../../repositories/debt/DebtManagementRepository';
import { IDebtDTO } from '../../dtos/debt/DebtDto';
import IDebtRepository from '../../repositories/debt/interfaces/IDebtRepository';
import calculateLoanBreakdown from '../../utils/debt/emiCalculator';
import { calculateLoanClosingMonth, calculateNextDueDate } from '../../utils/debt/dueDateCalculator';
import { categorizeDebt } from '../../utils/debt/debtCategorizer';
import { compareStrategies, ComparisonResult } from '../../utils/debt/simulateResult';
import { eventBus } from '../../events/eventBus';

class DebtService implements IDebtService {
    private static _instance: DebtService;
    private _debtManagementRepository: IDebtRepository;

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

    // Creates a new debt record for the authenticated user.
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

            delete refinedData._id;

            // Delegate to the repository to create the debt record
            const debtDetails = await this._debtManagementRepository.createDebt(refinedData, userId);

            // Emit socket event to notify user about debt Creation
            eventBus.emit('debt_created', debtDetails);

            return debtDetails;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error creating debt:', error);
            throw new Error((error as Error).message);
        }
    }

    // Calculates the total outstanding debt for the authenticated user.
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

    // Calculates the total outstanding debt for the authenticated user.
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

    // Calculates the total monthly payment across all active debts for the authenticated user.
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

    // Calculates the longest difference in months between the end date of any active debt 
    // and the current date for the authenticated user.
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

    // Retrieves debts categorized as either 'Good Debt' or 'Bad Debt' for the authenticated user.
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

    // Compares debt repayment strategies (e.g., Avalanche vs Snowball) for the authenticated user.
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

    // Retrieves all active debts associated with the authenticated user.
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

    // Deletes a specific debt record by its ID.
    async deleteDebt(debtId: string): Promise<boolean> {
        try {
            // Delegate to the repository to delete the debt
            const removedDebt = await this._debtManagementRepository.deleteDebt(debtId);

            // Emit socket event to notify user about debt Creation
            eventBus.emit('debt_removed', removedDebt);
        
            return removedDebt._id ? true : false;
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error deleting debt:', error);
            throw new Error((error as Error).message);
        }
    }

    // Updates the expiry status for debts with a past nextDueDate.
    async updateExpiry(): Promise<void> {
        try {
            await this._debtManagementRepository.updateExpiry();
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error updating debt expiry:', error);
            throw new Error((error as Error).message);
        }
    }

    // Marks debts as completed if their end date has passed.
    async markEndedDebtsAsCompleted(): Promise<void> {
        try {
            await this._debtManagementRepository.markEndedDebtsAsCompleted();
        } catch (error) {
            // Log and rethrow the error for upstream handling
            console.error('Error updating ended debts as completed:', error);
            throw new Error((error as Error).message);
        }
    }

    // Marks a specific debt as paid by updating its next due date and resetting the expired flag.
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

    // Retrieves debts that need to be checked for upcoming payment notifications.
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
