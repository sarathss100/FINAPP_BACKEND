import { IDebtDTO } from 'dtos/debt/DebtDto';
import { Debt } from 'utils/debt/simulateResult';

interface IDebtRepository {
    createDebt(debtData: IDebtDTO, userId: string): Promise<IDebtDTO>;
    getTotalDebt(userId: string): Promise<number>;
    getTotalOutstandingDebt(userId: string): Promise<number>;
    getTotalMonthlyPayment(userId: string): Promise<number>;
    getLongestTenure(userId: string): Promise<number>;
    getDebtCategorized(userId: string, category: string): Promise<IDebtDTO[]>;
    getRepaymentStrategyComparison(userId: string): Promise<Debt[]>;
    getAllDebts(userId: string): Promise<IDebtDTO[]>;
    deleteDebt(debtId: string): Promise<boolean>;
    updateExpiry(): Promise<void>;
    markEndedDebtsAsCompleted(): Promise<void>;
    markAsPaid(debtId: string): Promise<boolean>;
    getDebtForNotifyUpcomingDebtPayments(): Promise<IDebtDTO[]>;
}

export default IDebtRepository;
