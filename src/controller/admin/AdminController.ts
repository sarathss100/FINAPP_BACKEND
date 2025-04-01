import IAdminService from 'services/admin/interfaces/IAdminService';
import IAdminController from './interfaces/IAdminController';
import { StatusCodes } from 'utils/statusCodes';
import { sendSuccessResponse, sendErrorResponse } from 'utils/responseHandler';
import { Request, Response } from 'express';

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
                sendSuccessResponse(response, StatusCodes.OK, `Users details have been successfully retrieved.`, {...usersDetails});
            }
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            let errorMessage = `An unexpected error occurred while trying to fetch users details. Please try again later or contact support if the issue persists.`;
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage);
        }
    }

    async toggleUserStatus(request: Request, response: Response): Promise<void> {
        try {

            const { userId, status } = request.body;
            
            // Call the toggleUserStatus in the adminService
            const isUpdated = await this._adminService.toggleUserStatus(userId, status);
    
            if (isUpdated) {
                sendSuccessResponse(response, StatusCodes.OK, `Users details have been successfully retrieved.`);
            }
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            let errorMessage = `An unexpected error occurred while trying to fetch users details. Please try again later or contact support if the issue persists.`;
            sendErrorResponse(response, StatusCodes.INTERNAL_SERVER_ERROR, errorMessage);
        }
    }
}

export default AdminController;
