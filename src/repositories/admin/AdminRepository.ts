import { UserModel } from '../../model/user/model/UserModel';
import IAdminRepository from './interfaces/IAdminRepository';
import { FaqModel } from '../../model/admin/model/FaqModel';
import osUtils from 'os-utils';
import checkDiskSpace from 'check-disk-space';
import IPaginationMeta from '../../dtos/admin/IPaginationMetaDTO';
import ISystemMetricsDTO from '../../dtos/admin/ISystemMetricsDTO';
import IFaqDocument from '../../model/admin/interfaces/IFaq';
import IUserDocument from '../../model/user/interfaces/IUser';
import BaseRepository from '../base_repo/BaseRepository';
import IBaseRepository from '../base_repo/interface/IBaseRepository';

export default class AdminRepository implements IAdminRepository {
    private static _instance: AdminRepository;
    private userBaseRepo: IBaseRepository<IUserDocument> = new BaseRepository<IUserDocument>(UserModel);
    private faqBaseRepo: IBaseRepository<IFaqDocument> = new BaseRepository<IFaqDocument>(FaqModel);

    public constructor() {};

    public static get instance(): AdminRepository {
        if (!AdminRepository._instance) {
            AdminRepository._instance = new AdminRepository();
        }
        return AdminRepository._instance;
    }

    async findAllUsers(): Promise<IUserDocument[]> {
        try {
            const users = await this.userBaseRepo.find({ role: 'user' });

            return users;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async toggleUserStatus(_id: string, status: boolean): Promise<boolean> {
        try {
            const updatedUser = await this.userBaseRepo.updateOne({ _id }, { $set: { status } });

            return !!updatedUser;
        } catch (error) {
            throw new Error(`Failed to toggle user status: ${(error as Error).message}`);
        }
    }

    async getNewRegistrationCount(): Promise<number> {
        try {
            const count = await UserModel.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000 * 7) } });

            return count
        } catch (error) {
            throw new Error(`Failed to get new registration count: ${(error as Error).message} `);
        }
    };

    async getSystemMetrics(): Promise<ISystemMetricsDTO> {
        try {
            const availableMem = osUtils.freememPercentage();
            const ramUsage = (1 - availableMem) * 100;
            const { free, size } = await checkDiskSpace(process.platform === 'win32' ? 'C:\\' : '/');
            const diskUsage = ((size - free) / size) * 100;
            return { ram_usage: ramUsage, disk_usage: diskUsage };
        } catch (error) {
            throw new Error(`Failed to get System Metrics: ${(error as Error).message} `);
        }
    }

    async addFaq(newFaq: Partial<IFaqDocument>): Promise<boolean> {
        try {
            const result = await this.faqBaseRepo.create(newFaq);

            return !!result._id;
        } catch (error) {
            throw new Error(`Failed to add FAQ: ${(error as Error).message}`);
        }
    }

    async getAllFaqsForAdmin(page = 1, limit = 10, search = ''): Promise<{ faqDetails: IFaqDocument[], pagination: IPaginationMeta }> {
        try {
            const query: { isDeleted: boolean, $or?: { [key: string]: { $regex: string, $options: string } }[] } = { isDeleted: false };

            if (search) {
                query.$or = [
                    { question: { $regex: search, $options: 'i' } },
                    { answer: { $regex: search, $options: 'i' } },
                ];
            }

            const totalItems = await FaqModel.countDocuments(query);
            const totalPages = Math.ceil(totalItems / limit);


            const faqDetails = await FaqModel.find(query)
                .sort({ updatedAt: - 1 })
                .skip((page - 1) * limit)
                .limit(limit);

            const pagination: IPaginationMeta = {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            }

            return { faqDetails, pagination}; 
        } catch (error) {
            throw new Error(`Failed to retrieve FAQs: ${(error as Error).message}`);
        }
    }

    async deleteFaq(faqId: string): Promise<boolean> {
        try {
            const result = await this.faqBaseRepo.updateOne({ _id: faqId }, { $set: { isDeleted: true, isPublished: false }});

            return !!result; 
        } catch (error) {
            throw new Error(`Failed to delete FAQ: ${(error as Error).message}`);
        }
    }
    
    async togglePublish(faqId: string): Promise<boolean> {
        try {
            // Find the FAQ by ID
            const faq = await this.faqBaseRepo.findById(faqId);
        
            if (!faq) {
                return false;
            }
        
            // Toggle the 'isPublished' field
            faq.isPublished = !faq.isPublished;
        
            // Save the updated document
            const updatedFaq = await faq.save();
        
            return !!updatedFaq;
        } catch (error) {
            throw new Error(`Failed to toggle FAQ publish status: ${(error as Error).message}`);
        }
    }

    async updateFaq(faqId: string, updatedData: Partial<IFaqDocument>): Promise<boolean> {
        try {
            const result = await this.faqBaseRepo.updateOne(
                { _id: faqId },
                { $set: updatedData }
            );
        
            return result !== null;
        } catch (error) {
            throw new Error(`Failed to update FAQ: ${(error as Error).message}`);
        }
    }

    async getAllFaqs(): Promise<IFaqDocument[]> {
        try {
            const result = await this.faqBaseRepo.findAll();

            return result;
        } catch (error) {
            throw new Error(`Failed to fetch all FAQ: ${(error as Error).message}`);
        }
    }
}
