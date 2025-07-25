import { InvestmentDTO } from '../../../dtos/investments/investmentDTO';
import IStock from './IStock';

interface IInvestmentService {
    searchStocks(keyword: string): Promise<IStock[]>;
    createInvestment(accessToken: string, investmentData: InvestmentDTO): Promise<InvestmentDTO>;
    updateStockPrice(): Promise<void>;
    updateMutualFundPrice(): Promise<void>;
    updateGoldPrice(): Promise<void>;
    updateBondPrice(): Promise<void>;
    totalInvestment(accessToken: string): Promise<number>;
    currentTotalValue(accessToken: string): Promise<number>;
    getTotalReturns(accessToken: string): Promise<number>;
    getCategorizedInvestments(accessToken: string): Promise<Record<string, InvestmentDTO[]>>;
    removeInvestment(investmentType: string, investmentId: string): Promise<void>;
}

export default IInvestmentService;

