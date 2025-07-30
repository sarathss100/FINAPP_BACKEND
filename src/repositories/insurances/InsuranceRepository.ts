import mongoose from 'mongoose';
import IInsuranceRepository from './interfaces/IInsuranceRepository';
import { InsuranceModel } from '../../model/insurances/model/InsuranceModel';
import IInsuranceDocument from '../../model/insurances/interfaces/IInsurance';
import IBaseRepository from '../base_repo/interface/IBaseRepository';
import BaseRepository from '../base_repo/BaseRepository';

export default class InsuranceRepository implements IInsuranceRepository {
    private static _instance: InsuranceRepository;
    private baseRepo: IBaseRepository<IInsuranceDocument> = new BaseRepository<IInsuranceDocument>(InsuranceModel);
    public constructor() { }

    public static get instance(): InsuranceRepository {
        if (!InsuranceRepository._instance) {
            InsuranceRepository._instance = new InsuranceRepository();
        }
        return InsuranceRepository._instance;
    }

    async createInsurance(insuranceData: Partial<IInsuranceDocument>, userId: string): Promise<IInsuranceDocument> {
        try {
            const mongooseUserId = new mongoose.Types.ObjectId(userId);
        
            const result = await this.baseRepo.create({ ...insuranceData, userId: mongooseUserId });

            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async removeInsurance(insuranceId: string): Promise<IInsuranceDocument> {
        try {
            const result = await this.baseRepo.deleteOne({ _id: insuranceId });

            if (!result) throw new Error('Failed to delete insurance');

            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getUserInsuranceCoverageTotal(userId: string): Promise<number> {
        try {
            const result = await InsuranceModel.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        status: "active"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalCoverage: { $sum: "$coverage" }
                    }
                }
            ]);
        
            return result[0]?.totalCoverage || 0;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getUserTotalPremiumAmount(userId: string): Promise<number> {
        try {
            const result = await InsuranceModel.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        status: "active"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalPremium: { $sum: "$premium" }
                    }
                }
            ]);
        
            return result[0]?.totalPremium || 0;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getAllInsurances(userId: string): Promise<IInsuranceDocument[]> {
        try {
            const result = await this.baseRepo.find({ userId });
        
            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getClosestNextPaymentDate(userId: string): Promise<IInsuranceDocument> {
        try {
            const results = await InsuranceModel.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId),
                        status: 'active',
                        payment_status: 'paid',
                        next_payment_date: { $gte: new Date() }
                    }
                },
                {
                    $sort: {
                        next_payment_date: 1
                    }
                },
                {
                    $limit: 1
                }
            ]);

            if (!results || results.length === 0) {
                throw new Error(`Failed to get closest next payment data`);
            }

            const insurance = results[0];

            return insurance;
       } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async markPaymentAsPaid(insuranceId: string): Promise<IInsuranceDocument> {
        try {
            const insurance = await this.baseRepo.findById(insuranceId);
            if (!insurance) {
                throw new Error('Insurance policy not found');
            }

            // Calculate next payment date: add 365 days to the current next_payment_date
            const currentNextPaymentDate = insurance.next_payment_date;
            const newNextPaymentDate = new Date(currentNextPaymentDate);
            newNextPaymentDate.setDate(newNextPaymentDate.getDate() + 365);

            // Update both the payment status and the next payment date
            const updatedInsurance = await this.baseRepo.updateOne(
                { _id: insuranceId },
                {
                    $set: {
                        payment_status: "paid",
                        status: "active",
                        next_payment_date: newNextPaymentDate
                    }
                },
            );

            if (!updatedInsurance) {
                throw new Error('Failed to update insurance policy');
            }


            return updatedInsurance;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

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
            throw new Error((error as Error).message);
        }
    }

    async getInsuranceForNotifyInsurancePayments(): Promise<IInsuranceDocument[]> {
        try {
            const now = new Date();
            const twoDaysFromNow = new Date();
            twoDaysFromNow.setDate(now.getDate() + 2);

            // Fetch only those policies whose next payment date is within the next 2 days
            const insurances = await this.baseRepo.find({
                next_payment_date: {
                    $gte: now,
                    $lte: twoDaysFromNow
                }
            });

            return insurances;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}