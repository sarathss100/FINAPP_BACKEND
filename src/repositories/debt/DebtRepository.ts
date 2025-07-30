import IDebtRepository from './interfaces/IDebtRepository';
import { DebtModel } from '../../model/debt/model/DebtModel';
import { Debt } from '../../utils/debt/simulateResult';
import calculateLoanBreakdown from '../../utils/debt/emiCalculator';
import { IDebtDocument } from '../../model/debt/interfaces/IDebt';
import IBaseRepository from '../base_repo/interface/IBaseRepository';
import BaseRepository from '../base_repo/BaseRepository';

export default class DebtRepository implements IDebtRepository {
    private static _instance: DebtRepository;
    private baseRepo: IBaseRepository<IDebtDocument> = new BaseRepository<IDebtDocument>(DebtModel);
    public constructor() {}

    public static get instance(): DebtRepository {
        if (!DebtRepository._instance) {
            DebtRepository._instance = new DebtRepository();
        }
        return DebtRepository._instance;
    }

    async createDebt(debtData: IDebtDocument, userId: string): Promise<IDebtDocument> {
        try {
            const result = await this.baseRepo.create({ ...debtData, userId });

            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getTotalDebt(userId: string): Promise<number> {
        try {
            const result = await DebtModel.aggregate([
                {
                    $match: {
                        userId,
                        isCompleted: false,
                        isDeleted: false
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalDebt: { $sum: "$initialAmount" } 
                    }
                }
            ]);

            return result[0]?.totalDebt || 0;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getTotalOutstandingDebt(userId: string): Promise<number> {
        try {
            const result = await DebtModel.aggregate([
                {
                    $match: {
                        userId,
                        isCompleted: false,
                        isDeleted: false
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalOutstanding: { $sum: "$currentBalance" }
                    }
                }
            ]);
        
            return result[0]?.totalOutstanding || 0;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getTotalMonthlyPayment(userId: string): Promise<number> {
        try {
            const result = await DebtModel.aggregate([
                {
                    $match: {
                        userId,
                        isCompleted: false,
                        isDeleted: false
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalMonthlyPayment: { $sum: "$monthlyPayment" }
                    }
                }
            ]);

            return result[0]?.totalMonthlyPayment || 0;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getLongestTenure(userId: string): Promise<number> {
        try {
            const result = await DebtModel.aggregate([
                {
                    $match: {
                        userId,
                        isCompleted: false,
                        isDeleted: false
                    }
                },
                {
                   $addFields: {
                        monthsFromEndToNow: {
                            $abs: {
                                $dateDiff: {
                                    startDate: "$endDate",
                                    endDate: "$$NOW",
                                    unit: "month"
                                }
                            }
                        }
                    }
                },
                {
                   $group: {
                     _id: null,
                     maxTenureDifference: { $max: "$monthsFromEndToNow" }
                   }
                }
            ]);

            return result[0]?.maxTenureDifference || 0
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getDebtCategorized(userId: string, category: string): Promise<IDebtDocument[]> {
        try {
            const isGoodDebt = category.toLowerCase() === 'good';
        
            const result = await DebtModel.aggregate([
                {
                    $match: {
                        userId,
                        isCompleted: false,
                        isDeleted: false,
                        isGoodDebt
                    }
                }
            ]);
        
            return result || [];
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getRepaymentStrategyComparison(userId: string): Promise<Debt[]> {
        try {
            const result = await DebtModel.aggregate([
                {
                    $match: {
                        userId,
                        isCompleted: false,
                        isDeleted: false,
                    }
                }
            ]);

            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getAllDebts(userId: string): Promise<IDebtDocument[]> {
        try {
            const result = await DebtModel.aggregate([
                {
                    $match: {
                        userId,
                        isDeleted: false
                    }
                }
            ]);

            return result
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteDebt(debtId: string): Promise<IDebtDocument> {
        try {
            const result = await this.baseRepo.updateOne({ _id: debtId }, { $set: { isDeleted: true } },);

            if (!result) throw new Error(`Failled to Delete Debt`);

            return result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async updateExpiry(): Promise<void> {
        try {
            const now = new Date();
         
            const expiredDebts = await this.baseRepo.find({
                isDeleted: false,
                isCompleted: false,
                status: 'Active',
                nextDueDate: { $lt: now },
                isExpired: { $ne: true }, 
            });
        
            if (expiredDebts.length > 0) {
                await DebtModel.updateMany(
                    { _id: { $in: expiredDebts.map(debt => debt._id) } },
                    { $set: { isExpired: true } },
                );
            }
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async markEndedDebtsAsCompleted(): Promise<void> {
        try {
            const now = new Date();

            // Find all active, non-deleted, and non-completed debts where endDate is in the past
            const endedDebts = await this.baseRepo.find({
                isDeleted: false,
                isCompleted: false,
                status: 'Active',
                endDate: { $lt: now },
                isExpired: { $ne: true }, 
            });

            if (endedDebts.length > 0) {
                // Update all ended debts to completed status
                await DebtModel.updateMany(
                    { _id: { $in: endedDebts.map(debt => debt._id) } },
                    { 
                        $set: { 
                            isExpired: false, 
                            isCompleted: true, 
                            status: 'Completed' 
                        } 
                    }
                );
            }
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async markAsPaid(debtId: string): Promise<boolean> {
        try {
            // Get current nextDueDate from the document
            const debt = await this.baseRepo.findById(debtId);

            if (!debt) {
                throw new Error('Debt not found');
            }

            const currentDueDate = debt.nextDueDate;

            // Calculate same day next month
            const nextMonthDueDate = new Date(currentDueDate);
            nextMonthDueDate.setMonth(nextMonthDueDate.getMonth() + 1);

            // Truncate time to midnight 
            nextMonthDueDate.setHours(0, 0, 0, 0);

            let result;
            if (debt.interestType === 'Diminishing') {
                const initialAmount = debt.initialAmount;
                const tenureMonths = debt.tenureMonths;
                const interestRate = debt.interestRate;
                const interestType = debt.interestType;
                // Calculate months elapsed since loan start
                const monthsElapsed = Math.floor((nextMonthDueDate.getTime() - debt.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

                // Recalculate next month emi if debt is diminishing 
                const nextEmi = await calculateLoanBreakdown({ initialAmount, tenureMonths, interestRate, interestType, targetMonth: monthsElapsed });

                // Update the document 
                result = await this.baseRepo.updateOne(
                    {_id: debtId},
                    {
                        $set: {
                            nextDueDate: nextMonthDueDate,
                            isExpired: false,
                            monthlyPayment: nextEmi.emi,
                            monthlyPrincipalPayment: nextEmi.principal,
                            montlyInterestPayment: nextEmi.interest,
                        }
                    }
                );
            } else {
                result = await this.baseRepo.updateOne(
                    {_id: debtId},
                    {
                        $set: {
                            nextDueDate: nextMonthDueDate,
                            isExpired: false
                        }
                    }
                );
            }
            
            return !!result;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getDebtForNotifyUpcomingDebtPayments(): Promise<IDebtDocument[]> {
        try {
            // Fetch all active debts (not deleted or completed)
            const debts = await this.baseRepo.find({ isDeleted: false, isCompleted: false });

            if (!debts || debts.length === 0) {
                return [];
            }

            return debts;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}
