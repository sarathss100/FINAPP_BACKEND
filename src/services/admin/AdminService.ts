import IUserDetails from 'repositories/admin/interfaces/IUserDetails';
import IAdminService from './interfaces/IAdminService';
import IAdminRepository from 'repositories/admin/interfaces/IAdminRepository';
import { AppError, ServerError, ValidationError } from 'error/AppError';
import { ErrorMessages } from 'constants/errorMessages';
import { StatusCodes } from 'constants/statusCodes';

class AdminService implements IAdminService {
    private _adminRepository: IAdminRepository;
    constructor(adminRepository: IAdminRepository) {
        this._adminRepository = adminRepository;
    }

    async getAllUsers(): Promise<IUserDetails[]> {
        try {
            // get the User Details 
            const userDetails = await this._adminRepository.findAllUsers();
            if (!userDetails || userDetails.length === 0) throw new ServerError(ErrorMessages.NO_USERS_FOUND, StatusCodes.BAD_REQUEST);

            return userDetails;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            } else {
                throw error;
            }
        }
    }

    async toggleUserStatus(_id: string, status: boolean): Promise<boolean> {
        try {
            // Validate input
            if (!_id || typeof status !== 'boolean') {
                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.INVALID_INPUT);
            }

            // Handle toggling user status (block/unblock) for admin
            const isToggled = await this._adminRepository.toggleUserStatus(_id, status);
            if (!isToggled) throw new ServerError(ErrorMessages.STATUS_UPDATE_FAILED, StatusCodes.BAD_REQUEST);

            return isToggled;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            } else {
                throw error;
            }
        }
    }
}

export default AdminService;
