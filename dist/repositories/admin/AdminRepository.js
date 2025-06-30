"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("model/user/model/UserModel");
const FaqModel_1 = require("model/admin/model/FaqModel");
const os_utils_1 = __importDefault(require("os-utils"));
const check_disk_space_1 = __importDefault(require("check-disk-space"));
class AdminRepository {
    // Retrieve all users from the database
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield UserModel_1.UserModel.find({}).lean();
            const userDetails = users.map((user) => ({
                userId: String(user._id),
                firstName: user.first_name,
                lastName: user.last_name,
                phoneNumber: user.phone_number,
                status: user.status,
                role: user.role
            }));
            return userDetails;
        });
    }
    // Handle toggling user status (block/unblock) for admin
    toggleUserStatus(_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield UserModel_1.UserModel.updateOne({ _id }, { $set: { status } });
            if (updateResult.modifiedCount > 0)
                return true;
            return false;
        });
    }
    // Fetches the count of new registrations from the database
    getNewRegistrationCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield UserModel_1.UserModel.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000 * 7) } });
            return count;
        });
    }
    ;
    // Fetches the system metrics 
    getSystemMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            const availableMem = os_utils_1.default.freememPercentage();
            const ramUsage = (1 - availableMem) * 100;
            // Disk usage 
            const { free, size } = yield (0, check_disk_space_1.default)(process.platform === 'win32' ? 'C:\\' : '/');
            const diskUsage = ((size - free) / size) * 100;
            return { ramUsage, diskUsage };
        });
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
    addFaq(newFaq) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield FaqModel_1.FaqModel.insertOne({ question: newFaq.question, answer: newFaq.answer });
                return result ? true : false;
            }
            catch (error) {
                // Log the raw error for debugging purposes
                console.error('Error during FAQ addition:', error);
                // Throw a new, user-friendly error with context
                throw new Error(`Failed to add FAQ: ${error.message}`);
            }
        });
    }
    /**
     * Retrieves all FAQ entries from the database for administrative purposes.
     *
     * This function fetches all documents stored in the FaqModel and returns them
     * as an array of IFaq objects. It is intended for use by admin interfaces or services.
     *
     * @returns {Promise<IFaq[]>} A promise that resolves to an array of FAQ objects.
     * @throws {Error} If an error occurs during the database retrieval, an error is thrown
     *                 with a descriptive message indicating the failure.
     */
    getAllFaqsForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield FaqModel_1.FaqModel.find({ isDeleted: false }).sort({ updatedAt: -1 });
                return result;
            }
            catch (error) {
                // Log the raw error for debugging purposes
                console.error('Error while fetching FAQs:', error);
                // Throw a new, user-friendly error with context
                throw new Error(`Failed to retrieve FAQs: ${error.message}`);
            }
        });
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
    deleteFaq(faqId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield FaqModel_1.FaqModel.findOneAndUpdate({ _id: faqId }, { $set: { isDeleted: true, isPublished: false } });
                return !!result; // Return true if a document was deleted, false otherwise
            }
            catch (error) {
                // Log the raw error for debugging purposes
                console.error('Error while deleting FAQ:', error);
                // Throw a new, user-friendly error with context
                throw new Error(`Failed to delete FAQ: ${error.message}`);
            }
        });
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
    togglePublish(faqId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the FAQ by ID
                const faq = yield FaqModel_1.FaqModel.findById(faqId);
                if (!faq) {
                    return false; // FAQ not found
                }
                // Toggle the 'isPublished' field
                faq.isPublished = !faq.isPublished;
                // Save the updated document
                const updatedFaq = yield faq.save();
                return !!updatedFaq; // Return true if successfully saved
            }
            catch (error) {
                // Log the raw error for debugging purposes
                console.error('Error while toggling FAQ publish status:', error);
                // Throw a new, user-friendly error with context
                throw new Error(`Failed to toggle FAQ publish status: ${error.message}`);
            }
        });
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
    updateFaq(faqId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Update only the provided fields
                const result = yield FaqModel_1.FaqModel.updateOne({ _id: faqId }, { $set: updatedData });
                return result.matchedCount === 1 && result.modifiedCount === 1;
            }
            catch (error) {
                // Log the raw error for debugging purposes
                console.error('Error while updating FAQ:', error);
                // Throw a new, user-friendly error with context
                throw new Error(`Failed to update FAQ: ${error.message}`);
            }
        });
    }
    // Fetches all FAQ entries from the database for admin
    getAllFaqs() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield FaqModel_1.FaqModel.find();
            console.log(`Admin Repository:`, result);
            return result;
        });
    }
}
exports.default = AdminRepository;
