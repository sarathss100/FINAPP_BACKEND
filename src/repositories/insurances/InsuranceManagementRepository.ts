import mongoose from 'mongoose';
import IInsuranceManagementRepository from './interfaces/IInsuranceManagementRepository';
import { InsuranceDTO } from 'dtos/insurances/insuranceDTO';
import { InsuranceModel } from 'model/insurances/model/InsuranceModel';

class InsuranceManagementRepository implements IInsuranceManagementRepository {
    private static _instance: InsuranceManagementRepository;
    public constructor() { }

    public static get instance(): InsuranceManagementRepository {
        if (!InsuranceManagementRepository._instance) {
            InsuranceManagementRepository._instance = new InsuranceManagementRepository();
        }
        return InsuranceManagementRepository._instance;
    }

    // Creates a new insurance record in the database.
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

    // Removes an existing insurance record from the database by its ID.
    async removeInsurance(insuranceId: string): Promise<InsuranceDTO | null> {
        try {
            const result = await InsuranceModel.findByIdAndDelete(insuranceId).exec();

            if (!result) {
                return null;
            }

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
            console.error('Error deleting insurance:', error);
            throw new Error(`Failed to delete insurance: ${(error as Error).message}`);
        }
    }

    // Calculates the total coverage amount from all active insurance policies for a given user.
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
            throw new Error(`Failed to calculate insurance coverage`);
        }
    }

    // Calculates the total premium amount from all active insurance policies for a given user.
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
            console.error('Error calculating total insurance annual premium:', error);
            throw new Error(`Failed to calculate insurance annual premium`);
        }
    }

    // Retrieves all insurance records for a given user from the database.
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
            throw new Error(`Failed to fetch insurance records`);
        }
    }

    // Retrieves the insurance policy with the closest upcoming next payment date from all active policies for a given user.
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
            throw new Error(`Failed to fetch closest next payment insurance`);
        }
    }

    // Updates the payment status of an insurance policy to "paid" and revises the next payment date to 365 days ahead.
    async markPaymentAsPaid(insuranceId: string): Promise<InsuranceDTO> {
        try {
            // Fetch the current document to get the current next_payment_date
            const insurance = await InsuranceModel.findById(insuranceId);
            if (!insurance) {
                throw new Error('Insurance policy not found');
            }

            // Calculate next payment date: add 365 days to the current next_payment_date
            const currentNextPaymentDate = insurance.next_payment_date;
            const newNextPaymentDate = new Date(currentNextPaymentDate);
            newNextPaymentDate.setDate(newNextPaymentDate.getDate() + 365);

            // Update both the payment status and the next payment date
            const updatedInsurance = await InsuranceModel.findByIdAndUpdate(
                insuranceId,
                {
                    $set: {
                        payment_status: "paid",
                        status: "active",
                        next_payment_date: newNextPaymentDate
                    }
                },
                { new: true }
            );

            if (!updatedInsurance) {
                throw new Error('Failed to update insurance policy');
            }

            // Convert Mongoose document to InsuranceDTO
            const refinedData: InsuranceDTO = {
                _id: String(updatedInsurance._id),
                userId: String(updatedInsurance.userId),
                type: updatedInsurance.type,
                coverage: updatedInsurance.coverage,
                premium: updatedInsurance.premium,
                next_payment_date: updatedInsurance.next_payment_date,
                payment_status: updatedInsurance.payment_status,
                status: updatedInsurance.status,
            };

            return refinedData;
        } catch (error) {
            console.error('Error updating insurance payment status:', error);
            throw new Error(`Failed to update payment status: ${(error as Error).message}`);
        }
    }

    /**
     * Marks insurance policies as expired if their next payment date has passed and they are still marked as paid.
     * Updates the payment status to "unpaid" and the policy status to "expired".
     */
    async markExpiredInsurances(): Promise<void> {
        try {
            const today = new Date();
            await InsuranceModel.updateMany(
                {
                    next_payment_date: { $lt: today },
                    payment_status: 'paid',
                    status: { $ne: 'expired' }
                },
                {
                    $set: {
                        payment_status: 'unpaid',
                        status: 'expired'
                    }
                }
            );
        } catch (error) {
            console.error('Error updating insurance payment status:', error);
            throw new Error(`Failed to update payment status: ${(error as Error).message}`);
        }
    }

    // Retrieves insurance policies whose next payment date is within the next 2 days.
    async getInsuranceForNotifyInsurancePayments(): Promise<InsuranceDTO[]> {
        try {
            const now = new Date();
            const twoDaysFromNow = new Date();
            twoDaysFromNow.setDate(now.getDate() + 2);

            // Fetch only those policies whose next payment date is within the next 2 days
            const insurances = await InsuranceModel.find({
                next_payment_date: {
                    $gte: now,
                    $lte: twoDaysFromNow
                }
            });

            const refinedData: InsuranceDTO[] = insurances.map((data) => ({
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
            console.error('Error fetching insurance records:', error);
            throw new Error(`Failed to retrieve insurance data: ${(error as Error).message}`);
        }
    }
}

export default InsuranceManagementRepository;

