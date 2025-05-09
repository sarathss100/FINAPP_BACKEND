import { UserModel } from 'model/user/model/UserModel';
import IAdminRepository from './interfaces/IAdminRepository';
import IUserDetails from './interfaces/IUserDetails';
import { FaqModel } from 'model/admin/model/FaqModel';
import { IFaq } from 'dtos/base/FaqDto';
import { ISystemMetrics } from './interfaces/ISystemMetrics';
import osUtils from 'os-utils';
import checkDiskSpace from 'check-disk-space';

class AdminRepository implements IAdminRepository {
    // Retrieve all users from the database
    async findAllUsers(): Promise<IUserDetails[] | null> {
        const users = await UserModel.find({}).lean();
        const userDetails: IUserDetails[] = users.map((user) => ({
            userId: String(user._id),
            firstName: user.first_name,
            lastName: user.last_name,
            phoneNumber: user.phone_number,
            status: user.status,
            role: user.role
        }));

        return userDetails;
    }

    // Handle toggling user status (block/unblock) for admin
    async toggleUserStatus(_id: string, status: boolean): Promise<boolean> {
        const updateResult = await UserModel.updateOne({ _id }, { $set: { status } });
        if (updateResult.modifiedCount > 0) return true;
        return false;
    }

    // Fetches the count of new registrations from the database
    async getNewRegistrationCount(): Promise<number> {
        const count = await UserModel.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000 * 7) } });
        return count;
    };

    // Fetches the system metrics 
    async getSystemMetrics(): Promise<ISystemMetrics> {
        const availableMem = osUtils.freememPercentage();
        const ramUsage = (1 - availableMem) * 100;

        // Disk usage 
        const { free, size } = await checkDiskSpace(process.platform === 'win32' ? 'C:\\' : '/');
        const diskUsage = ((size - free) / size) * 100;

        return { ramUsage, diskUsage };
    }

    // Add a new FAQ entry to the list
    async addFaq(newFaq: IFaq): Promise<boolean> {
        const result = await FaqModel.insertOne({ question: newFaq.question, answer: newFaq.answer });
        return result ? true : false;
    }

    // Update FAQ entry to the list
    async updateFaq(faqId: string, updatedData: Partial<IFaq>): Promise<boolean> {
        console.log(faqId, updatedData);
        return true;
    }

    // Delete FAQ entry to the list
    async deleteFaq(faqId: string): Promise<boolean> {
        console.log(faqId);
        return true;
    }

    // Fetches all FAQ entries from the database for admin
    async getAllFaqs(): Promise<IFaq[] | null> {
        const result = await FaqModel.find();
        console.log(`Admin Repository:`, result);
        return result;
    }
}

export default AdminRepository;
