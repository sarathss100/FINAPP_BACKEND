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
const mongoose_1 = __importDefault(require("mongoose"));
const DebtModel_1 = require("model/debt/model/DebtModel");
const emiCalculator_1 = __importDefault(require("utils/debt/emiCalculator"));
/**
 * @class DebtManagementRepository
 * @description Repository class responsible for handling database operations related to debts.
 */
class DebtManagementRepository {
    /**
     * Private constructor to enforce singleton pattern.
     */
    constructor() { }
    /**
     * Gets the singleton instance of DebtManagementRepository.
     *
     * @returns {DebtManagementRepository}
     */
    static get instance() {
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
    createDebt(debtData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mongooseUserId = new mongoose_1.default.Types.ObjectId(userId);
                const result = yield DebtModel_1.DebtModel.create(Object.assign(Object.assign({}, debtData), { userId: mongooseUserId }));
                const refinedData = {
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
            }
            catch (error) {
                console.error('Error creating debt:', error);
                throw new Error(`Failed to create debt: ${error.message}`);
            }
        });
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
    getTotalDebt(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield DebtModel_1.DebtModel.aggregate([
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
                return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalDebt) || 0;
            }
            catch (error) {
                console.error('Error fetching total outstanding debt:', error);
                throw new Error(`Failed to calculate outstanding debt: ${error.message}`);
            }
        });
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
    getTotalOutstandingDebt(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield DebtModel_1.DebtModel.aggregate([
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
                return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalOutstanding) || 0;
            }
            catch (error) {
                console.error('Error fetching total outstanding debt:', error);
                throw new Error(`Failed to calculate outstanding debt: ${error.message}`);
            }
        });
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
    getTotalMonthlyPayment(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield DebtModel_1.DebtModel.aggregate([
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
                return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalMonthlyPayment) || 0;
            }
            catch (error) {
                console.error('Error fetching total monthly payment:', error);
                throw new Error(`Failed to calculate total monthly payment: ${error.message}`);
            }
        });
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
    getLongestTenure(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield DebtModel_1.DebtModel.aggregate([
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
                return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.maxTenureDifference) || 0;
            }
            catch (error) {
                console.error('Error fetching total monthly payment:', error);
                throw new Error(`Failed to calculate total monthly payment: ${error.message}`);
            }
        });
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
    getDebtCategorized(userId, category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isGoodDebt = category.toLowerCase() === 'good';
                const result = yield DebtModel_1.DebtModel.aggregate([
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
            }
            catch (error) {
                console.error('Error fetching categorized debts:', error);
                throw new Error(`Failed to fetch categorized debts: ${error.message}`);
            }
        });
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
    getRepaymentStrategyComparison(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield DebtModel_1.DebtModel.aggregate([
                    {
                        $match: {
                            userId,
                            isCompleted: false,
                            isDeleted: false,
                        }
                    }
                ]);
                // Map raw result to simplified Debt interface
                const refinedData = result.map((debt) => {
                    var _a, _b;
                    return ({
                        name: debt.debtName,
                        principal: debt.initialAmount,
                        currentBalance: (_a = debt.currentBalance) !== null && _a !== void 0 ? _a : debt.initialAmount,
                        interestRate: debt.interestRate,
                        interestType: debt.interestType,
                        monthlyPayment: (_b = debt.monthlyPayment) !== null && _b !== void 0 ? _b : 0,
                        tenureMonths: debt.tenureMonths
                    });
                });
                return refinedData;
            }
            catch (error) {
                console.error('Error fetching and refining debts:', error);
                throw new Error(`Failed to fetch debts for repayment strategy: ${error.message}`);
            }
        });
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
    getAllDebts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Use MongoDB aggregation to find debts matching the provided userId
                const result = yield DebtModel_1.DebtModel.aggregate([
                    {
                        $match: {
                            userId, // Match only debts belonging to the specified user
                            isDeleted: false
                        }
                    }
                ]);
                // Return the filtered list of debts
                return result;
            }
            catch (error) {
                // Log the raw error for debugging purposes
                console.error('Error fetching and refining debts:', error);
                // Throw a new, user-friendly error with context
                throw new Error(`Failed to fetch debts for repayment strategy: ${error.message}`);
            }
        });
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
    deleteDebt(debtId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Update the debt document by setting isDeleted to true
                const result = yield DebtModel_1.DebtModel.findByIdAndUpdate(debtId, { $set: { isDeleted: true } }, { new: true } // Optional: return updated document
                );
                // Return true if the debt was found and updated; false otherwise
                return !!result;
            }
            catch (error) {
                // Log the raw error for debugging purposes
                console.error('Error during debt deletion:', error);
                // Throw a new, user-friendly error with context
                throw new Error(`Failed to delete debt: ${error.message}`);
            }
        });
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
    updateExpiry() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                // Find all active, non-deleted debts where nextDueDate is in the past and not yet expired 
                const expiredDebts = yield DebtModel_1.DebtModel.find({
                    isDeleted: false,
                    isCompleted: false,
                    status: 'Active',
                    nextDueDate: { $lt: now },
                    isExpired: { $ne: true }, // Only update if not already expired 
                });
                if (expiredDebts.length > 0) {
                    // Update all expired debts 
                    yield DebtModel_1.DebtModel.updateMany({ _id: { $in: expiredDebts.map(debt => debt._id) } }, { $set: { isExpired: true } });
                }
            }
            catch (error) {
                // Log the raw error for debugging purposes
                console.error('Error during debt expiry update:', error);
                // Throw a new, user-friendly error with context
                throw new Error(`Failed to update debt expiry status: ${error.message}`);
            }
        });
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
    markEndedDebtsAsCompleted() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                // Find all active, non-deleted, and non-completed debts where endDate is in the past
                const endedDebts = yield DebtModel_1.DebtModel.find({
                    isDeleted: false,
                    isCompleted: false,
                    status: 'Active',
                    endDate: { $lt: now },
                    isExpired: { $ne: true }, // Only update if not already expired
                });
                if (endedDebts.length > 0) {
                    // Update all ended debts to completed status
                    yield DebtModel_1.DebtModel.updateMany({ _id: { $in: endedDebts.map(debt => debt._id) } }, {
                        $set: {
                            isExpired: false,
                            isCompleted: true,
                            status: 'Completed'
                        }
                    });
                }
            }
            catch (error) {
                // Log the raw error for debugging purposes
                console.error('Error during debt completion update:', error);
                // Throw a new, user-friendly error with context
                throw new Error(`Failed to update ended debts: ${error.message}`);
            }
        });
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
    markAsPaid(debtId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get current nextDueDate from the document
                const debt = yield DebtModel_1.DebtModel.findById({ _id: debtId });
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
                    const nextEmi = yield (0, emiCalculator_1.default)({ initialAmount, tenureMonths, interestRate, interestType, targetMonth: monthsElapsed });
                    // Update the document 
                    result = yield DebtModel_1.DebtModel.findByIdAndUpdate(debtId, {
                        $set: {
                            nextDueDate: nextMonthDueDate,
                            isExpired: false,
                            monthlyPayment: nextEmi.emi,
                            monthlyPrincipalPayment: nextEmi.principal,
                            montlyInterestPayment: nextEmi.interest,
                        }
                    }, { new: true });
                }
                else {
                    // Update the document 
                    result = yield DebtModel_1.DebtModel.findByIdAndUpdate(debtId, {
                        $set: {
                            nextDueDate: nextMonthDueDate,
                            isExpired: false
                        }
                    }, { new: true });
                }
                // Return true if the debt was found and updated; false otherwise
                return !!result;
            }
            catch (error) {
                // Log the raw error for debugging purposes
                console.error('Error during debt completion update:', error);
                // Throw a new, user-friendly error with context
                throw new Error(`Failed to update ended debts: ${error.message}`);
            }
        });
    }
}
exports.default = DebtManagementRepository;
