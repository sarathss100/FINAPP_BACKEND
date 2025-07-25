import { InvestmentDTO } from '../../../dtos/investments/investmentDTO';

interface IInvestmentManagementRepository {
    createInvestment(investmentData: InvestmentDTO, userId: string): Promise<InvestmentDTO>;
    updateInvestmentBulk(investments: InvestmentDTO[]): Promise<void>;
    getInvestments(investmentType: string): Promise<InvestmentDTO[]>;
    totalInvestment(userId: string): Promise<number>;
    currentTotalValue(userId: string): Promise<number>;
    getTotalReturns(userId: string): Promise<number>;
    getCategorizedInvestments(userId: string): Promise<Record<string, InvestmentDTO[]>>;
    removeInvestment(investmentType: string, investmentId: string): Promise<InvestmentDTO>;
} 

export default IInvestmentManagementRepository;
