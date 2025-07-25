import ITransactionService from '../../services/transaction/interfaces/ITransaction';
import ITransactionController from './interfaces/ITransactionController';
import { Request, Response } from 'express';
import {
  AppError,
  AuthenticationError,
  ValidationError
} from '../../error/AppError';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { ITransactionDTO } from '../../dtos/transaction/TransactionDto';
import { sendErrorResponse, sendSuccessResponse } from '../../utils/responseHandler';
import { SuccessMessages } from '../../constants/successMessages';
import transactionDTOSchema from '../../validation/transaction/transaction.validation';

class TransactionController implements ITransactionController {
  private readonly _transactionService: ITransactionService;

  constructor(transactionService: ITransactionService) {
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
  async createTransaction(request: Request, response: Response): Promise<void> {
    try {
      const { accessToken } = request.cookies;
      if (!accessToken) {
        throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
      }

      const isArray = Array.isArray(request.body);

      if (isArray) {
        const validatedTransactions = [];
        const validationErrors = [];

        for (let i = 0; i < request.body.length; i++) {
          const parsedTransaction = transactionDTOSchema.safeParse(request.body[i]);
          if (parsedTransaction.success) {
            validatedTransactions.push(parsedTransaction.data);
          } else {
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
          throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.BAD_REQUEST);
        }

        const createdTransactions = await this._transactionService.createTransaction(accessToken, validatedTransactions);
        sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_CREATED, {
          addedTransactions: createdTransactions
        });
      } else {
        const parsedBody = transactionDTOSchema.safeParse(request.body);
        if (!parsedBody.success) {
          const errors = parsedBody.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }));
          console.error(errors);
          throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.BAD_REQUEST);
        }

        const transactionData = parsedBody.data;
        const createdTransaction = await this._transactionService.createTransaction(accessToken, transactionData);
        sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_CREATED, {
          addedTransaction: createdTransaction
        });
      }
    } catch (error) {
      if (error instanceof AppError) {
        sendErrorResponse(response, error.statusCode, error.message);
      } else {
        sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
      }
    }
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
  async getUserTransactions(request: Request, response: Response): Promise<void> {
    try {
      const { accessToken } = request.cookies;
      if (!accessToken) {
        throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
      }

      const allTransactions: ITransactionDTO[] = await this._transactionService.getUserTransactions(accessToken);
      sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_RETRIEVED, {
        allTransactions
      });
    } catch (error) {
      if (error instanceof AppError) {
        sendErrorResponse(response, error.statusCode, error.message);
      } else {
        sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
      }
    }
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
  async getMonthlyTotalIncome(request: Request, response: Response): Promise<void> {
    try {
      const { accessToken } = request.cookies;
      if (!accessToken) {
        throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
      }

      const userMonthlyTotals = await this._transactionService.getMonthlyTotalIncome(accessToken);
      sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_RETRIEVED, {
        ...userMonthlyTotals
      });
    } catch (error) {
      if (error instanceof AppError) {
        sendErrorResponse(response, error.statusCode, error.message);
      } else {
        sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
      }
    }
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
  async getWeeklyTotalIncome(request: Request, response: Response): Promise<void> {
    try {
      const { accessToken } = request.cookies;
      if (!accessToken) {
        throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
      }

      // BUG FIXED: Previously calling monthly method, now calling correct weekly method
      const weeklyTotalIncome = await this._transactionService.getWeeklyTotalIncome(accessToken);
      sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_RETRIEVED, {
        weeklyTotalIncome
      });
    } catch (error) {
      if (error instanceof AppError) {
        sendErrorResponse(response, error.statusCode, error.message);
      } else {
        sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
      }
    }
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
  async getMonthlyTotalExpense(request: Request, response: Response): Promise<void> {
    try {
      const { accessToken } = request.cookies;
      if (!accessToken) {
        throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
      }

      const totalMonthlyExpense = await this._transactionService.getMonthlyTotalExpense(accessToken);
      sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_RETRIEVED, {
        totalMonthlyExpense
      });
    } catch (error) {
      if (error instanceof AppError) {
        sendErrorResponse(response, error.statusCode, error.message);
      } else {
        sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
      }
    }
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
  async getCategoryWiseExpense(request: Request, response: Response): Promise<void> {
    try {
      const { accessToken } = request.cookies;
      if (!accessToken) {
        throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
      }

      const categoryWiseExpenses = await this._transactionService.getCategoryWiseExpense(accessToken);
      sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_RETRIEVED, {
        categoryWiseExpenses
      });
    } catch (error) {
      if (error instanceof AppError) {
        sendErrorResponse(response, error.statusCode, error.message);
      } else {
        sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
      }
    }
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
  async extractTransactionData(request: Request, response: Response): Promise<void> {
    try {
      const file = request.file;
      if (!file) {
        throw new ValidationError(ErrorMessages.STATEMENT_FILE_NOT_FOUND, StatusCodes.BAD_REQUEST);
      }

      const extractedStatementData = await this._transactionService.extractTransactionData(file);
      sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.EXTRACTED_DATA, {
        extractedStatementData
      });
    } catch (error) {
      if (error instanceof AppError) {
        sendErrorResponse(response, error.statusCode, error.message);
      } else {
        sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
      }
    }
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
  async getAllIncomeTransactionsByCategory(request: Request, response: Response): Promise<void> {
    try {
        const { accessToken } = request.cookies;
        if (!accessToken) {
            throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
        }
      
        const transactions = await this._transactionService.getAllIncomeTransactionsByCategory(accessToken);
        sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.EXTRACTED_DATA, { transactions });
    } catch (error) {
        if (error instanceof AppError) {
            sendErrorResponse(response, error.statusCode, error.message);
        } else {
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
        }
    }
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
  async getAllExpenseTransactionsByCategory(request: Request, response: Response): Promise<void> {
    try {
        const { accessToken } = request.cookies;
        if (!accessToken) {
            throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
        }
      
        const transactions = await this._transactionService.getAllExpenseTransactionsByCategory(accessToken);
        sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.EXTRACTED_DATA, { transactions });
    } catch (error) {
        if (error instanceof AppError) {
            sendErrorResponse(response, error.statusCode, error.message);
        } else {
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
        }
    }
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
  async getMonthlyIncomeForChart(request: Request, response: Response): Promise<void> {
    try {
        const { accessToken } = request.cookies;
        if (!accessToken) {
            throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
        }
      
        const transactions = await this._transactionService.getMonthlyIncomeForChart(accessToken);
        sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.EXTRACTED_DATA, { transactions });
    } catch (error) {
        if (error instanceof AppError) {
            sendErrorResponse(response, error.statusCode, error.message);
        } else {
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
        }
    }
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
  async getMonthlyExpenseForChart(request: Request, response: Response): Promise<void> {
    try {
        const { accessToken } = request.cookies;
        if (!accessToken) {
            throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
        }
      
        const transactions = await this._transactionService.getMonthlyExpenseForChart(accessToken);
        sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.EXTRACTED_DATA, { transactions });
    } catch (error) {
        if (error instanceof AppError) {
            sendErrorResponse(response, error.statusCode, error.message);
        } else {
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
        }
    }
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
  async getPaginatedIncomeTransactions(request: Request, response: Response): Promise<void> {
    try {
      const { accessToken } = request.cookies;
      if (!accessToken) {
        throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
      }
    
      const pageNum = request.query.page ? parseInt(request.query.page as string, 10) : 1;
      const limitNum = request.query.limit ? parseInt(request.query.limit as string, 10) : 10;
      const { timeRange, category, searchText } = request.query;
    
      const transactions = await this._transactionService.getPaginatedIncomeTransactions(
        accessToken,
        pageNum,
        limitNum,
        timeRange as 'day' | 'week' | 'month' | 'year',
        category as string,
        searchText as string
      );
    
      sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.EXTRACTED_DATA, { transactions });
    } catch (error) {
      if (error instanceof AppError) {
        sendErrorResponse(response, error.statusCode, error.message);
      } else {
        sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
      }
    }
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
  async getPaginatedExpenseTransactions(request: Request, response: Response): Promise<void> {
    try {
        const { accessToken } = request.cookies;
        if (!accessToken) {
            throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
        }
      
        const pageNum = request.query.page ? parseInt(request.query.page as string, 10) : 1;
        const limitNum = request.query.limit ? parseInt(request.query.limit as string, 10) : 10;
        const { timeRange, category, searchText } = request.query;
      
        const transactions = await this._transactionService.getPaginatedExpenseTransactions(
            accessToken,
            pageNum,
            limitNum,
            timeRange as 'day' | 'week' | 'month' | 'year',
            category as string,
            searchText as string
        );
      
        sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.EXTRACTED_DATA, { transactions });
    } catch (error) {
        if (error instanceof AppError) {
            sendErrorResponse(response, error.statusCode, error.message);
        } else {
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
        }
    }
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
  async getPaginatedTransactions(request: Request, response: Response): Promise<void> {
    try {
        const { accessToken } = request.cookies;
        if (!accessToken) {
            throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
        }
      
        const pageNum = request.query.page ? parseInt(request.query.page as string, 10) : 1;
        const limitNum = request.query.limit ? parseInt(request.query.limit as string, 10) : 10;
        const { timeRange, category, transactionType, searchText } = request.query;
  
        const transactions = await this._transactionService.getPaginatedTransactions(
            accessToken,
            pageNum,
            limitNum,
            timeRange as 'day' | 'week' | 'month' | 'year',
            category as string,
            transactionType as string,
            searchText as string
        );
      
        sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.EXTRACTED_DATA, { transactions });
    } catch (error) {
        if (error instanceof AppError) {
            sendErrorResponse(response, error.statusCode, error.message);
        } else {
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
        }
    }
  }
}

export default TransactionController;
