import { sendSuccessResponse } from '../../utils/responseHandler';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { Request, Response } from 'express';
import { AppError, ServerError } from '../../error/AppError';
import { SuccessMessages } from '../../constants/successMessages';
import IDebtController from './interfaces/IDebtController';
import IDebtService from '../../services/debt/interfaces/IDebtService';
import debtDTOSchema from '../../validation/debt/debt.validation';
import { handleControllerError } from '../../utils/controllerUtils';

export default class DebtController implements IDebtController {
    private readonly _debtService: IDebtService;

    constructor(debtService: IDebtService) {
        this._debtService = debtService;
    }

    async createDebt(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            const dto = debtDTOSchema.parse(request.body);

            const debt = await this._debtService.createDebt(accessToken, dto);

            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.DEBT_CREATED_SUCCESSFULLY, { debt });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getTotalDebt(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
        
            const totalDebt = await this._debtService.getTotalDebt(accessToken);
        
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { totalDebt });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getTotalOutstandingDebt(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            const totalOutstandingDebt = await this._debtService.getTotalOutstandingDebt(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { totalOutstandingDebt });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getTotalMonthlyPayment(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
        
            const totalMonthlyPayment = await this._debtService.getTotalMonthlyPayment(accessToken);
        
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { totalMonthlyPayment });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getLongestTenure(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
        
            const maxTenure = await this._debtService.getLongestTenure(accessToken);
        
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { maxTenure });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getDebtCategorized(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            const { category } = request.query;

            if (typeof category !== 'string') {
                throw new AppError('Invalid category parameter', StatusCodes.BAD_REQUEST);
            }

            const debtDetails = await this._debtService.getDebtCategorized(accessToken, category);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { debtDetails });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getRepaymentStrategyComparison(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            const { extraAmount } = request.query;
        
            const parsedExtraAmount = typeof extraAmount === 'string' ? parseFloat(extraAmount) : 0;
        
            if (isNaN(parsedExtraAmount) || parsedExtraAmount < 0) {
                throw new AppError('Invalid extra amount parameter', StatusCodes.BAD_REQUEST);
            }

            const repaymentComparisonResult = await this._debtService.getRepaymentStrategyComparison(accessToken, parsedExtraAmount);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { repaymentComparisonResult });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getAllDebts(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            const debtDetails = await this._debtService.getAllDebts(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { debtDetails });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async deleteDebt(request: Request, response: Response): Promise<void> {
        try {
            const debtId = request.params.id;

            const isDeleted = await this._debtService.deleteDebt(debtId);

            if (!isDeleted) {
                throw new ServerError(ErrorMessages.FAILED_TO_REMOVE_DEBT);
            }

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.REMOVED_DEBT, { isDeleted });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async markAsPaid(request: Request, response: Response): Promise<void> {
        try {
            const debtId = request.params.id;
        
            const isUpdated = await this._debtService.markAsPaid(debtId);
        
            if (!isUpdated) {
                throw new ServerError(ErrorMessages.FAILED_TO_REMOVE_DEBT);
            }

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.UPDATED_SUCCESSFULLY, { isUpdated });
        } catch (error) {
            handleControllerError(response, error);
        }
    }
}