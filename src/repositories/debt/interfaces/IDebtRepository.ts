import { IDebtDocument } from '../../../model/debt/interfaces/IDebt';
import { Debt } from '../../../utils/debt/simulateResult';

export default interface IDebtRepository {
    createDebt(debtData: Partial<IDebtDocument>, userId: string): Promise<IDebtDocument>;
    getTotalDebt(userId: string): Promise<number>;
    getTotalOutstandingDebt(userId: string): Promise<number>;
    getTotalMonthlyPayment(userId: string): Promise<number>;
    getLongestTenure(userId: string): Promise<number>;
    getDebtCategorized(userId: string, category: string): Promise<IDebtDocument[]>;
    getRepaymentStrategyComparison(userId: string): Promise<Debt[]>;
    getAllDebts(userId: string): Promise<IDebtDocument[]>;
    deleteDebt(debtId: string): Promise<IDebtDocument>;
    updateExpiry(): Promise<void>;
    markEndedDebtsAsCompleted(): Promise<void>;
    markAsPaid(debtId: string): Promise<boolean>;
    getDebtForNotifyUpcomingDebtPayments(): Promise<IDebtDocument[]>;
}