import DebtManagementRepository from '../../../repositories/debt/DebtManagementRepository';
import DebtService from '../../../services/debt/DebtService';
import DebtController from '../../../controller/debt/DebtController';
import IDebtController from '../../../controller/debt/interfaces/IDebtController';
import createDebtRouter from './debtRouter';

class DebtContainer {
    public readonly controller: IDebtController;
    public readonly router: ReturnType<typeof createDebtRouter>;

    constructor() {
        const repository = new DebtManagementRepository();
        const service = new DebtService(repository);
        this.controller = new DebtController(service);
        this.router = createDebtRouter(this.controller);
    }
}

export default DebtContainer;
