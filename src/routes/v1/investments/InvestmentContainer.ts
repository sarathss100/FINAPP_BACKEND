import InvestmentManagementRepository from '../../../repositories/investments/InvestmentManagementRepository';
import InvestmentService from '../../../services/investments/InvestmentService';
import InvestmentController from '../../../controller/investments/InvestmentController';
import IInvestmentController from '../../../controller/investments/interfaces/IInvestmentController';
import createInvestmentRouter from './InvestmentRouter';

class InvestmentContainer {
    public readonly controller: IInvestmentController;
    public readonly router: ReturnType<typeof createInvestmentRouter>;

    constructor() {
        const repository = new InvestmentManagementRepository();
        const service = new InvestmentService(repository);
        this.controller = new InvestmentController(service);
        this.router = createInvestmentRouter(this.controller);
    }
}

export default InvestmentContainer;

