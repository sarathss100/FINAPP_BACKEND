import mongoose from 'mongoose';
import { IDebtDTO } from 'dtos/debt/DebtDto';
import IDebtRepository from './interfaces/IDebtRepository';
import { DebtModel } from 'model/debt/model/DebtModel';
import { Debt } from 'utils/debt/simulateResult';
import calculateLoanBreakdown from 'utils/debt/emiCalculator';

/**
 * @class DebtManagementRepository
 * @description Repository class responsible for handling database operations related to debts.
 */
class DebtManagementRepository implements IDebtRepository {
    private static _instance: DebtManagementRepository;

    /**
     * Private constructor to enforce singleton pattern.
     */
    public constructor() {}

    /**
     * Gets the singleton instance of DebtManagementRepository.
     *
     * @returns {DebtManagementRepository}
     */
    public static get instance(): DebtManagementRepository {
        if (!DebtManagementRepository._instance) {
            DebtManagementRepository._instance = new DebtManagementRepository();
        }
        return DebtManagementRepository._instance;
    }

    /**
     * Creates a new debt record in the database.
     *
     * @param {IDebtDTO} debtData - The validated debt data from the frontend.
     * @param {string} userId - The ID of the user creating the debt (as a string).
     * @returns {Promise<IDebtDTO>} - A promise resolving to the created debt data.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async createDebt(debtData: IDebtDTO, userId: string): Promise<IDebtDTO> {
        try {
            const mongooseUserId = new mongoose.Types.ObjectId(userId);

            const result = await DebtModel.create({ ...debtData, userId: mongooseUserId });

            const refinedData: IDebtDTO = {
                _id: String(result._id),
                userId: String(result.userId),
                accountId: result.accountId ? String(result.accountId) : result.accountId,
                debtName: result.debtName,
                initialAmount: result.initialAmount,
                currency: result.currency,
                interestRate: result.interestRate,
                interestType: result.interestType,
                tenureMonths: result.tenureMonths,
                monthlyPayment: result.monthlyPayment,
                monthlyPrincipalPayment: result.monthlyPrincipalPayment,
                montlyInterestPayment: result.montlyInterestPayment,
                startDate: result.startDate,
                nextDueDate: result.nextDueDate,
                endDate: result.endDate,
                status: result.status,
                currentBalance: result.currentBalance,
                totalInterestPaid: result.totalInterestPaid,
                totalPrincipalPaid: result.totalPrincipalPaid,
                additionalCharges: result.additionalCharges,
                notes: result.notes,
                isDeleted: result.isDeleted,
                isGoodDebt: result.isGoodDebt,
                isCompleted: result.isCompleted,
                isExpired: result.isExpired,
            };

            return refinedData;
        } catch (error) {
            console.error('Error creating debt:', error);
            throw new Error(`Failed to create debt: ${(error as Error).message}`);
        }
    }

    /**
     * Calculates the total outstanding debt amount for a user.
     *
     * This function aggregates all active (non-completed, non-deleted) debts
     * associated with the given userId and sums up their current outstanding balances.
     * Only debts that are still active contribute to the total.
     *
     * @param {string} userId - The ID of the user whose outstanding debt is being calculated.
     * @returns {Promise<number>} - A promise resolving to the total outstanding debt amount.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getTotalDebt(userId: string): Promise<number> {
        try {
            const result = await DebtModel.aggregate([
                {
                    $match: {
                        userId,
                        isCompleted: false,
                        isDeleted: false
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalDebt: { $sum: "$initialAmount" } 
                    }
                }
            ]);

            // If no debts match, return 0 instead of undefined
            return result[0]?.totalDebt || 0;

        } catch (error) {
            console.error('Error fetching total outstanding debt:', error);
            throw new Error(`Failed to calculate outstanding debt: ${(error as Error).message}`);
        }
    }

    /**
     * Calculates the total outstanding debt amount for a user.
     *
     * This function aggregates all active (non-completed, non-deleted) debts
     * associated with the given userId and sums up their current balances.
     *
     * @param {string} userId - The ID of the user whose outstanding debt is being calculated.
     * @returns {Promise<number>} - A promise resolving to the total outstanding debt amount.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getTotalOutstandingDebt(userId: string): Promise<number> {
        try {
            const result = await DebtModel.aggregate([
                {
                    $match: {
                        userId,
                        isCompleted: false,
                        isDeleted: false
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalOutstanding: { $sum: "$currentBalance" }
                    }
                }
            ]);
        
            // If no debts match, return 0 instead of undefined
            return result[0]?.totalOutstanding || 0;
        
        } catch (error) {
            console.error('Error fetching total outstanding debt:', error);
            throw new Error(`Failed to calculate outstanding debt: ${(error as Error).message}`);
        }
    }

    /**
     * Calculates the total monthly payment across all active debts for a user.
     *
     * This function aggregates all non-completed, non-deleted debts
     * associated with the given userId and sums up their monthly payment values.
     *
     * @param {string} userId - The ID of the user whose total monthly payment is being calculated.
     * @returns {Promise<number>} - A promise resolving to the total monthly payment amount.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getTotalMonthlyPayment(userId: string): Promise<number> {
        try {
            const result = await DebtModel.aggregate([
                {
                    $match: {
                        userId,
                        isCompleted: false,
                        isDeleted: false
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalMonthlyPayment: { $sum: "$monthlyPayment" }
                    }
                }
            ]);

            // If no debts match, return 0 instead of undefined
            return result[0]?.totalMonthlyPayment || 0;

        } catch (error) {
            console.error('Error fetching total monthly payment:', error);
            throw new Error(`Failed to calculate total monthly payment: ${(error as Error).message}`);
        }
    }

    /**
     * Calculates the total monthly payment across all active debts for a user.
     *
     * This function aggregates all non-completed, non-deleted debts
     * associated with the given userId and sums up their monthly payment values.
     *
     * @param {string} userId - The ID of the user whose total monthly payment is being calculated.
     * @returns {Promise<number>} - A promise resolving to the total monthly payment amount.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getLongestTenure(userId: string): Promise<number> {
        try {
            const result = await DebtModel.aggregate([
                {
                    $match: {
                        userId,
                        isCompleted: false,
                        isDeleted: false
                    }
                },
                {
                   $addFields: {
                        monthsFromEndToNow: {
                            $abs: {
                                $dateDiff: {
                                    startDate: "$endDate",
                                    endDate: "$$NOW",
                                    unit: "month"
                                }
                            }
                        }
                    }
                },
                {
                   $group: {
                     _id: null,
                     maxTenureDifference: { $max: "$monthsFromEndToNow" }
                   }
                }
            ]);

            // If no debts match, return 0 instead of undefined
            return result[0]?.maxTenureDifference || 0;

        } catch (error) {
            console.error('Error fetching total monthly payment:', error);
            throw new Error(`Failed to calculate total monthly payment: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves debts categorized as either 'Good Debt' or 'Bad Debt' for the specified user.
     *
     * This function filters active (non-completed, non-deleted) debts associated with the given userId,
     * and returns a list of debts filtered by the provided category:
     * - 'Good Debt' (isGoodDebt: true)
     * - 'Bad Debt' (isGoodDebt: false)
     *
     * @param {string} userId - The ID of the user whose debts are being categorized.
     * @param {string} category - The category to filter by ('Good Debt' or 'Bad Debt').
     * @returns {Promise<IDebtDTO[]>} A promise resolving to an array of categorized debt DTOs.
     * @throws {Error} Throws an error if the database operation fails.
     */
    async getDebtCategorized(userId: string, category: string): Promise<IDebtDTO[]> {
        try {
            const isGoodDebt = category.toLowerCase() === 'good';
        
            const result = await DebtModel.aggregate([
                {
                    $match: {
                        userId,
                        isCompleted: false,
                        isDeleted: false,
                        isGoodDebt
                    }
                }
            ]);
        
            return result || [];
        
        } catch (error) {
            console.error('Error fetching categorized debts:', error);
            throw new Error(`Failed to fetch categorized debts: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves all active (non-completed, non-deleted) debts for the specified user.
     *
     * This function fetches debts associated with the given userId,
     * excluding completed or deleted records, and maps them to a simplified structure
     * suitable for debt repayment strategy simulations (e.g., Avalanche vs Snowball).
     *
     * @param {string} userId - The ID of the user whose active debts are being retrieved.
     * @returns {Promise<Debt[]>} A promise resolving to an array of simplified debt objects.
     * @throws {Error} Throws an error if the database operation fails.
     */
    async getRepaymentStrategyComparison(userId: string): Promise<Debt[]> {
        try {
            const result = await DebtModel.aggregate([
                {
                    $match: {
                        userId,
                        isCompleted: false,
                        isDeleted: false,
                    }
                }
            ]);

            // Map raw result to simplified Debt interface
            const refinedData: Debt[] = result.map((debt: IDebtDTO) => ({
                name: debt.debtName,
                principal: debt.initialAmount,
                currentBalance: debt.currentBalance ?? debt.initialAmount,
                interestRate: debt.interestRate ?? 0,
                interestType: debt.interestType ?? "Flat",
                monthlyPayment: debt.monthlyPayment ?? 0,
                tenureMonths: debt.tenureMonths
            }));

            return refinedData;

        } catch (error) {
            console.error('Error fetching and refining debts:', error);
            throw new Error(`Failed to fetch debts for repayment strategy: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves all active (non-completed and non-deleted) debts for the specified user.
     *
     * This function fetches debt records associated with the given userId from the database
     * using a MongoDB aggregation pipeline. It filters out completed or deleted debts,
     * and returns them in a simplified structure suitable for use in debt repayment strategy simulations,
     * such as Avalanche or Snowball methods.
     *
     * @param {string} userId - The unique identifier of the user whose active debts are to be retrieved.
     * @returns {Promise<IDebtDTO[]>} A promise that resolves to an array of simplified debt objects (DTOs).
     * @throws {Error} If the database operation fails during aggregation, an error is thrown
     *                 with a descriptive message indicating the failure.
     */
    async getAllDebts(userId: string): Promise<IDebtDTO[]> {
        try {
            // Use MongoDB aggregation to find debts matching the provided userId
            const result = await DebtModel.aggregate([
                {
                    $match: {
                        userId, // Match only debts belonging to the specified user
                        isDeleted: false
                    }
                }
            ]);
        
            // Return the filtered list of debts
            return result;
        
        } catch (error) {
            // Log the raw error for debugging purposes
            console.error('Error fetching and refining debts:', error);
        
            // Throw a new, user-friendly error with context
            throw new Error(`Failed to fetch debts for repayment strategy: ${(error as Error).message}`);
        }
    }

    /**
     * Soft deletes a specific debt record by its ID.
     *
     * This function updates the specified debt document in the database by setting the 'isDeleted' flag to true,
     * effectively removing it from active use without permanently deleting the record.
     *
     * @param {string} debtId - The unique identifier of the debt to be soft-deleted.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the debt was successfully deleted, or `false` otherwise.
     * @throws {Error} If the database operation fails during the update, an error is thrown
     *                 with a descriptive message indicating the failure.
     */
    async deleteDebt(debtId: string): Promise<boolean> {
        try {
            // Update the debt document by setting isDeleted to true
            const result = await DebtModel.findByIdAndUpdate(
                debtId,
                { $set: { isDeleted: true } },
                { new: true } // Optional: return updated document
            );
        
            // Return true if the debt was found and updated; false otherwise
            return !!result;
        } catch (error) {
            // Log the raw error for debugging purposes
            console.error('Error during debt deletion:', error);
        
            // Throw a new, user-friendly error with context
            throw new Error(`Failed to delete debt: ${(error as Error).message}`);
        }
    }

    /**
     * Updates the expiry status of debts by marking those with past due dates as expired.
     *
     * This function checks all active, non-completed, and non-deleted debts. If their 'nextDueDate'
     * is earlier than the current date and time, they are marked with 'isExpired: true'.
     *
     * @returns {Promise<void>} A promise that resolves once the operation is complete.
     * @throws {Error} If an error occurs during the database operation, an error is thrown
     *                 with a descriptive message indicating the failure.
     */
    async updateExpiry(): Promise<void> {
        try {
            const now = new Date();
        
            // Find all active, non-deleted debts where nextDueDate is in the past and not yet expired 
            const expiredDebts = await DebtModel.find({
                isDeleted: false,
                isCompleted: false,
                status: 'Active',
                nextDueDate: { $lt: now },
                isExpired: { $ne: true }, // Only update if not already expired 
            });
        
            if (expiredDebts.length > 0) {
                // Update all expired debts 
                await DebtModel.updateMany(
                    { _id: { $in: expiredDebts.map(debt => debt._id) } },
                    { $set: { isExpired: true } },
                );
            }
            
        } catch (error) {
            // Log the raw error for debugging purposes
            console.error('Error during debt expiry update:', error);
        
            // Throw a new, user-friendly error with context
            throw new Error(`Failed to update debt expiry status: ${(error as Error).message}`);
        }
    }

    /**
     * Marks debts as completed if their end date has passed.
     *
     * This function identifies active, non-deleted, and non-completed debts whose 'endDate'
     * is earlier than the current date and time. These debts are then updated to reflect
     * a completed status by setting:
     * - isExpired: false
     * - isCompleted: true
     * - status: 'Completed'
     *
     * @returns {Promise<void>} A promise that resolves once the operation is complete.
     * @throws {Error} If an error occurs during the database operation, an error is thrown
     *                 with a descriptive message indicating the failure.
     */
    async markEndedDebtsAsCompleted(): Promise<void> {
        try {
            const now = new Date();

            // Find all active, non-deleted, and non-completed debts where endDate is in the past
            const endedDebts = await DebtModel.find({
                isDeleted: false,
                isCompleted: false,
                status: 'Active',
                endDate: { $lt: now },
                isExpired: { $ne: true }, // Only update if not already expired
            });

            if (endedDebts.length > 0) {
                // Update all ended debts to completed status
                await DebtModel.updateMany(
                    { _id: { $in: endedDebts.map(debt => debt._id) } },
                    { 
                        $set: { 
                            isExpired: false, 
                            isCompleted: true, 
                            status: 'Completed' 
                        } 
                    }
                );
            }

        } catch (error) {
            // Log the raw error for debugging purposes
            console.error('Error during debt completion update:', error);

            // Throw a new, user-friendly error with context
            throw new Error(`Failed to update ended debts: ${(error as Error).message}`);
        }
    }

    /**
     * Updates a debt's due date to the same day next month and clears the expired flag.
     *
     * This function is typically used when a user manually marks a debt as paid.
     * It finds the specified debt, updates its 'nextDueDate' to the same day of the next month,
     * and sets 'isExpired' to false.
     *
     * @param {string} debtId - The unique identifier of the debt to be updated.
     * @returns {Promise<boolean>} A promise resolving to `true` if the update was successful, or `false` otherwise.
     * @throws {Error} If an error occurs during the update process.
     */
    async markAsPaid(debtId: string): Promise<boolean> {
        try {
            // Get current nextDueDate from the document
            const debt = await DebtModel.findById({ _id: debtId });

            if (!debt) {
                throw new Error('Debt not found');
            }

            const currentDueDate = debt.nextDueDate;

            // Calculate same day next month
            const nextMonthDueDate = new Date(currentDueDate);
            nextMonthDueDate.setMonth(nextMonthDueDate.getMonth() + 1);

            // Truncate time to midnight 
            nextMonthDueDate.setHours(0, 0, 0, 0);

            let result;
            if (debt.interestType === 'Diminishing') {
                const initialAmount = debt.initialAmount;
                const tenureMonths = debt.tenureMonths;
                const interestRate = debt.interestRate;
                const interestType = debt.interestType;
                // Calculate months elapsed since loan start
                const monthsElapsed = Math.floor((nextMonthDueDate.getTime() - debt.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

                // Recalculate next month emi if debt is diminishing 
                const nextEmi = await calculateLoanBreakdown({ initialAmount, tenureMonths, interestRate, interestType, targetMonth: monthsElapsed });

                // Update the document 
                result = await DebtModel.findByIdAndUpdate(
                    debtId,
                    {
                        $set: {
                            nextDueDate: nextMonthDueDate,
                            isExpired: false,
                            monthlyPayment: nextEmi.emi,
                            monthlyPrincipalPayment: nextEmi.principal,
                            montlyInterestPayment: nextEmi.interest,
                        }
                    },
                    { new: true }
                );
            } else {
                // Update the document 
                result = await DebtModel.findByIdAndUpdate(
                    debtId,
                    {
                        $set: {
                            nextDueDate: nextMonthDueDate,
                            isExpired: false
                        }
                    },
                    { new: true }
                );
            }
            // Return true if the debt was found and updated; false otherwise
            return !!result;
        } catch (error) {
            // Log the raw error for debugging purposes
            console.error('Error during debt completion update:', error);

            // Throw a new, user-friendly error with context
            throw new Error(`Failed to update ended debts: ${(error as Error).message}`);
        }
    }
}

export default DebtManagementRepository;
