import IAdminService from './interfaces/IAdminService';
import IAdminRepository from '../../repositories/admin/interfaces/IAdminRepository';
import { ServerError, ValidationError } from '../../error/AppError';
import { ErrorMessages } from '../../constants/errorMessages';
import { StatusCodes } from '../../constants/statusCodes';
import { IHealthStatus } from './health/interfaces/IHealth';
import { CompositeHealthCheckService } from './health/composite-health';
import { ExternalApiHealthCheckService } from './health/api-health';
import { MongoDbHealthCheckService } from './health/mongodb-health';
import { RedisHealthCheckService } from './health/redis-health';
import { ServerHealthCheckService } from './health/server-health';
import IPaginationMeta from '../../dtos/admin/IPaginationMetaDTO';
import { IFaqDTO } from '../../dtos/base/IFaqDTO';
import ISystemMetricsDTO from '../../dtos/admin/ISystemMetricsDTO';
import UserMapper from '../../mappers/user/UserMapper';
import { wrapServiceError } from '../../utils/serviceUtils';
import FaqMapper from '../../mappers/faqs/FaqMapper';
import IAdminUserDTO from '../../dtos/admin/IAdminUserDTO';

export default class AdminService implements IAdminService {
    private _adminRepository: IAdminRepository;
    constructor(adminRepository: IAdminRepository) {
        this._adminRepository = adminRepository;
    }

    async getAllUsers(): Promise<IAdminUserDTO[]> {
        try {
            // Retrieve all user details from the admin repository
            const userDetails = await this._adminRepository.findAllUsers();

            const resultDTO = UserMapper.toAdminUserDTOs(userDetails);

            if (!resultDTO || resultDTO.length === 0) {
                throw new ServerError(ErrorMessages.NO_USERS_FOUND, StatusCodes.BAD_REQUEST);
            }

            return resultDTO;
        } catch (error) {
            console.error(`Error while getting All Users:`, error);
            throw wrapServiceError(error);
        }
    }

    async toggleUserStatus(_id: string, status: boolean): Promise<boolean> {
        try {
            if (!_id || typeof status !== 'boolean') {
                throw new ValidationError(ErrorMessages.INVALID_INPUT, StatusCodes.INVALID_INPUT);
            }

            // Call the repository method to toggle the user's status
            const isToggled = await this._adminRepository.toggleUserStatus(_id, status);

            if (!isToggled) {
                throw new ServerError(ErrorMessages.STATUS_UPDATE_FAILED, StatusCodes.BAD_REQUEST);
            }

            return isToggled;
        } catch (error) {
            console.error(`Error while toggling User Status:`, error);
            throw wrapServiceError(error);
        }
    }

    async getNewRegistrationCount(): Promise<number> {  
        try {
            // Call the repository method to fetch the count of new registrations
            const count = await this._adminRepository.getNewRegistrationCount();

            if (typeof count !== 'number' || count < 1) {
                return 0;
            }

            return count;
        } catch (error) {
            console.error(`Error while getting New Registration count: `, error);
            throw wrapServiceError(error);
        }
    }

    async addFaq(newFaq: IFaqDTO): Promise<boolean> {
        try {
            const mappedFaq = FaqMapper.toModel(newFaq);

            // Call the repository method to add the new FAQ entry
            const isAdded = await this._adminRepository.addFaq(mappedFaq);

            if (!isAdded) {
                throw new ServerError(ErrorMessages.FAILED_TO_ADD_THE_FAQ, StatusCodes.INTERNAL_SERVER_ERROR);
            }

            return isAdded;
        } catch (error) {
            console.error(`Error while adding Faq: `, error);
            throw wrapServiceError(error);
        }
    }

    async getAllFaqsForAdmin(page: number, limit: number, search: string): Promise<{ faqDetails: IFaqDTO[], pagination: IPaginationMeta }> {
        try {
            const result = await this._adminRepository.getAllFaqsForAdmin(page, limit, search);

            const resultDTO = FaqMapper.toDTOs(result.faqDetails);
        
            if (!resultDTO) {
                throw new ServerError(ErrorMessages.FAILED_TO_FETCH_FAQS, StatusCodes.INTERNAL_SERVER_ERROR);
            }
    
            if (resultDTO.length === 0) {
                throw new ServerError(ErrorMessages.NO_FAQ_FOUND, StatusCodes.NOT_FOUND);
            }

            const paginatedFaqData = {
                faqDetails: resultDTO,
                pagination: result.pagination,
            }
        
            return paginatedFaqData;
        } catch (error) {
            console.error(`Error while getting Faqs for admin: `, error);
            throw wrapServiceError(error);
        }
    }

    async getAllFaqs(): Promise<IFaqDTO[] | null> {
        try {
            // Call the repository method to fetch all FAQ entries
            const faqDetails = await this._adminRepository.getAllFaqs();

            const resultDTO = FaqMapper.toDTOs(faqDetails);

            if (!resultDTO) {
                throw new ServerError(ErrorMessages.FAILED_TO_FETCH_FAQS, StatusCodes.INTERNAL_SERVER_ERROR);
            }

            if (resultDTO.length < 0) {
                throw new ServerError(ErrorMessages.NO_FAQ_FOUND, StatusCodes.INTERNAL_SERVER_ERROR);
            }

            return resultDTO;
        } catch (error) {
            console.error(`Error while getting Faqs: `, error);
            throw wrapServiceError(error);
        }
    }

    async deleteFaq(faqId: string): Promise<boolean> {
        try {
            // Call the repository method to delete the FAQ by ID
            const isRemoved = await this._adminRepository.deleteFaq(faqId);
        
            if (!isRemoved) {
                throw new ServerError(ErrorMessages.FAILED_TO_DELETE_FAQ, StatusCodes.INTERNAL_SERVER_ERROR);
            }
        
            return isRemoved;
        } catch (error) {
            console.error(`Error while Deleting Faq: `, error);
            throw wrapServiceError(error);
        }
    }

    async togglePublish(faqId: string): Promise<boolean> {
        try {
            // Call the repository method to toggle the publish status
            const isToggled = await this._adminRepository.togglePublish(faqId);
        
            return isToggled;
        } catch (error) {
            console.error(`Error while toggling Faq Publish: `, error);
            throw wrapServiceError(error);
        }
    }

    async updateFaq(faqId: string, updatedData: Partial<IFaqDTO>): Promise<boolean> {
        try {
            // Call the repository method to update the FAQ
            const isUpdated = await this._adminRepository.updateFaq(faqId, updatedData);
        
            return isUpdated;
        } catch (error) {
            console.error(`Error while Updating Faq: `, error);
            throw wrapServiceError(error);
        }
    }

    async getHealthStatus(): Promise<IHealthStatus> {  
        try {
            const response = new CompositeHealthCheckService([
                new ExternalApiHealthCheckService(`${process.env.BASE_URL}`),
                new MongoDbHealthCheckService(),
                new RedisHealthCheckService(),
                new ServerHealthCheckService(),
            ]);

            const healthCheckResult = await response.check();

            return healthCheckResult;
        } catch (error) {
            console.error(`Error while getting Health status: `, error);
            throw wrapServiceError(error);
        }
    }

    async getSystemMetrics(): Promise<ISystemMetricsDTO> {  
        try {
            const data = await this._adminRepository.getSystemMetrics();
        
            return data;
        } catch (error) {
            console.error(`Error while getting System Metrics: `, error);
            throw wrapServiceError(error);
        }
    }
}