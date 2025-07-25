import { IDebtDTO } from '../../../dtos/debt/DebtDto';
import { ComparisonResult } from '../../../utils/debt/simulateResult';

interface IDebtService {
    createDebt(accessToken: string, debtData: IDebtDTO): Promise<IDebtDTO>;
    getTotalDebt(accessToken: string): Promise<number>;
    getTotalOutstandingDebt(accessToken: string): Promise<number>;
    getTotalMonthlyPayment(accessToken: string): Promise<number>;
    getLongestTenure(accessToken: string): Promise<number>;
    getDebtCategorized(accessToken: string, category: string): Promise<IDebtDTO[]>;
    getRepaymentStrategyComparison(accessToken: string, extraAmount: number): Promise<ComparisonResult>;
    getAllDebts(accessToken: string): Promise<IDebtDTO[]>;
    deleteDebt(debtId: string): Promise<boolean>;
    updateExpiry(): Promise<void>;
    markEndedDebtsAsCompleted(): Promise<void>;
    markAsPaid(debtId: string): Promise<boolean>;
    getDebtsForNotifyUpcomingDebtPayments(): Promise<IDebtDTO[]>;
}

export default IDebtService;

