import { InvestmentDTO } from 'dtos/investments/investmentDTO';
import IStock from './IStock';

interface IInvestmentService {
    searchStocks(keyword: string): Promise<IStock[]>;
    createInvestment(accessToken: string, investmentData: InvestmentDTO): Promise<InvestmentDTO>;
}

export default IInvestmentService;

