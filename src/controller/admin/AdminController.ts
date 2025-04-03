import IAdminService from 'services/admin/interfaces/IAdminService';
import IAdminController from './interfaces/IAdminController';
import { StatusCodes } from 'constants/statusCodes';
import { sendSuccessResponse, sendErrorResponse } from 'utils/responseHandler';
import { Request, Response } from 'express';
import { AppError, ValidationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { SuccessMessages } from 'constants/successMessages';

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
                sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.OPERATION_SUCCESS, {...usersDetails});
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
                sendSuccessResponse(response, StatusCodes.OK,  SuccessMessages.OPERATION_SUCCESS);
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
}

export default AdminController;
