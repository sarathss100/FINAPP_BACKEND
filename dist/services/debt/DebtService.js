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
const eventBus_1 = require("events/eventBus");
class DebtService {
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
    // Creates a new debt record for the authenticated user.
    createDebt(accessToken, debtData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // Decode and validate the access token to extract the user ID
                const userId = (0, tokenUtils_1.decodeAndValidateToken)(accessToken);
                if (!userId) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.USER_ID_MISSING_IN_TOKEN, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                const monthlyPayment = yield (0, emiCalculator_1.default)({
                    initialAmount: debtData.initialAmount,
                    tenureMonths: debtData.tenureMonths,
                    interestRate: (_a = debtData.interestRate) !== null && _a !== void 0 ? _a : 0,
                    interestType: (_b = debtData.interestType) !== null && _b !== void 0 ? _b : 'simple',
                    targetMonth: 1,
                });
                if (!debtData.startDate) {
                    throw new Error('startDate is required to calculate loan closing month.');
                }
                const loanClosingMonth = (0, dueDateCalculator_1.calculateLoanClosingMonth)(debtData.startDate, debtData.tenureMonths);
                const nextDueDate = (0, dueDateCalculator_1.calculateNextDueDate)(debtData.startDate);
                const isGoodDebt = (0, debtCategorizer_1.categorizeDebt)(debtData.debtName);
                const refinedData = Object.assign(Object.assign({}, debtData), { monthlyPayment: monthlyPayment.emi, monthlyPrincipalPayment: monthlyPayment.principal, montlyInterestPayment: monthlyPayment.interest, nextDueDate, endDate: loanClosingMonth, currentBalance: debtData.initialAmount, isGoodDebt });
                delete refinedData._id;
                // Delegate to the repository to create the debt record
                const debtDetails = yield this._debtManagementRepository.createDebt(refinedData, userId);
                // Emit socket event to notify user about debt Creation
                eventBus_1.eventBus.emit('debt_created', debtDetails);
                return debtDetails;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error creating debt:', error);
                throw new Error(error.message);
            }
        });
    }
    // Calculates the total outstanding debt for the authenticated user.
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
    // Calculates the total outstanding debt for the authenticated user.
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
    // Calculates the total monthly payment across all active debts for the authenticated user.
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
    // Calculates the longest difference in months between the end date of any active debt 
    // and the current date for the authenticated user.
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
    // Retrieves debts categorized as either 'Good Debt' or 'Bad Debt' for the authenticated user.
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
    // Compares debt repayment strategies (e.g., Avalanche vs Snowball) for the authenticated user.
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
    // Retrieves all active debts associated with the authenticated user.
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
    // Deletes a specific debt record by its ID.
    deleteDebt(debtId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delegate to the repository to delete the debt
                const removedDebt = yield this._debtManagementRepository.deleteDebt(debtId);
                // Emit socket event to notify user about debt Creation
                eventBus_1.eventBus.emit('debt_removed', removedDebt);
                return removedDebt._id ? true : false;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error deleting debt:', error);
                throw new Error(error.message);
            }
        });
    }
    // Updates the expiry status for debts with a past nextDueDate.
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
    // Marks debts as completed if their end date has passed.
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
    // Marks a specific debt as paid by updating its next due date and resetting the expired flag.
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
    // Retrieves debts that need to be checked for upcoming payment notifications.
    getDebtsForNotifyUpcomingDebtPayments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch active debts from the repository for upcoming payment checks
                const debts = yield this._debtManagementRepository.getDebtForNotifyUpcomingDebtPayments();
                return debts;
            }
            catch (error) {
                // Log and rethrow the error for upstream handling
                console.error('Error fetching debts for upcoming payment notifications:', error);
                throw new Error(error.message);
            }
        });
    }
}
exports.default = DebtService;
