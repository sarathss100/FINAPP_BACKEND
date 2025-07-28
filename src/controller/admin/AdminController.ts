import IAdminService from '../../services/admin/interfaces/IAdminService';
import IAdminController from './interfaces/IAdminController';
import { StatusCodes } from '../../constants/statusCodes';
import { sendSuccessResponse, sendErrorResponse } from '../../utils/responseHandler';
import { Request, Response } from 'express';
import { AppError, ValidationError } from '../../error/AppError';
import { ErrorMessages } from '../../constants/errorMessages';
import { SuccessMessages } from '../../constants/successMessages';
import faqSchema from '../../validation/base/faq.validation';
import faqQuerySchema from '../../validation/admin/faqQueryValidation';

class AdminController implements IAdminController {
    private readonly _adminService: IAdminService;

    constructor(adminService: IAdminService) {
        this._adminService = adminService;
    }

    async getAllUsers(request: Request, response: Response): Promise<void> {
        try {
            // Call the getAllUsers method from AuthService
            const usersDetails = await this._adminService.getAllUsers();
    
            if (usersDetails) {
                sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { ...usersDetails });
            }
            
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async toggleUserStatus(request: Request, response: Response): Promise<void> {
        try {

            const { userId, status } = request.body;

            if (!userId || typeof status !== 'boolean') {
                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.INVALID_INPUT)
            }
            
            // Call the toggleUserStatus in the adminService
            const isUpdated = await this._adminService.toggleUserStatus(userId, status);
    
            if (isUpdated) {
                sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS);
            } else {
                sendErrorResponse(response, StatusCodes.BAD_REQUEST, ErrorMessages.STATUS_UPDATE_FAILED);
            }
            
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
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
    
            if (isAdded) {
                sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.FAQ_ADDED, { isAdded });
            } else {
                sendErrorResponse(response, StatusCodes.BAD_REQUEST, ErrorMessages.FAILED_TO_ADD_THE_FAQ);
            }
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
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
            console.error(`Error fetching FAQs:`, error);
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getAllFaqs(request: Request, response: Response): Promise<void> {
        try {
            // Call the getall FAQ details in the adminService
            const faqDetails = await this._adminService.getAllFaqs();

            if (faqDetails) {
                sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.FAQ_ADDED, { faqDetails });
            } else {
                sendErrorResponse(response, StatusCodes.BAD_REQUEST, ErrorMessages.FAILED_TO_ADD_THE_FAQ);
            }
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    // Controller to handle FAQ deletion via HTTP DELETE request.
    async deleteFaq(request: Request, response: Response): Promise<void> {
        try {
            const faqId: string = request.params.id;

            // Call the delete FAQ method in the admin service
            const isRemoved = await this._adminService.deleteFaq(faqId);

            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.FAQ_DELETED_SUCCESSFULLY, { isRemoved });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    // Controller to handle toggling the publish status of an FAQ via an HTTP PATCH request.
    async togglePublish(request: Request, response: Response): Promise<void> {
        try {
            const faqId: string = request.params.id;
        
            // Call the service method to toggle the publish status
            const isToggled = await this._adminService.togglePublish(faqId);
        
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.FAQ_UPDATED_SUCCESSFULLY, { isToggled });
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    // Controller to handle updating an FAQ entry via an HTTP PATCH request.
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
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getNewRegistrationCount(request: Request, response: Response): Promise<void> {
        try {
            // Call the getNewRegistrationCount method from AuthService
            const newRegistrationCount = await this._adminService.getNewRegistrationCount();
    
            if (newRegistrationCount !== undefined) {
                sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { newRegistrationCount });
            } else {
                sendErrorResponse(response, StatusCodes.BAD_REQUEST, ErrorMessages.FAILED_TO_FETCH_REGISTRATION_COUNT);
            }
            
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getHealthStatus(request: Request, response: Response): Promise<void> {
        try {
            // Call the getHealthStatus method from AuthService
            const healthStatus = await this._adminService.getHealthStatus();
    
            if (healthStatus) {
                sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { healthStatus });
            } else {
                sendErrorResponse(response, StatusCodes.BAD_REQUEST, ErrorMessages.FAILED_TO_FETCH_HEALTH_STATUS);
            }
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async getSystemMetrics(request: Request, response: Response): Promise<void> {
        try {
            // Call the get System Metrics method from AuthService
            const usageStatics = await this._adminService.getSystemMetrics();
    
            if (usageStatics) {
                sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, { usageStatics });
            } else {
                sendErrorResponse(response, StatusCodes.BAD_REQUEST, ErrorMessages.FAILED_TO_FETCH_HEALTH_STATUS);
            }
        } catch (error) {
            if (error instanceof AppError) {
                sendErrorResponse(response, error.statusCode, error.message);
            } else {
                sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default AdminController;
