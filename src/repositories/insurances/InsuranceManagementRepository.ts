import mongoose from 'mongoose';
import IInsuranceManagementRepository from './interfaces/IInsuranceManagementRepository';
import { InsuranceDTO } from 'dtos/insurances/insuranceDTO';
import { InsuranceModel } from 'model/insurances/model/InsuranceModel';

class InsuranceManagementRepository implements IInsuranceManagementRepository {

    /**
     * Creates a new insurance record in the database.
     *
     * @param {InsuranceDTO} insuranceData - The validated insurance data from the frontend.
     * @param {string} userId - The ID of the user creating the insurance (as a string).
     * @returns {Promise<InsuranceDTO>} - A promise resolving to the created insurance data.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async createInsurance(insuranceData: InsuranceDTO, userId: string): Promise<InsuranceDTO> {
        try {
            const mongooseUserId = new mongoose.Types.ObjectId(userId);
        
            const result = await InsuranceModel.create({ ...insuranceData, userId: mongooseUserId });
            const refinedData: InsuranceDTO = {
                _id: String(result._id),
                userId: String(result.userId),
                type: result.type,
                coverage: result.coverage,
                premium: result.premium,
                next_payment_date: result.next_payment_date,
                payment_status: result.payment_status,
                status: result.status,
            };
            return refinedData;
        } catch (error) {
            console.error('Error creating insurance:', error);
            throw new Error(`Failed to create insurance: ${(error as Error).message}`);
        }
    }

    /**
     * Removes an existing insurance record from the database by its ID.
     *
     * @param {string} insuranceId - The ID of the insurance record to delete.
     * @returns {Promise<boolean>} - A promise resolving to `true` if the insurance was deleted, or `false` if not found.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async removeInsurance(insuranceId: string): Promise<boolean> {
        try {
            const result = await InsuranceModel.findByIdAndDelete({ _id: insuranceId });
            return result ? true : false;
        } catch (error) {
            console.error('Error deleting insurance:', error);
            throw new Error(`Failed to delete insurance: ${(error as Error).message}`);
        }
    }

    /**
     * Calculates the total coverage amount from all active insurance policies for a given user.
     *
     * @param {string} userId - The ID of the user whose insurance coverage is being calculated.
     * @returns {Promise<number>} - A promise resolving to the total coverage amount.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getUserInsuranceCoverageTotal(userId: string): Promise<number> {
        try {
            const result = await InsuranceModel.aggregate([
                // Match only active insurance policies for the given userId
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        status: "active"
                    }
                },
                // Sum up the coverage values
                {
                    $group: {
                        _id: null,
                        totalCoverage: { $sum: "$coverage" }
                    }
                }
            ]);
        
            // Return the total coverage or 0 if no active policies found
            return result[0]?.totalCoverage || 0;
        } catch (error) {
            console.error('Error calculating total insurance coverage:', error);
            throw new Error(`Failed to calculate insurance coverage: ${(error as Error).message}`);
        }
    }

    /**
     * Calculates the total premium amount from all active insurance policies for a given user.
     *
     * @param {string} userId - The ID of the user whose insurance premiums are being summed.
     * @returns {Promise<number>} - A promise resolving to the total premium amount of active insurance policies.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getUserTotalPremiumAmount(userId: string): Promise<number> {
        try {
            const result = await InsuranceModel.aggregate([
                // Match only active insurance policies for the given userId
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        status: "active"
                    }
                },
                // Sum up the premium values
                {
                    $group: {
                        _id: null,
                        totalPremium: { $sum: "$premium" }
                    }
                }
            ]);
        
            // Return the total premium or 0 if no active policies found
            return result[0]?.totalPremium || 0;
        } catch (error) {
            console.error('Error calculating total insurance coverage:', error);
            throw new Error(`Failed to calculate insurance coverage: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves all insurance records for a given user from the database.
     *
     * @param {string} userId - The ID of the user whose insurance records are being fetched.
     * @returns {Promise<InsuranceDTO[]>} - A promise resolving to an array of insurance DTOs.
     * @throws {Error} - Throws an error if the database operation fails.
     */
    async getAllInsurances(userId: string): Promise<InsuranceDTO[]> {
        try {
            const result = await InsuranceModel.find({ userId });
        
            const refinedData: InsuranceDTO[] = result.map((data) => ({
                _id: String(data._id),
                userId: String(data.userId),
                type: data.type,
                coverage: data.coverage,
                premium: data.premium,
                next_payment_date: data.next_payment_date,
                payment_status: data.payment_status,
                status: data.status,
            }));
        
            return refinedData;
        } catch (error) {
            console.error('Error fetching insurances:', error);
            throw new Error(`Failed to fetch insurance records: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves the insurance policy with the closest upcoming next payment date from all active policies for a given user.
     *
     * @param {string} userId - The ID of the user whose active insurance policies are being checked.
     * @returns {Promise<InsuranceDTO | null>} A promise resolving to the DTO of the insurance policy with the nearest upcoming next payment date, or null if no such policy exists.
     * @throws {Error} Throws an error if the database operation fails.
     */
    async getClosestNextPaymentDate(userId: string): Promise<InsuranceDTO | null> {
        try {
            const results = await InsuranceModel.aggregate([
                // Match only active policies with upcoming payments
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        status: 'active',
                        payment_status: 'paid',
                        next_payment_date: { $gte: new Date() }
                    }
                },
                // Sort by closest next payment date
                {
                    $sort: {
                        next_payment_date: 1
                    }
                },
                // Limit to the closest one
                {
                    $limit: 1
                }
            ]);

            // If no matching policy found, return null
            if (!results || results.length === 0) {
                return null;
            }

            const insurance = results[0];

            // Map to InsuranceDTO
            const insuranceDTO: InsuranceDTO = {
                _id: insurance._id.toString(),
                userId: insurance.userId?.toString() || '',
                type: insurance.type,
                coverage: insurance.coverage,
                premium: insurance.premium,
                next_payment_date: insurance.next_payment_date,
                payment_status: insurance.payment_status,
                status: insurance.status
            };

            return insuranceDTO;
       } catch (error) {
            console.error('Error fetching closest next payment insurance:', error);
            throw new Error(`Failed to fetch closest next payment insurance: ${(error as Error).message}`);
        }
    }

    /**
     * Updates the payment status of an insurance policy to "paid".
     *
     * @param {string} insuranceId - The ID of the insurance policy to update.
     * @returns {Promise<boolean>} A promise resolving to true if the payment status was successfully updated, false otherwise.
     * @throws {Error} Throws an error if the database operation fails.
     */
    async markPaymentAsPaid(insuranceId: string): Promise<boolean> {
        try {
            const result = await InsuranceModel.updateOne(
                { _id: insuranceId },
                { $set: { payment_status: "paid", status: "active" } }
            );

            return result.modifiedCount > 0 ? true : false;
        } catch (error) {
            console.error('Error updating insurance payment status:', error);
            throw new Error(`Failed to update payment status: ${(error as Error).message}`);
        }
    }
}

export default InsuranceManagementRepository;

