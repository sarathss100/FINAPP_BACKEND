import { IDebtDTO } from 'dtos/debt/DebtDto';

interface IDebtService {
    createDebt(accessToken: string, debtData: IDebtDTO): Promise<IDebtDTO>;
    getTotalDebt(accessToken: string): Promise<number>;
    getTotalOutstandingDebt(accessToken: string): Promise<number>;
    getTotalMonthlyPayment(accessToken: string): Promise<number>;
    getLongestTenure(accessToken: string): Promise<number>;
}

export default IDebtService;

