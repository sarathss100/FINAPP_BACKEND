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
const DebtManagementRepository_1 = __importDefault(require("repositories/debt/DebtManagementRepository"));
const emiCalculator_1 = __importDefault(require("utils/debt/emiCalculator"));
const dueDateCalculator_1 = require("utils/debt/dueDateCalculator");
const debtCategorizer_1 = require("utils/debt/debtCategorizer");
const simulateResult_1 = require("utils/debt/simulateResult");
/**
 * Service class for managing debt records.
 * Handles business logic and authentication before delegating database operations to the repository.
 */
class DebtService {
    /**
     * Constructs a new instance of the DebtService.
     *
     * @param {IDebtRepository} debtRepository - The repository used for interacting with debt data.
     */
    constructor(debtManagementRepository) {
        this._debtManagementRepository = debtManagementRepository;
    }
    static get instance() {
        if (!DebtService._instance) {
            const repo = DebtManagementRepository_1.default.instance;
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
    createDebt(accessToken, debtData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                const monthlyPayment = yield (0, emiCalculator_1.default)({
                    initialAmount: debtData.initialAmount,
                    tenureMonths: debtData.tenureMonths,
                    interestRate: debtData.interestRate,
                    interestType: debtData.interestType,
                    targetMonth: 1,
                });
                const loanClosingMonth = (0, dueDateCalculator_1.calculateLoanClosingMonth)(debtData.startDate, debtData.tenureMonths);
                const nextDueDate = (0, dueDateCalculator_1.calculateNextDueDate)(debtData.startDate);
                const isGoodDebt = (0, debtCategorizer_1.categorizeDebt)(debtData.debtName);
                const refinedData = Object.assign(Object.assign({}, debtData), { monthlyPayment: monthlyPayment.emi, monthlyPrincipalPayment: monthlyPayment.principal, montlyInterestPayment: monthlyPayment.interest, nextDueDate, endDate: loanClosingMonth, currentBalance: debtData.initialAmount, isGoodDebt });
                // Delegate to the repository to create the debt record
                const debtDetails = yield this._debtManagementRepository.createDebt(refinedData, userId);
                return debtDetails;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error creating debt:', error);
                throw new Error(error.message);
            }
        });
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
    getTotalDebt(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository to calculate the total outstanding debt
                const totalDebt = yield this._debtManagementRepository.getTotalDebt(userId);
                return totalDebt;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error fetching total outstanding debt:', error);
                throw new Error(error.message);
            }
        });
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
    getTotalOutstandingDebt(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository to calculate the total outstanding debt
                const totalOutstandingDebt = yield this._debtManagementRepository.getTotalOutstandingDebt(userId);
                return totalOutstandingDebt;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error fetching total outstanding debt:', error);
                throw new Error(error.message);
            }
        });
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
    getTotalMonthlyPayment(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository to calculate the total monthly payment
                const totalMonthlyPayment = yield this._debtManagementRepository.getTotalMonthlyPayment(userId);
                return totalMonthlyPayment;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error fetching total monthly payment:', error);
                throw new Error(error.message);
            }
        });
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
    getLongestTenure(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository to calculate the max tenure
                const maxTenure = yield this._debtManagementRepository.getLongestTenure(userId);
                return maxTenure;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error fetching longest tenure:', error);
                throw new Error(error.message);
            }
        });
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
    getDebtCategorized(accessToken, category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository to fetch categorized debts
                const debtDetails = yield this._debtManagementRepository.getDebtCategorized(userId, category);
                return debtDetails;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error fetching categorized debts:', error);
                throw new Error(error.message);
            }
        });
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
    getRepaymentStrategyComparison(accessToken, extraAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository to fetch categorized debts
                const debtDetails = yield this._debtManagementRepository.getRepaymentStrategyComparison(userId);
                // Simulate Repayment and get the comparison result
                const comparisonResult = yield (0, simulateResult_1.compareStrategies)(debtDetails, extraAmount);
                return comparisonResult;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error fetching and comparing repayment strategies:', error);
                throw new Error(error.message);
            }
        });
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
    getAllDebts(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Delegate to the repository to fetch categorized debts
                const debtDetails = yield this._debtManagementRepository.getAllDebts(userId);
                return debtDetails;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error fetching debts:', error);
                throw new Error(error.message);
            }
        });
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
    deleteDebt(debtId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delegate to the repository to delete the debt
                const isDeleted = yield this._debtManagementRepository.deleteDebt(debtId);
                return isDeleted;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error deleting debt:', error);
                throw new Error(error.message);
            }
        });
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
    updateExpiry() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._debtManagementRepository.updateExpiry();
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error updating debt expiry:', error);
                throw new Error(error.message);
            }
        });
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
    markEndedDebtsAsCompleted() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._debtManagementRepository.markEndedDebtsAsCompleted();
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error updating ended debts as completed:', error);
                throw new Error(error.message);
            }
        });
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
    markAsPaid(debtId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delegate to the repository to mark the debt as paid
                const markAsPaid = yield this._debtManagementRepository.markAsPaid(debtId);
                return markAsPaid;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error marking debt as paid:', error);
                throw new Error(error.message);
            }
        });
    }
}
exports.default = DebtService;
