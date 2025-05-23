import IStock from './IStock';

interface IInvestmentService {
    searchStocks(keyword: string): Promise<IStock[]>;
}

export default IInvestmentService;

