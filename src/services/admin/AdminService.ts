import IUserDetails from 'repositories/admin/interfaces/IUserDetails';
import IAdminService from './interfaces/IAdminService';
import IAdminRepository from 'repositories/admin/interfaces/IAdminRepository';

class AdminService implements IAdminService {
    private _adminRepository: IAdminRepository;
    constructor(adminRepository: IAdminRepository) {
        this._adminRepository = adminRepository;
    }

    async getAllUsers(): Promise<IUserDetails[]> {
        try {
            // get the User Details 
            const userDetails = await this._adminRepository.findAllUsers();
            if (!userDetails) throw new Error(`Failed to fetch user details: No data was returned.`);

            return userDetails;
        } catch (error) {
            throw error;
        }
    }

    async toggleUserStatus(_id: string, status: boolean): Promise<boolean> {
        try {
            // Handle toggling user status (block/unblock) for admin
            const isToggled = await this._adminRepository.toggleUserStatus(_id, status);
            if (!isToggled) throw new Error(`Failed to update the user's status. Please ensure the user ID is valid and try again.`);

            return isToggled;
        } catch (error) {
            throw error;
        }
    }
}

export default AdminService;
