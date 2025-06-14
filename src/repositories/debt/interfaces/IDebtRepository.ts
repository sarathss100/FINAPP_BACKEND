import { IDebtDTO } from 'dtos/debt/DebtDto';

interface IDebtRepository {
    createDebt(debtData: IDebtDTO, userId: string): Promise<IDebtDTO>;
    getTotalDebt(userId: string): Promise<number>;
    getTotalOutstandingDebt(userId: string): Promise<number>;
    getTotalMonthlyPayment(userId: string): Promise<number>;
    getLongestTenure(userId: string): Promise<number>;
}

export default IDebtRepository;
