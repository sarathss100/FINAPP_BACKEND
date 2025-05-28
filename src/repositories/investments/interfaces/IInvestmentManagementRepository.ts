import { InvestmentDTO } from 'dtos/investments/investmentDTO';

interface IInvestmentManagementRepository {
    createInvestment(investmentData: InvestmentDTO, userId: string): Promise<InvestmentDTO>;
}

export default IInvestmentManagementRepository;
