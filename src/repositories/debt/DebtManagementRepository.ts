import mongoose from 'mongoose';
import { IDebtDTO } from 'dtos/debt/DebtDto';
import IDebtRepository from './interfaces/IDebtRepository';
import { DebtModel } from 'model/debt/model/DebtModel';

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
}

export default DebtManagementRepository;
