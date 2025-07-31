import ITransactionService from '../../services/transaction/interfaces/ITransaction';
import ITransactionController from './interfaces/ITransactionController';
import { Request, Response } from 'express';
import { AuthenticationError, ValidationError } from '../../error/AppError';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import ITransactionDTO from '../../dtos/transaction/TransactionDTO';
import { sendSuccessResponse } from '../../utils/responseHandler';
import { SuccessMessages } from '../../constants/successMessages';
import transactionDTOSchema from '../../validation/transaction/transaction.validation';
import { handleControllerError } from '../../utils/controllerUtils';

export default class TransactionController implements ITransactionController {
  private readonly _transactionService: ITransactionService;

  constructor(transactionService: ITransactionService) {
    this._transactionService = transactionService;
  }

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
      handleControllerError(response, error);
    }
  }

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
      handleControllerError(response, error);
    }
  }

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
      handleControllerError(response, error);
    }
  }

  async getWeeklyTotalIncome(request: Request, response: Response): Promise<void> {
    try {
      const { accessToken } = request.cookies;
      if (!accessToken) {
        throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
      }

      const weeklyTotalIncome = await this._transactionService.getWeeklyTotalIncome(accessToken);

      sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.TRANSACTION_RETRIEVED, {
        weeklyTotalIncome
      });
    } catch (error) {
      handleControllerError(response, error);
    }
  }

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
      handleControllerError(response, error);
    }
  }

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
      handleControllerError(response, error);
    }
  }

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
      handleControllerError(response, error);
    }
  }

  async getAllIncomeTransactionsByCategory(request: Request, response: Response): Promise<void> {
    try {
        const { accessToken } = request.cookies;
        if (!accessToken) {
            throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
        }
      
        const transactions = await this._transactionService.getAllIncomeTransactionsByCategory(accessToken);

        sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.EXTRACTED_DATA, { transactions });
    } catch (error) {
        handleControllerError(response, error);
    }
  }

  async getAllExpenseTransactionsByCategory(request: Request, response: Response): Promise<void> {
    try {
        const { accessToken } = request.cookies;
        if (!accessToken) {
            throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
        }
      
        const transactions = await this._transactionService.getAllExpenseTransactionsByCategory(accessToken);

        sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.EXTRACTED_DATA, { transactions });
    } catch (error) {
        handleControllerError(response, error);
    }
  }

  async getMonthlyIncomeForChart(request: Request, response: Response): Promise<void> {
    try {
        const { accessToken } = request.cookies;
        if (!accessToken) {
            throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
        }
      
        const transactions = await this._transactionService.getMonthlyIncomeForChart(accessToken);

        sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.EXTRACTED_DATA, { transactions });
    } catch (error) {
        handleControllerError(response, error);
    }
  }

  async getMonthlyExpenseForChart(request: Request, response: Response): Promise<void> {
    try {
        const { accessToken } = request.cookies;
        if (!accessToken) {
            throw new AuthenticationError(ErrorMessages.ACCESS_TOKEN_NOT_FOUND, StatusCodes.UNAUTHORIZED);
        }
      
        const transactions = await this._transactionService.getMonthlyExpenseForChart(accessToken);

        sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.EXTRACTED_DATA, { transactions });
    } catch (error) {
        handleControllerError(response, error);
    }
  }

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
      handleControllerError(response, error);
    }
  }

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
        handleControllerError(response, error);
    }
  }

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
        handleControllerError(response, error);
    }
  }
}

