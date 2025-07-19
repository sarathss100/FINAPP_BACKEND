import { UserModel } from 'model/user/model/UserModel';
import IAdminRepository from './interfaces/IAdminRepository';
import IUserDetails from './interfaces/IUserDetails';
import { FaqModel } from 'model/admin/model/FaqModel';
import { IFaq } from 'dtos/base/FaqDto';
import { ISystemMetrics } from './interfaces/ISystemMetrics';
import osUtils from 'os-utils';
import checkDiskSpace from 'check-disk-space';
import IPaginationMeta from 'dtos/admin/IPaginationMeta';

class AdminRepository implements IAdminRepository {
    private static _instance: AdminRepository;
    public constructor() {};

    public static get instance(): AdminRepository {
        if (!AdminRepository._instance) {
            AdminRepository._instance = new AdminRepository();
        }
        return AdminRepository._instance;
    }
    // Retrieve all users from the database
    async findAllUsers(): Promise<IUserDetails[] | null> {
        const users = await UserModel.find({ role: 'user' }).lean();
        const userDetails: IUserDetails[] = users.map((user) => ({
            userId: String(user._id),
            firstName: user.first_name,
            lastName: user.last_name,
            phoneNumber: user.phone_number,
            is2FA: user.is2FA,
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

    /**
    * Adds a new FAQ entry to the database.
    *
    * This function inserts a new FAQ item containing a question and answer into the FaqModel.
    * Returns true if the insertion was successful, false otherwise.
    *
    * @param {IFaq} newFaq - The FAQ object to be added. Must contain 'question' and 'answer'.
    * @returns {Promise<boolean>} A promise that resolves to true if the FAQ was successfully added,
    *                            or false otherwise.
    * @throws {Error} If an error occurs during the database insertion, an error is thrown
    *                 with a descriptive message indicating the failure.
    */
    async addFaq(newFaq: IFaq): Promise<boolean> {
        try {
            const result = await FaqModel.insertOne({ question: newFaq.question, answer: newFaq.answer });

            return result ? true : false;
        } catch (error) {
            // Log the raw error for debugging purposes
            console.error('Error during FAQ addition:', error);
        
            // Throw a new, user-friendly error with context
            throw new Error(`Failed to add FAQ: ${(error as Error).message}`);
        }
    }

    // Function retrieve all Faq details for admin
    async getAllFaqsForAdmin(page = 1, limit = 10, search = ''): Promise<{ faqDetails: IFaq[], pagination: IPaginationMeta }> {
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
            
            return {
                faqDetails,
                pagination
            }
        } catch (error) {
            console.error('Error while fetching FAQs:', error);
            throw new Error(`Failed to retrieve FAQs: ${(error as Error).message}`);
        }
    }

    /**
     * Deletes an FAQ entry by its ID.
     *
     * This function searches for an FAQ document in the database using the provided `faqId`
     * and removes it. It returns true if the deletion was successful, false otherwise.
     *
     * @param {string} faqId - The unique identifier of the FAQ to delete.
     * @returns {Promise<boolean>} A promise that resolves to true if the FAQ was successfully deleted,
     *                             or false if no matching FAQ was found.
     * @throws {Error} If an error occurs during the database operation, an error is thrown
     *                 with a descriptive message indicating the failure.
     */
    async deleteFaq(faqId: string): Promise<boolean> {
        try {
            const result = await FaqModel.findOneAndUpdate({ _id: faqId }, { $set: { isDeleted: true, isPublished: false }});

            return !!result; // Return true if a document was deleted, false otherwise
        } catch (error) {
            // Log the raw error for debugging purposes
            console.error('Error while deleting FAQ:', error);
        
            // Throw a new, user-friendly error with context
            throw new Error(`Failed to delete FAQ: ${(error as Error).message}`);
        }
    }

    /**
     * Toggles the 'isPublished' status of an FAQ entry by its ID.
     *
     * This function finds an FAQ by ID and flips the value of the 'isPublished' field.
     * Returns true if the update was successful, false otherwise (e.g., FAQ not found).
     *
     * @param {string} faqId - The unique identifier of the FAQ to update.
     * @returns {Promise<boolean>} A promise that resolves to true if the FAQ was successfully toggled,
     *                             or false if no matching FAQ was found.
     * @throws {Error} If an error occurs during the database operation, an error is thrown
     *                 with a descriptive message indicating the failure.
     */
    async togglePublish(faqId: string): Promise<boolean> {
        try {
            // Find the FAQ by ID
            const faq = await FaqModel.findById(faqId);
        
            if (!faq) {
                return false; // FAQ not found
            }
        
            // Toggle the 'isPublished' field
            faq.isPublished = !faq.isPublished;
        
            // Save the updated document
            const updatedFaq = await faq.save();
        
            return !!updatedFaq; // Return true if successfully saved
        } catch (error) {
            // Log the raw error for debugging purposes
            console.error('Error while toggling FAQ publish status:', error);
        
            // Throw a new, user-friendly error with context
            throw new Error(`Failed to toggle FAQ publish status: ${(error as Error).message}`);
        }
    }

    /**
     * Updates an FAQ entry with the provided data.
     *
     * This function finds an FAQ by its ID and updates the specified fields.
     * It supports partial updates, so only the fields provided in `updatedData` will be modified.
     *
     * @param {string} faqId - The unique identifier of the FAQ to update.
     * @param {Partial<IFaq>} updatedData - An object containing the fields to update (e.g., question, answer, isPublished).
     * @returns {Promise<boolean>} A promise that resolves to true if the FAQ was successfully updated,
     *                             or false if no matching FAQ was found.
     * @throws {Error} If an error occurs during the database operation, an error is thrown
     *                 with a descriptive message indicating the failure.
     */
    async updateFaq(faqId: string, updatedData: Partial<IFaq>): Promise<boolean> {
        try {
            // Update only the provided fields
            const result = await FaqModel.updateOne(
                { _id: faqId },
                { $set: updatedData }
            );
        
            return result.matchedCount === 1 && result.modifiedCount === 1;
        } catch (error) {
            // Log the raw error for debugging purposes
            console.error('Error while updating FAQ:', error);
        
            // Throw a new, user-friendly error with context
            throw new Error(`Failed to update FAQ: ${(error as Error).message}`);
        }
    }

    // Fetches all FAQ entries from the database for admin
    async getAllFaqs(): Promise<IFaq[] | null> {
        const result = await FaqModel.find();
        console.log(`Admin Repository:`, result);
        return result;
    }
}

export default AdminRepository;
