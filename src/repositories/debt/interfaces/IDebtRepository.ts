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
}

export default IDebtRepository;
