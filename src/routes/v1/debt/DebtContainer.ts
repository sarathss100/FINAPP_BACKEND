import DebtService from '../../../services/debt/DebtService';
import DebtController from '../../../controller/debt/DebtController';
import IDebtController from '../../../controller/debt/interfaces/IDebtController';
import createDebtRouter from './debtRouter';
import DebtRepository from '../../../repositories/debt/DebtRepository';

export default class DebtContainer {
    public readonly controller: IDebtController;
    public readonly router: ReturnType<typeof createDebtRouter>;

    constructor() {
        const repository = new DebtRepository();
        const service = new DebtService(repository);
        this.controller = new DebtController(service);
        this.router = createDebtRouter(this.controller);
    }
}
