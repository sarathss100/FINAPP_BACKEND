import IAdminService from '../../services/admin/interfaces/IAdminService';
import IAdminController from './interfaces/IAdminController';
import { StatusCodes } from '../../constants/statusCodes';
import { sendSuccessResponse, sendErrorResponse } from '../../utils/responseHandler';
import { Request, Response } from 'express';
import { ValidationError } from '../../error/AppError';
import { ErrorMessages } from '../../constants/errorMessages';
import { SuccessMessages } from '../../constants/successMessages';
import faqSchema from '../../validation/base/faq.validation';
import faqQuerySchema from '../../validation/admin/faqQueryValidation';
import { handleControllerError } from '../../utils/controllerUtils';

export default class AdminController implements IAdminController {
    private readonly _adminService: IAdminService;

    constructor(adminService: IAdminService) {
        this._adminService = adminService;
    }

    async getAllUsers(request: Request, response: Response): Promise<void> {
        try {
            // Call the getAllUsers method from AuthService 
            const usersDetails = await this._adminService.getAllUsers();
    
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { ...usersDetails });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async toggleUserStatus(request: Request, response: Response): Promise<void> {
        try {
            const { userId, status } = request.body;
            
            // Call the toggleUserStatus in the adminService
            await this._adminService.toggleUserStatus(userId, status);
    
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS);
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getNewRegistrationCount(request: Request, response: Response): Promise<void> {
        try {
            // Call the getNewRegistrationCount method from AuthService
            const newRegistrationCount = await this._adminService.getNewRegistrationCount();
    
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { newRegistrationCount }); 
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async addFaq(request: Request, response: Response): Promise<void> {
        try {
            // Validate the request body using zod
            const parsedData = faqSchema.safeParse(request.body);

            if (!parsedData.success) {
                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.INVALID_INPUT)
            }

            const { question, answer } = parsedData.data;
            
            // Call the add FAQ in the adminService
            const isAdded = await this._adminService.addFaq({ question, answer });

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.FAQ_ADDED, { isAdded });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getAllFaqsForAdmin(request: Request, response: Response): Promise<void> {
        try {
            const validationResult = faqQuerySchema.safeParse(request.query);

            if (!validationResult.success) {
                const formattedErrors = validationResult.error.errors.map(err => 
                    `${err.path.join('.')}: ${err.message}`
                );
                sendErrorResponse(response, StatusCodes.BAD_REQUEST, 'Invalid query parameters', formattedErrors);
                return;
            } 

            const { page, limit, search } = validationResult.data;

            const faqDetails = await this._adminService.getAllFaqsForAdmin(page, limit, search);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.FAQ_FETCHED_SUCCESSFULLY, { ...faqDetails });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getAllFaqs(request: Request, response: Response): Promise<void> {
        try {
            // Call the getall FAQ details in the adminService
            const faqDetails = await this._adminService.getAllFaqs();

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.FAQ_ADDED, { faqDetails });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async deleteFaq(request: Request, response: Response): Promise<void> {
        try {
            const faqId: string = request.params.id;

            // Call the delete FAQ method in the admin service
            const isRemoved = await this._adminService.deleteFaq(faqId);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.FAQ_DELETED_SUCCESSFULLY, { isRemoved });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async togglePublish(request: Request, response: Response): Promise<void> {
        try {
            const faqId: string = request.params.id;
        
            // Call the service method to toggle the publish status
            const isToggled = await this._adminService.togglePublish(faqId);
        
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.FAQ_UPDATED_SUCCESSFULLY, { isToggled });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async updateFaq(request: Request, response: Response): Promise<void> {
        try {
            const faqId: string = request.params.id;
        
            // Validate the request body using zod
            const parsedData = faqSchema.safeParse(request.body);
        
            if (!parsedData.success) {
                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.BAD_REQUEST)
            }
        
            // Call the service method to update the FAQ
            const isUpdated = await this._adminService.updateFaq(faqId, { ...parsedData.data });
        
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.FAQ_UPDATED_SUCCESSFULLY, { isUpdated });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getHealthStatus(request: Request, response: Response): Promise<void> {
        try {
            // Call the getHealthStatus method from AuthService
            const healthStatus = await this._adminService.getHealthStatus();
    
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { healthStatus });
        } catch (error) {
            handleControllerError(response, error);
        }
    }

    async getSystemMetrics(request: Request, response: Response): Promise<void> {
        try {
            // Call the get System Metrics method from AuthService
            const usageStatics = await this._adminService.getSystemMetrics();
    
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { usageStatics });
        } catch (error) {
            handleControllerError(response, error);
        }
    }
}
