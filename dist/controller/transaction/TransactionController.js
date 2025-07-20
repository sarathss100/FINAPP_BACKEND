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
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
const responseHandler_1 = require("utils/responseHandler");
const successMessages_1 = require("constants/successMessages");
const transaction_validation_1 = __importDefault(require("validation/transaction/transaction.validation"));
class TransactionController {
    /**
     * Initializes a new instance of the `TransactionController` class.
     *
     * @param {ITransactionService} transactionService - The service implementation used to process transaction logic.
     */
    constructor(transactionService) {
        this._transactionService = transactionService;
    }
    /**
     * Handles creating one or more transactions based on the request body.
     *
     * Supports both single transaction and array of transactions.
     * Validates input using Zod schema before passing to service layer.
     *
     * @param {Request} request - Express request object containing cookies and transaction data.
     * @param {Response} response - Express response object used to send back the API response.
     * @returns {Promise<void>} - Sends a success or error response.
     *
     * @throws {AuthenticationError} If access token is missing or invalid.
     * @throws {ValidationError} If transaction data fails validation.
     * @throws {Error} For any internal server errors during processing.
     */
    createTransaction(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                const isArray = Array.isArray(request.body);
                if (isArray) {
                    const validatedTransactions = [];
                    const validationErrors = [];
                    for (let i = 0; i < request.body.length; i++) {
                        const parsedTransaction = transaction_validation_1.default.safeParse(request.body[i]);
                        if (parsedTransaction.success) {
                            validatedTransactions.push(parsedTransaction.data);
                        }
                        else {
                            const errors = parsedTransaction.error.errors.map((err) => ({
                                transactionIndex: i,
                                field: err.path.join('.'),
                                message: err.message
                            }));
                            validationErrors.push(...errors);
                        }
                    }
                    if (validationErrors.length > 0) {
                        console.error(validationErrors);
                        throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.INVALID_INPUT, statusCodes_1.StatusCodes.BAD_REQUEST);
                    }
                    const createdTransactions = yield this._transactionService.createTransaction(accessToken, validatedTransactions);
                    (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.TRANSACTION_CREATED, {
                        addedTransactions: createdTransactions
                    });
                }
                else {
                    const parsedBody = transaction_validation_1.default.safeParse(request.body);
                    if (!parsedBody.success) {
                        const errors = parsedBody.error.errors.map((err) => ({
                            field: err.path.join('.'),
                            message: err.message
                        }));
                        console.error(errors);
                        throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.INVALID_INPUT, statusCodes_1.StatusCodes.BAD_REQUEST);
                    }
                    const transactionData = parsedBody.data;
                    const createdTransaction = yield this._transactionService.createTransaction(accessToken, transactionData);
                    (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.TRANSACTION_CREATED, {
                        addedTransaction: createdTransaction
                    });
                }
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Retrieves all transactions associated with the authenticated user.
     *
     * @param {Request} request - Express request object containing cookies and authentication data.
     * @param {Response} response - Express response object used to send back the API response.
     * @returns {Promise<void>} - Sends a success response with the list of transactions or an error response.
     *
     * @throws {AuthenticationError} If access token is missing or invalid.
     * @throws {Error} For any internal server errors during processing.
     */
    getUserTransactions(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                const allTransactions = yield this._transactionService.getUserTransactions(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.TRANSACTION_RETRIEVED, {
                    allTransactions
                });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Retrieves the total income for the current and previous month for the authenticated user.
     *
     * @param {Request} request - Express request object containing cookies and authentication data.
     * @param {Response} response - Express response object used to send back the API response.
     * @returns {Promise<void>} - Sends a success response with monthly income totals or an error response.
     *
     * @throws {AuthenticationError} If access token is missing or invalid.
     * @throws {Error} For any internal server errors during processing.
     */
    getMonthlyTotalIncome(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                const userMonthlyTotals = yield this._transactionService.getMonthlyTotalIncome(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.TRANSACTION_RETRIEVED, Object.assign({}, userMonthlyTotals));
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Retrieves the total income for the latest ISO week for the authenticated user.
     *
     * @param {Request} request - Express request object containing cookies and authentication data.
     * @param {Response} response - Express response object used to send back the API response.
     * @returns {Promise<void>} - Sends a success response with weekly income total or an error response.
     *
     * @throws {AuthenticationError} If access token is missing or invalid.
     * @throws {Error} For any internal server errors during processing.
     */
    getWeeklyTotalIncome(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                // BUG FIXED: Previously calling monthly method, now calling correct weekly method
                const weeklyTotalIncome = yield this._transactionService.getWeeklyTotalIncome(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.TRANSACTION_RETRIEVED, {
                    weeklyTotalIncome
                });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Retrieves the total expense for the current month for the authenticated user.
     *
     * @param {Request} request - Express request object containing cookies and authentication data.
     * @param {Response} response - Express response object used to send back the API response.
     * @returns {Promise<void>} - Sends a success response with monthly expense total or an error response.
     *
     * @throws {AuthenticationError} If access token is missing or invalid.
     * @throws {Error} For any internal server errors during processing.
     */
    getMonthlyTotalExpense(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                const totalMonthlyExpense = yield this._transactionService.getMonthlyTotalExpense(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.TRANSACTION_RETRIEVED, {
                    totalMonthlyExpense
                });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Retrieves category-wise expenses for the authenticated user.
     *
     * @param {Request} request - Express request object containing cookies and authentication data.
     * @param {Response} response - Express response object used to send back the API response.
     * @returns {Promise<void>} - Sends a success response with categorized expenses or an error response.
     *
     * @throws {AuthenticationError} If access token is missing or invalid.
     * @throws {Error} For any internal server errors during processing.
     */
    getCategoryWiseExpense(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                const categoryWiseExpenses = yield this._transactionService.getCategoryWiseExpense(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.TRANSACTION_RETRIEVED, {
                    categoryWiseExpenses
                });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Extracts transaction data from an uploaded statement file.
     *
     * @param {Request} request - Express request object containing the uploaded file.
     * @param {Response} response - Express response object used to send back the extracted data.
     * @returns {Promise<void>} - Sends a success response with extracted data or an error response.
     *
     * @throws {ValidationError} If no file was uploaded.
     * @throws {Error} For any internal server errors during processing.
     */
    extractTransactionData(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = request.file;
                if (!file) {
                    throw new AppError_1.ValidationError(errorMessages_1.ErrorMessages.STATEMENT_FILE_NOT_FOUND, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                const extractedStatementData = yield this._transactionService.extractTransactionData(file);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.EXTRACTED_DATA, {
                    extractedStatementData
                });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Controller to retrieve all INCOME-type transactions for the authenticated user.
     *
     * This method:
     * - Extracts the access token from cookies to authenticate the user.
     * - Fetches income transactions using the transaction service.
     * - Sends a structured success response with the retrieved transaction data.
     *
     * @param {Request} request - Express request object, expected to contain the access token in cookies.
     * @param {Response} response - Express response object used to send the result or error.
     * @returns {Promise<void>} - Sends JSON response with transaction data or error message.
     *
     * @throws {AuthenticationError} If the access token is missing or invalid.
     * @throws {Error} For any internal server errors during the transaction retrieval process.
     */
    getAllIncomeTransactionsByCategory(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                const transactions = yield this._transactionService.getAllIncomeTransactionsByCategory(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.EXTRACTED_DATA, { transactions });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Controller to retrieve all EXPENSE-type transactions grouped by category for the authenticated user.
     *
     * This method:
     * - Extracts the access token from cookies to authenticate the user.
     * - Validates that the access token exists and is valid.
     * - Calls the service layer to fetch expense transactions grouped by category for the current year.
     * - Sends a structured success response containing the categorized expense data.
     *
     * @param {Request} request - Express request object, expected to contain the access token in cookies.
     * @param {Response} response - Express response object used to send the result or error.
     * @returns {Promise<void>} - Sends JSON response with categorized expense transaction data or an error message.
     *
     * @throws {AuthenticationError} If the access token is missing or invalid.
     * @throws {Error} For any internal server errors during the transaction retrieval process.
     */
    getAllExpenseTransactionsByCategory(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                const transactions = yield this._transactionService.getAllExpenseTransactionsByCategory(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.EXTRACTED_DATA, { transactions });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Controller to retrieve month-wise income data for the authenticated user.
     *
     * This method:
     * - Extracts the access token from cookies to authenticate the user.
     * - Fetches aggregated income data grouped by month using the transaction service.
     * - Returns a structured success response containing chart-ready monthly income data (e.g., { month: "Jan", amount: 5000 }).
     * - Ensures all 12 months are included, with zero values for months without income.
     *
     * @param {Request} request - Express request object, expected to contain the access token in cookies.
     * @param {Response} response - Express response object used to send the result or error.
     * @returns {Promise<void>} - Sends JSON response with monthly income data or an error message.
     *
     * @throws {AuthenticationError} If the access token is missing or invalid.
     * @throws {Error} For any internal server errors during the data retrieval process.
     */
    getMonthlyIncomeForChart(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                const transactions = yield this._transactionService.getMonthlyIncomeForChart(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.EXTRACTED_DATA, { transactions });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Controller to retrieve month-wise income data for the authenticated user.
     *
     * This method:
     * - Extracts the access token from cookies to authenticate the user.
     * - Fetches aggregated income data grouped by month using the transaction service.
     * - Returns a structured success response containing chart-ready monthly income data (e.g., { month: "Jan", amount: 5000 }).
     * - Ensures all 12 months are included, with zero values for months without income.
     *
     * @param {Request} request - Express request object, expected to contain the access token in cookies.
     * @param {Response} response - Express response object used to send the result or error.
     * @returns {Promise<void>} - Sends JSON response with monthly income data or an error message.
     *
     * @throws {AuthenticationError} If the access token is missing or invalid.
     * @throws {Error} For any internal server errors during the data retrieval process.
     */
    getMonthlyExpenseForChart(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                const transactions = yield this._transactionService.getMonthlyExpenseForChart(accessToken);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.EXTRACTED_DATA, { transactions });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Controller to retrieve paginated income transactions for the authenticated user.
     *
     * This method:
     * - Extracts the access token from cookies to authenticate the user.
     * - Parses pagination (`page`, `limit`) and filter parameters (`timeRange`, `category`, `smartCategory`, `searchText`) from the query string.
     * - Fetches a paginated list of income transactions using the transaction service.
     * - Applies optional filters such as time range, category, smart category, and search text.
     *
     * @param {Request} request - Express request object containing cookies and query parameters.
     * @param {Response} response - Express response object used to send the result or error.
     * @returns {Promise<void>} - Sends JSON response with paginated income transactions or an error message.
     *
     * @throws {AuthenticationError} If the access token is missing or invalid.
     * @throws {Error} For any internal server errors during data retrieval.
     */
    getPaginatedIncomeTransactions(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                const pageNum = request.query.page ? parseInt(request.query.page, 10) : 1;
                const limitNum = request.query.limit ? parseInt(request.query.limit, 10) : 10;
                const { timeRange, category, searchText } = request.query;
                const transactions = yield this._transactionService.getPaginatedIncomeTransactions(accessToken, pageNum, limitNum, timeRange, category, searchText);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.EXTRACTED_DATA, { transactions });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
     * Controller to retrieve paginated expense transactions for the authenticated user.
     *
     * This method:
     * - Extracts the access token from cookies to authenticate the user.
     * - Parses pagination (`page`, `limit`) and filter parameters (`timeRange`, `category`, `searchText`) from the query string.
     * - Fetches a paginated list of expense transactions using the transaction service.
     * - Applies optional filters such as time range, category, and search text.
     *
     * @param {Request} request - Express request object containing cookies and query parameters.
     * @param {Response} response - Express response object used to send the result or error.
     * @returns {Promise<void>} - Sends JSON response with paginated expense transactions or an error message.
     *
     * @throws {AuthenticationError} If the access token is missing or invalid.
     * @throws {Error} For any internal server errors during data retrieval.
     */
    getPaginatedExpenseTransactions(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                const pageNum = request.query.page ? parseInt(request.query.page, 10) : 1;
                const limitNum = request.query.limit ? parseInt(request.query.limit, 10) : 10;
                const { timeRange, category, searchText } = request.query;
                const transactions = yield this._transactionService.getPaginatedExpenseTransactions(accessToken, pageNum, limitNum, timeRange, category, searchText);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.EXTRACTED_DATA, { transactions });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    /**
    * Controller to retrieve paginated income or expense transactions for the authenticated user.
    *
    * This method:
    * - Extracts the access token from cookies to authenticate the user.
    * - Parses pagination (`page`, `limit`) and filter parameters (`timeRange`, `category`, `transactionType`, `searchText`) from the query string.
    * - Fetches a paginated list of transactions using the transaction service.
    * - Supports filtering by time range, category, transaction type (Income/Expense), and search text.
    *
    * @param {Request} request - Express request object containing cookies and query parameters.
    * @param {Response} response - Express response object used to send the result or error.
    * @returns {Promise<void>} - Sends JSON response with paginated transactions or an error message.
    *
    * @throws {AuthenticationError} If the access token is missing or invalid.
    * @throws {Error} For any internal server errors during data retrieval.
    */
    getPaginatedTransactions(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessToken } = request.cookies;
                if (!accessToken) {
                    throw new AppError_1.AuthenticationError(errorMessages_1.ErrorMessages.ACCESS_TOKEN_NOT_FOUND, statusCodes_1.StatusCodes.UNAUTHORIZED);
                }
                const pageNum = request.query.page ? parseInt(request.query.page, 10) : 1;
                const limitNum = request.query.limit ? parseInt(request.query.limit, 10) : 10;
                const { timeRange, category, transactionType, searchText } = request.query;
                const transactions = yield this._transactionService.getPaginatedTransactions(accessToken, pageNum, limitNum, timeRange, category, transactionType, searchText);
                (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.EXTRACTED_DATA, { transactions });
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
}
exports.default = TransactionController;
