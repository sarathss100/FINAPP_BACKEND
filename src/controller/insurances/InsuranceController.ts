import { sendSuccessResponse } from '../../utils/responseHandler';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { Request, Response } from 'express';
import { AppError } from '../../error/AppError';
import { SuccessMessages } from '../../constants/successMessages';
import IInsuranceController from './interfaces/IInsuranceController';
import IInsuranceService from '../../services/insurances/interfaces/IInsuranceService';
import { insuranceDTOSchema } from '../../validation/insurances/insurance.validation';
import { handleControllerError } from '../../utils/controllerUtils';

export default class InsuranceController implements IInsuranceController {
    private readonly _insuranceService: IInsuranceService;

    constructor(insuranceService: IInsuranceService) {
        this._insuranceService = insuranceService;
    }

    async createInsurance(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
            
            // Validate request body against the Zod schema
            const dto = insuranceDTOSchema.parse(request.body.formData);

            // Delegate to the service layer
            const insurance = await this._insuranceService.createInsurance(accessToken, dto);

            sendSuccessResponse(response, StatusCodes.CREATED, SuccessMessages.OPERATION_SUCCESS, { insurance });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async removeInsurance(request: Request, response: Response): Promise<void> {
        try {
            const { id } = request.params;

            // Delegate to the service layer to remove the insurance
            const isInsuranceRemoved = await this._insuranceService.removeInsurance(id);

            if (!isInsuranceRemoved) {
                throw new AppError(ErrorMessages.FAILED_TO_REMOVE_INSURANCE, StatusCodes.NOT_FOUND);
            }

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.INSURANCE_DELETED_SUCCESSFULLY,{ deleted: isInsuranceRemoved });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getUserInsuranceCoverageTotal(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            // Delegate to the service layer to remove the insurance
            const totalInsuranceCoverage = await this._insuranceService.getUserInsuranceCoverageTotal(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.INSURANCE_COVERAGE_RETRIEVED,{ totalInsuranceCoverage });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getUserTotalPremiumAmount(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;

            // Delegate to the service layer to calculate the total premium
            const totalPremium = await this._insuranceService.getUserTotalPremiumAmount(accessToken);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.INSURANCE_COVERAGE_RETRIEVED,{ totalPremium });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getAllInsurances(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
        
            // Delegate to the service layer to fetch all insurance records
            const insuranceDetails = await this._insuranceService.getAllInsurances(accessToken);
        
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.INSURANCES_RETRIEVED, { insuranceDetails });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getClosestNextPaymentDate(request: Request, response: Response): Promise<void> {
        try {
            const { accessToken } = request.cookies;
        
            // Delegate to the service layer to fetch the closest next payment date
            const insurance = await this._insuranceService.getClosestNextPaymentDate(accessToken);
        
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.NEXT_PAYMENT_DATE_RETRIEVED, { insurance });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async markPaymentAsPaid(request: Request, response: Response): Promise<void> {
        try {
            const { id } = request.params;
        
            // Delegate the update operation to the service layer
            const isUpdated = await this._insuranceService.markPaymentAsPaid(id);
        
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.PAYMENT_STATUS_UPDATED, { isUpdated });
        } catch (error) {
            handleControllerError(response, error);
        }
    }
}

